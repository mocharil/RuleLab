import json
from app.config import settings

KEYS = [{'id': role+'-user', 'role': role, 'token': role.ljust(40, 'x')} for role in ['editor', 'reviewer', 'viewer']]

def token(role): return {'Authorization': 'Bearer '+next(k['token'] for k in KEYS if k['role'] == role)}

def test_review_history_is_appended_with_reviewer(client, monkeypatch):
    monkeypatch.setattr(settings, 'access_keys', json.dumps(KEYS))
    id = client.get('/api/drafts', headers=token('viewer')).json()[0]['id']
    run = client.post(f'/api/drafts/{id}/analyze', headers=token('editor')).json()
    assert run['reviews'] == []
    first = client.post('/api/runs/'+run['id']+'/review', headers=token('reviewer'), json={'status': 'needs_review', 'notes': 'Sumber Pasal 2 belum dicek.'})
    assert first.status_code == 200
    second = client.post('/api/runs/'+run['id']+'/review', headers=token('editor'), json={'status': 'reviewed_with_notes', 'notes': 'Sumber dicek, perlu konsultasi.'}).json()
    # The run carries the latest decision; every decision stays in the history, newest first.
    assert second['review_status'] == 'reviewed_with_notes' and second['review_notes'] == 'Sumber dicek, perlu konsultasi.'
    assert [(r['reviewer'], r['role'], r['status']) for r in second['reviews']] == [('editor-user', 'editor', 'reviewed_with_notes'), ('reviewer-user', 'reviewer', 'needs_review')]
    assert second['reviews'][0]['created_at'] >= second['reviews'][1]['created_at']
    listed = next(r for r in client.get(f'/api/drafts/{id}/runs', headers=token('viewer')).json() if r['id'] == run['id'])
    assert listed['reviews'] == second['reviews']
    assert client.post('/api/runs/'+run['id']+'/review', headers=token('viewer'), json={'status': 'reviewed_with_notes', 'notes': 'Tidak boleh.'}).status_code == 403
    assert len(client.get(f'/api/drafts/{id}/runs', headers=token('viewer')).json()[0]['reviews']) == 2
