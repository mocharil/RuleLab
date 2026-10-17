"""Workspace overview: where each draft stands, what needs a decision, and what happened recently.

Read-only and computed from the existing tables (drafts, revisions, runs, agent_jobs); works on SQLite and PostgreSQL.
Results are bound to the draft version they were produced on, so a result from an older version is reported as outdated.
"""
import json
from app import store

ACTIVE = {'queued', 'running', 'cancelling'}
INTENT_LABEL = {'legal': 'Source check', 'impact': 'Impact test', 'full': 'Source check & impact', 'social': 'Public forum'}
KIND_LABEL = {'analysis': 'Source check', 'simulation': 'A/B impact test', 'social': 'Public forum'}


def _latest(rows, draft_id, kinds):
    return next((r for r in rows if r['draft_id'] == draft_id and r['kind'] in kinds), None)


def summary(limit=50):
    drafts = store.list_drafts()[:limit]  # newest first (updated_at DESC)
    titles = {d['id']: d.get('title') or 'Untitled draft' for d in drafts}
    with store.db() as c:
        runs = [dict(r) for r in c.execute('SELECT id,draft_id,revision,kind,review_status,created_at FROM runs ORDER BY created_at DESC')]
        jobs = [dict(r) for r in c.execute('SELECT id,draft_id,revision,status,request,error,created_at,updated_at FROM agent_jobs ORDER BY updated_at DESC LIMIT 400')]
        revisions = [dict(r) for r in c.execute('SELECT draft_id,revision,created_at FROM revisions ORDER BY created_at DESC LIMIT 40')]
        findings = {}
        for d in drafts:  # payload only for the latest source check of each listed draft
            latest = _latest(runs, d['id'], {'analysis'})
            if latest:
                row = c.execute('SELECT payload FROM runs WHERE id=?', (latest['id'],)).fetchone()
                findings[latest['id']] = len(json.loads(row['payload']).get('findings', [])) if row else 0
    for j in jobs:
        try: j['intent'] = json.loads(j.pop('request') or '{}').get('intent', 'full')
        except ValueError: j['intent'] = 'full'

    items, attention = [], []
    for d in drafts:
        rev = d['revision']
        analysis = _latest(runs, d['id'], {'analysis'})
        simulation = _latest(runs, d['id'], {'simulation'})
        social = _latest(runs, d['id'], {'social'})
        job = next((j for j in jobs if j['draft_id'] == d['id']), None)
        pending = [r for r in runs if r['draft_id'] == d['id'] and r['review_status'] == 'needs_review' and r['revision'] == rev]
        impact = max([r for r in (simulation, social) if r], key=lambda r: r['created_at'], default=None)
        item = {
            'id': d['id'], 'title': titles[d['id']], 'regulation_type': d.get('regulation_type'), 'revision': rev,
            'articles': len(d.get('articles', [])), 'updated_at': d['updated_at'],
            'analysis': analysis and {'id': analysis['id'], 'revision': analysis['revision'], 'findings': findings.get(analysis['id'], 0),
                                      'review_status': analysis['review_status'], 'outdated': analysis['revision'] != rev, 'at': analysis['created_at']},
            'impact': impact and {'id': impact['id'], 'kind': impact['kind'], 'revision': impact['revision'], 'outdated': impact['revision'] != rev, 'at': impact['created_at']},
            'forum': social and {'revision': social['revision'], 'outdated': social['revision'] != rev},
            'job': job and {'id': job['id'], 'intent': job['intent'], 'status': job['status'], 'revision': job['revision'], 'at': job['updated_at'],
                            'active': job['status'] in ACTIVE},
            'pending_reviews': len(pending),
        }
        items.append(item)
        base = {'draft_id': d['id'], 'draft': titles[d['id']]}
        if item['job'] and item['job']['active']:
            attention.append({**base, 'kind': 'running', 'priority': 0, 'label': f"{INTENT_LABEL.get(job['intent'], 'Agent run')} running",
                              'detail': f"Draft v{job['revision']}", 'target': 'agents'})
        elif item['job'] and job['status'] in {'failed', 'interrupted'} and job['revision'] == rev:
            attention.append({**base, 'kind': 'failed', 'priority': 1, 'label': f"{INTENT_LABEL.get(job['intent'], 'Agent run')} {job['status']}",
                              'detail': (job.get('error') or 'Open the run to see the recorded step.')[:120], 'target': 'agents'})
        if pending:
            n = len(pending)
            attention.append({**base, 'kind': 'review', 'priority': 2, 'label': f"{n} result{'s' if n > 1 else ''} awaiting review",
                              'detail': ', '.join(sorted({KIND_LABEL.get(r['kind'], r['kind']) for r in pending})) + f' · v{rev}', 'target': 'history'})
        if analysis and analysis['revision'] != rev:
            attention.append({**base, 'kind': 'outdated', 'priority': 3, 'label': 'Source check is outdated',
                              'detail': f"Ran on v{analysis['revision']}; the draft is now v{rev}", 'target': 'analysis'})
        if impact and impact['revision'] != rev:
            attention.append({**base, 'kind': 'outdated', 'priority': 4, 'label': f"{KIND_LABEL[impact['kind']]} is outdated",
                              'detail': f"Ran on v{impact['revision']}; the draft is now v{rev}", 'target': 'simulation'})
    attention.sort(key=lambda a: a['priority'])

    events = []
    for r in revisions:
        if r['draft_id'] in titles:
            events.append({'at': r['created_at'], 'draft_id': r['draft_id'], 'draft': titles[r['draft_id']], 'kind': 'revision',
                           'label': 'Draft created' if r['revision'] == 1 else f"Version {r['revision']} saved"})
    for r in runs[:40]:
        if r['draft_id'] in titles:
            extra = f" · {findings[r['id']]} finding{'s' if findings[r['id']] != 1 else ''}" if r['id'] in findings else ''
            events.append({'at': r['created_at'], 'draft_id': r['draft_id'], 'draft': titles[r['draft_id']], 'kind': r['kind'],
                           'label': f"{KIND_LABEL.get(r['kind'], r['kind'])} finished on v{r['revision']}{extra}"})
    for j in jobs[:40]:
        if j['draft_id'] in titles and j['status'] in {'failed', 'cancelled', 'interrupted'}:
            events.append({'at': j['updated_at'], 'draft_id': j['draft_id'], 'draft': titles[j['draft_id']], 'kind': 'job',
                           'label': f"{INTENT_LABEL.get(j['intent'], 'Agent run')} {j['status']}"})
    events.sort(key=lambda e: e['at'], reverse=True)
    return {'drafts': items, 'attention': attention[:8], 'activity': events[:8]}
