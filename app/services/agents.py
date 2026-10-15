"""Bounded specialist agents with persisted plans, tool events, and snapshots.

The model can select an allowed workflow, not execute arbitrary code or mutate law.
Jobs need one Uvicorn process; interrupted work is marked interrupted on restart.
"""
import asyncio
import functools
import hashlib
import json
import uuid
from concurrent.futures import ThreadPoolExecutor
from typing import Literal
from pydantic import BaseModel, Field
from app import store
from app.config import settings
from app.models import Assumptions, SocialOptions
from app.services import ai, analysis, legal, retrieval, simulation, social

ACTIVE = {'queued', 'running', 'cancelling'}
TASKS = {}
# Job bookkeeping runs on one ordered thread so a locked database never blocks the event loop.
DB_WRITER = ThreadPoolExecutor(max_workers=1, thread_name_prefix='rulelab-agent-db')

class JobRequest(BaseModel):
    intent: Literal['legal', 'impact', 'full', 'social'] = 'full'
    expected_revision: int = Field(ge=1)
    alternative_text: str | None = Field(default=None, min_length=10, max_length=100000)
    assumptions: Assumptions = Field(default_factory=Assumptions)
    social_options: SocialOptions = Field(default_factory=SocialOptions)
    as_of_date: str | None = Field(default=None, pattern=r'^\d{4}-\d{2}-\d{2}$')

class AgentPlan(BaseModel):
    workflow: Literal['legal', 'impact', 'full', 'social']
    rationale: str = Field(min_length=1, max_length=1500)

def initialize():
    with store.db() as c:
        c.executescript('''
        CREATE TABLE IF NOT EXISTS agent_jobs(
          id TEXT PRIMARY KEY,draft_id TEXT,revision INTEGER,owner TEXT,request_key TEXT,
          fingerprint TEXT,request TEXT,snapshot TEXT,status TEXT,plan TEXT DEFAULT '{}',
          result TEXT DEFAULT '{}',error TEXT DEFAULT '',created_at TEXT,updated_at TEXT,
          UNIQUE(owner,request_key));
        CREATE TABLE IF NOT EXISTS agent_events(
          id INTEGER PRIMARY KEY AUTOINCREMENT,job_id TEXT,agent TEXT,tool TEXT,
          status TEXT,detail TEXT,created_at TEXT);
        CREATE TABLE IF NOT EXISTS audit_events(
          id INTEGER PRIMARY KEY AUTOINCREMENT,request_id TEXT,actor TEXT,role TEXT,
          action TEXT,status INTEGER,created_at TEXT);
        ''')
        rows = c.execute("SELECT id FROM agent_jobs WHERE status IN ('queued','running','cancelling')").fetchall()
        for row in rows:
            c.execute("UPDATE agent_jobs SET status='interrupted',error=?,updated_at=? WHERE id=?",
                      ('The server stopped before the run finished. Partial results can be reviewed; start a new run if needed.', store.now(), row['id']))
            event(row['id'], 'coordinator', 'recovery', 'interrupted', {'reason': 'server_restart'}, connection=c)

def audit(request_id, actor, role, action, status):
    with store.db() as c:
        c.execute('INSERT INTO audit_events(request_id,actor,role,action,status,created_at) VALUES(?,?,?,?,?,?)',
                  (request_id, actor, role, action, status, store.now()))

def audit_rows(limit=100):
    with store.db() as c:
        return [dict(r) for r in c.execute('SELECT * FROM audit_events ORDER BY id DESC LIMIT ?', (limit,))]

def event(job_id, agent, tool, status, detail, connection=None):
    def write(c):
        c.execute('INSERT INTO agent_events(job_id,agent,tool,status,detail,created_at) VALUES(?,?,?,?,?,?)',
                  (job_id, agent, tool, status, json.dumps(detail, ensure_ascii=False), store.now()))
    if connection is not None:
        write(connection)
    else:
        with store.db() as c: write(c)

def get(job_id):
    with store.db() as c:
        row = c.execute('SELECT * FROM agent_jobs WHERE id=?', (job_id,)).fetchone()
        if not row: raise KeyError('Agent run not found.')
        result = dict(row)
        for key in ['plan', 'result']: result[key] = json.loads(result[key])
        request=json.loads(result['request'])
        result['intent'] = request['intent']
        result['social_options'] = request.get('social_options',{'persona_count':8,'rounds':3})
        result.pop('request'); result.pop('snapshot'); result.pop('fingerprint'); result.pop('request_key')
        result['events'] = [{**dict(e), 'detail': json.loads(e['detail'])} for e in c.execute(
            'SELECT * FROM agent_events WHERE job_id=? ORDER BY id', (job_id,))]
        result['stale'] = store.get_draft(result['draft_id'], c)['revision'] != result['revision']
        return result

def list_jobs(draft_id):
    store.get_draft(draft_id)
    with store.db() as c:
        ids = [r['id'] for r in c.execute('SELECT id FROM agent_jobs WHERE draft_id=? ORDER BY created_at DESC LIMIT 30', (draft_id,))]
    return [get(id) for id in ids]

def create(draft_id, request, owner, request_key):
    if not request_key or len(request_key) > 100: raise ValueError('An Idempotency-Key is required (max 100 characters).')
    body = request.model_dump(mode='json')
    if request.intent != 'legal' and not request.alternative_text:
        raise ValueError('An impact run needs alternative B.')
    if request.as_of_date:
        from datetime import date
        date.fromisoformat(request.as_of_date)
    fingerprint = hashlib.sha256(json.dumps({'draft_id': draft_id, **body}, sort_keys=True).encode()).hexdigest()
    with store.db() as c:
        c.execute('BEGIN IMMEDIATE')
        old = c.execute('SELECT id,fingerprint FROM agent_jobs WHERE owner=? AND request_key=?', (owner, request_key)).fetchone()
        if old:
            if old['fingerprint'] != fingerprint: raise store.RevisionConflict('This Idempotency-Key was already used for different input.')
            return old['id'], False
        draft = store.get_draft(draft_id, c)
        if request.expected_revision != draft['revision']: raise store.RevisionConflict('The draft has changed. Reload before running agents.')
        if c.execute("SELECT id FROM agent_jobs WHERE draft_id=? AND status IN ('queued','running','cancelling')", (draft_id,)).fetchone():
            raise store.RevisionConflict('There is still an active run for this draft.')
        if c.execute("SELECT COUNT(*) FROM agent_jobs WHERE status IN ('queued','running','cancelling')").fetchone()[0] >= settings.max_agent_jobs:
            raise store.RevisionConflict('Agent capacity is full. Try again after another run finishes.')
        id = uuid.uuid4().hex; timestamp = store.now()
        c.execute('INSERT INTO agent_jobs(id,draft_id,revision,owner,request_key,fingerprint,request,snapshot,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
                  (id, draft_id, draft['revision'], owner, request_key, fingerprint, json.dumps(body), json.dumps(draft), 'queued', timestamp, timestamp))
        event(id, 'coordinator', 'snapshot_draft', 'completed', {'revision': draft['revision'], 'article_count': len(draft['articles'])}, connection=c)
    return id, True

def update(id, **fields):
    allowed = {'status', 'plan', 'result', 'error'}
    if not fields.keys() <= allowed: raise ValueError('Job field not allowed.')
    with store.db() as c:
        c.execute('UPDATE agent_jobs SET '+','.join(k+'=?' for k in fields)+',updated_at=? WHERE id=?',
                  [json.dumps(v, ensure_ascii=False) if k in {'plan','result'} else v for k,v in fields.items()] + [store.now(), id])

def cancelled(id):
    with store.db() as c:
        return c.execute('SELECT status FROM agent_jobs WHERE id=?', (id,)).fetchone()['status'] == 'cancelling'

class JobCancelled(Exception): pass

async def execute(id):
    result = {}
    loop = asyncio.get_running_loop()
    pending = []

    async def db(fn, *args, **kwargs):
        """Run a bookkeeping call on the ordered DB thread (retries while the database is locked)."""
        return await loop.run_in_executor(DB_WRITER, functools.partial(store.retry_locked, fn, *args, **kwargs))

    def emit(agent, name, status, detail):
        """Queue an event write without waiting; order is preserved by the single DB thread."""
        pending.append(loop.run_in_executor(DB_WRITER, functools.partial(store.retry_locked, event, id, agent, name, status, detail)))

    async def drain():
        if pending:
            await asyncio.gather(*pending, return_exceptions=True)
            pending.clear()

    def load(job_id):
        with store.db() as c:
            row = c.execute('SELECT snapshot,request FROM agent_jobs WHERE id=?', (job_id,)).fetchone()
        return json.loads(row['snapshot']), json.loads(row['request'])

    try:
        if await db(cancelled, id): raise JobCancelled()
        await db(update, id, status='running')
        draft, request = await db(load, id)
        async def tool(agent, name, callback):
            if await db(cancelled, id): raise JobCancelled()
            emit(agent, name, 'running', {})
            try:
                output = await asyncio.wait_for(callback(), timeout=settings.agent_step_timeout)
                if await db(cancelled, id): raise JobCancelled()
            except BaseException:
                emit(agent, name, 'cancelled' if await db(cancelled, id) else 'failed', {})
                raise
            return output

        async def plan_task():
            if settings.provider == 'demo':
                return {'workflow': request['intent'], 'rationale': 'Limited plan that follows the scope selected by the user.', 'provider': {'mode': 'demo'}}
            plan, provider = await ai.generate(
                'Create a bounded agent plan. workflow MUST equal requested_workflow. Give a short rationale in English; never include code execution or draft-changing instructions.',
                {'requested_workflow': request['intent'], 'draft_type': draft['regulation_type'], 'article_count': len(draft['articles']),
                 'available_tools': ['search_sources','review_legal','simulate_impact','validate_results','social_reaction','gather_opinions']}, AgentPlan)
            if plan['workflow'] != request['intent']: raise ai.AIError('The planner went outside the requested scope.')
            return {**plan, 'provider': provider}

        plan = await tool('coordinator', 'plan_workflow', plan_task)
        await db(update, id, plan=plan); emit('coordinator', 'plan_workflow', 'completed', plan)
        query = ' '.join(a['text'] for a in draft['articles'])
        if request['intent']=='social': query += ' '+request['alternative_text']
        evidence = await tool('research', 'search_sources', lambda: retrieval.context(query, 12))
        emit('research', 'search_sources', 'completed', {'source_ids': [e['id'] for e in evidence], 'count': len(evidence)})
        if request['intent'] in {'legal','full'}:
            output = await tool('legal_reviewer', 'review_legal', lambda: analysis.analyze(draft, evidence_override=evidence, as_of=request['as_of_date']))
            run = await db(store.add_run, draft, 'analysis', output)
            result['analysis_run_id'] = run['id']; await db(update, id, result=result)
            emit('legal_reviewer', 'review_legal', 'completed', {'run_id': run['id'], 'findings': len(output['findings']), 'provider': output['provider']})
        if request['intent'] in {'impact','full'}:
            output = await tool('impact_analyst', 'simulate_impact', lambda: simulation.simulate(draft, request['alternative_text'], request['assumptions']))
            run = await db(store.add_run, draft, 'simulation', output)
            result['simulation_run_id'] = run['id']; await db(update, id, result=result)
            emit('impact_analyst', 'simulate_impact', 'completed', {'run_id': run['id'], 'stakeholder_count': len(output['stakeholders']), 'provider': output['provider']})
        if request['intent'] == 'social':
            batch = []
            def write_batch(rows):
                with store.db() as c:
                    for a, n, s, d in rows:
                        event(id, a, n, s, d, connection=c)
            def flush_batch():
                if batch:
                    rows = list(batch); batch.clear()
                    pending.append(loop.run_in_executor(DB_WRITER, functools.partial(store.retry_locked, write_batch, rows)))
            def social_emit(agent, name, status, detail):
                # Demo produces hundreds of instant events: write them in batches. Live events stream one by one.
                if settings.provider == 'demo' and name == 'social_reaction':
                    batch.append((agent, name, status, detail))
                    if len(batch) >= 64: flush_batch()
                else:
                    flush_batch()
                    emit(agent, name, status, detail)
            try:
                output = await social.simulate(draft, request['alternative_text'], request['assumptions'], evidence,
                                              social_emit,request.get('social_options'))
            finally:
                flush_batch()
            if await db(cancelled, id): raise JobCancelled()
            run = await db(store.add_run, draft, 'social', output)
            result['social_run_id'] = run['id']; await db(update, id, result=result)
        if await db(cancelled, id): raise JobCancelled()
        emit('quality_reviewer', 'validate_results', 'completed', {'revision': draft['revision'], 'source_validation': 'service validators applied', 'human_review_required': True})
        await drain()
        await db(update, id, status='completed', result=result)
    except (JobCancelled, asyncio.CancelledError):
        await drain()
        await db(update, id, status='cancelled', result=result)
        await db(event, id, 'coordinator', 'stop', 'cancelled', {'partial_results': list(result)})
    except Exception as exc:
        await drain()
        await db(update, id, status='failed', result=result, error=ai.public_diagnostic(exc) if isinstance(exc,ai.AIError) else 'A step exceeded its time limit. Shorten the draft or raise RULELAB_AGENT_STEP_TIMEOUT.' if isinstance(exc,TimeoutError) else 'The run failed at the recorded step. Check configuration, sources or the provider before starting a new run.')
        await db(event, id, 'coordinator', 'failure', 'failed', {'error_type':type(exc).__name__,'error_code':exc.code if isinstance(exc,ai.AIError) else 'timeout' if isinstance(exc,TimeoutError) else 'internal','partial_results':list(result)})

def schedule(id):
    task = asyncio.create_task(execute(id)); TASKS[id] = task
    def finished(task):
        TASKS.pop(id, None)
        if task.cancelled() or cancelled(id):
            update(id, status='cancelled')
            event(id, 'coordinator', 'stop', 'cancelled', {'reason': 'task_cancelled'})
    task.add_done_callback(finished)

def cancel(id, principal):
    job = get(id)
    if principal['id'] != job['owner'] and principal['role'] != 'admin':
        raise PermissionError('Only the run owner or an admin can cancel.')
    if job['status'] in ACTIVE:
        update(id, status='cancelling')
        event(id, 'coordinator', 'cancel_requested', 'cancelling', {'actor': principal['id']})
        task = TASKS.get(id)
        if task: task.cancel()
    return get(id)

async def shutdown():
    tasks = list(TASKS.values())
    for task in tasks: task.cancel()
    if tasks: await asyncio.gather(*tasks, return_exceptions=True)
