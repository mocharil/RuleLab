import os
import asyncio
import json
import pytest
from app.config import settings
from app import security, store
from app.services import agents, retrieval, analysis, ai

KEYS = [{'id': role+'-user', 'role': role, 'token': role.ljust(40, 'x')} for role in ['admin','editor','reviewer','viewer']]

def token(role): return {'Authorization': 'Bearer '+next(k['token'] for k in KEYS if k['role']==role)}

def test_rbac_and_audit(client, monkeypatch):
    monkeypatch.setattr(settings, 'access_keys', json.dumps(KEYS))
    id = client.get('/api/drafts', headers=token('viewer')).json()[0]['id']
    assert client.get('/api/status').status_code == 401
    assert client.get('/api/drafts', headers=token('viewer')).status_code == 200
    assert client.post('/api/drafts/'+id+'/analyze', headers=token('viewer')).status_code == 403
    assert client.post('/api/drafts/'+id+'/analyze', headers=token('reviewer')).status_code == 403
    run = client.post('/api/drafts/'+id+'/analyze', headers=token('editor')).json()
    assert client.post('/api/runs/'+run['id']+'/review', headers=token('reviewer'), json={'status':'reviewed_with_notes','notes':'Sumber perlu diverifikasi.'}).status_code == 200
    assert client.get('/api/audit', headers=token('viewer')).status_code == 403
    logs = client.get('/api/audit', headers=token('admin')).json()['events']
    assert any(e['actor']=='viewer-user' and e['status']==403 for e in logs)
    assert 'Sumber perlu diverifikasi' not in json.dumps(logs)
    assert all(k['token'] not in json.dumps(logs) for k in KEYS)
    assert client.get('/api/status', headers=token('viewer')).headers['cache-control']=='no-store'

def test_deployment_fails_closed(monkeypatch):
    monkeypatch.setattr(settings, 'deployment_mode', 'production')
    monkeypatch.setattr(settings, 'access_keys', '[]')
    with pytest.raises(ValueError): security.validate_deployment()
    monkeypatch.setattr(settings, 'access_keys', json.dumps(KEYS))
    monkeypatch.setattr(settings, 'allowed_origins', 'http://example.com')
    with pytest.raises(ValueError): security.validate_deployment()
    monkeypatch.setattr(settings, 'allowed_origins', 'https://example.com')
    security.validate_deployment()

def test_job_snapshot_idempotency_and_recovery(client):
    draft = client.get('/api/drafts').json()[0]
    req = agents.JobRequest(intent='legal', expected_revision=1)
    id, created = agents.create(draft['id'], req, 'editor', 'one')
    assert created
    assert agents.create(draft['id'], req, 'editor', 'one') == (id, False)
    with pytest.raises(store.RevisionConflict): agents.create(draft['id'], req, 'editor', 'other')
    with pytest.raises(store.RevisionConflict): agents.create(draft['id'], agents.JobRequest(intent='full',expected_revision=1,alternative_text='Pasal 1\nAlternatif layanan.'),'editor','one')
    agents.initialize()
    assert agents.get(id)['status']=='interrupted'
    assert agents.get(id)['events'][-1]['tool']=='recovery'
    payload={k:draft[k] for k in ['title','regulation_type','scope','preamble','articles']}
    store.save_draft(draft['id'], payload, 1)
    assert agents.get(id)['stale']
    with pytest.raises(store.RevisionConflict): agents.create(draft['id'], req, 'editor', 'new')

def test_agent_execution_and_source_trace(client):
    draft=client.get('/api/drafts').json()[0]
    request=agents.JobRequest(expected_revision=1,alternative_text='Pasal 1\nPenyelenggara menyediakan kanal pendampingan.')
    id,_=agents.create(draft['id'],request,'editor','complete')
    asyncio.run(agents.execute(id))
    job=agents.get(id)
    assert job['status']=='completed'
    assert set(job['result'])=={'analysis_run_id','simulation_run_id'}
    assert store.get_draft(draft['id'])['revision']==1
    assert store.get_run(job['result']['analysis_run_id'])['revision']==1
    assert any(e['tool']=='search_sources' and e['detail'].get('source_ids') for e in job['events'])
    assert job['plan']['provider']['mode']=='demo'

def test_failure_and_timeout_persist_no_fake_result(client, monkeypatch):
    draft=client.get('/api/drafts').json()[0]
    async def fail(*args,**kwargs): raise ai.AIError('Provider unavailable')
    monkeypatch.setattr(analysis,'analyze',fail)
    id,_=agents.create(draft['id'],agents.JobRequest(intent='legal',expected_revision=1),'editor','failed')
    asyncio.run(agents.execute(id))
    job=agents.get(id)
    assert job['status']=='failed' and not job['result']
    assert 'Provider unavailable' not in json.dumps(job)
    assert any(e['status']=='failed' and e['tool']=='review_legal' for e in job['events'])

def test_cancel_ownership_and_queued_execution(client):
    draft=client.get('/api/drafts').json()[0]
    id,_=agents.create(draft['id'],agents.JobRequest(intent='legal',expected_revision=1),'owner','cancel')
    with pytest.raises(PermissionError): agents.cancel(id, {'id':'other','role':'editor'})
    agents.cancel(id,{'id':'owner','role':'editor'})
    asyncio.run(agents.execute(id))
    assert agents.get(id)['status']=='cancelled'
    assert not agents.get(id)['result']

def test_planner_cannot_expand_tools_or_scope(client, monkeypatch):
    draft=client.get('/api/drafts').json()[0]
    monkeypatch.setattr(settings,'provider','gemini')
    async def wrong(*args,**kwargs): return {'workflow':'full','rationale':'Expand scope'}, {'mode':'live'}
    monkeypatch.setattr(ai,'generate',wrong)
    id,_=agents.create(draft['id'],agents.JobRequest(intent='legal',expected_revision=1),'owner','scope')
    asyncio.run(agents.execute(id))
    assert agents.get(id)['status']=='failed'
    assert not agents.get(id)['result']

def test_chunk_request_length_validation(client):
    response=client.post('/api/generate',headers={'content-length':'invalid'},json={'brief':'Valid brief for testing'})
    assert response.status_code==400

def test_running_cancellation_stops_pending_tool(client, monkeypatch):
    draft=client.get('/api/drafts').json()[0]
    async def scenario():
        entered=asyncio.Event()
        async def slow(*args,**kwargs):
            entered.set()
            await asyncio.sleep(30)
        monkeypatch.setattr(retrieval,'context',slow)
        id,_=agents.create(draft['id'],agents.JobRequest(intent='legal',expected_revision=1),'owner','running-cancel')
        agents.schedule(id)
        await asyncio.wait_for(entered.wait(),1)
        task=agents.TASKS[id]
        agents.cancel(id,{'id':'owner','role':'editor'})
        await asyncio.gather(task,return_exceptions=True)
        assert agents.get(id)['status']=='cancelled'
        assert any(e['tool']=='search_sources' and e['status']=='cancelled' for e in agents.get(id)['events'])
    asyncio.run(scenario())

def test_tool_timeout_is_persisted(client, monkeypatch):
    draft=client.get('/api/drafts').json()[0]
    async def slow(*args,**kwargs): await asyncio.sleep(1)
    monkeypatch.setattr(retrieval,'context',slow)
    monkeypatch.setattr(settings,'agent_step_timeout',0.01)
    id,_=agents.create(draft['id'],agents.JobRequest(intent='legal',expected_revision=1),'owner','timeout')
    asyncio.run(agents.execute(id))
    job=agents.get(id)
    assert job['status']=='failed'
    assert job['events'][-1]['detail']['error_type']=='TimeoutError'

def test_partial_result_is_not_discarded_on_impact_failure(client, monkeypatch):
    from app.services import simulation
    draft=client.get('/api/drafts').json()[0]
    async def fail(*args,**kwargs): raise ai.AIError('No impact output')
    monkeypatch.setattr(simulation,'simulate',fail)
    id,_=agents.create(draft['id'],agents.JobRequest(expected_revision=1,alternative_text='Pasal 1\nKanal pendampingan disediakan.'),'owner','partial')
    asyncio.run(agents.execute(id))
    job=agents.get(id)
    assert job['status']=='failed'
    assert set(job['result'])=={'analysis_run_id'}
    assert store.get_run(job['result']['analysis_run_id'])['revision']==1


def test_actual_body_limit_even_without_declared_length(client):
    response=client.post('/api/generate',content=b'x'*15000001,headers={'Content-Length':'0','Content-Type':'application/json'})
    assert response.status_code==413


@pytest.mark.skipif(bool(os.getenv('RULELAB_TEST_DATABASE_URL')),reason='SQLite online backup; PostgreSQL uses Cloud SQL backups')
def test_online_backup_preserves_job_audit_and_revision(client, tmp_path):
    from scripts.backup_workspace import backup
    import sqlite3
    draft=client.get('/api/drafts').json()[0]
    agents.create(draft['id'],agents.JobRequest(intent='legal',expected_revision=1),'owner','backup')
    agents.audit('req','owner','editor','test',200)
    target=backup(tmp_path/'backup.sqlite3')
    with sqlite3.connect(target) as c:
        assert c.execute('SELECT COUNT(*) FROM agent_jobs').fetchone()[0]==1
        assert c.execute('SELECT COUNT(*) FROM audit_events').fetchone()[0]>=1
        assert c.execute('SELECT COUNT(*) FROM revisions').fetchone()[0]==1
