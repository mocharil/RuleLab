"""Workspace overview: per-draft stage, attention items bound to the draft version, and recent activity."""


def overview(client):
    r = client.get('/api/overview')
    assert r.status_code == 200
    return r.json()


def test_new_draft_has_no_results_and_nothing_to_review(client):
    data = overview(client)
    d = data['drafts'][0]
    assert d['analysis'] is None and d['impact'] is None and d['pending_reviews'] == 0 and d['job'] is None
    assert data['attention'] == []
    assert data['activity'][0]['label'] == 'Draft created'


def test_source_check_needs_review_then_becomes_outdated_after_a_new_version(client):
    draft = client.get('/api/drafts').json()[0]
    run = client.post(f"/api/drafts/{draft['id']}/analyze").json()
    data = overview(client)
    d = next(x for x in data['drafts'] if x['id'] == draft['id'])
    assert d['analysis']['findings'] == len(run['payload']['findings']) and not d['analysis']['outdated']
    assert d['pending_reviews'] == 1
    assert [a['kind'] for a in data['attention']] == ['review'] and data['attention'][0]['target'] == 'history'
    assert data['activity'][0]['label'].startswith('Source check finished on v1')

    client.post(f"/api/runs/{run['id']}/review", json={'status': 'reviewed_with_notes', 'notes': 'Checked against the sources.'})
    assert overview(client)['attention'] == []

    payload = {k: draft[k] for k in ['title', 'regulation_type', 'scope', 'preamble', 'articles']}
    payload['articles'] = payload['articles'] + [{'number': '5', 'text': 'Penyelenggara menyediakan kanal pendampingan.'}]
    assert client.put(f"/api/drafts/{draft['id']}", json={**payload, 'expected_revision': draft['revision']}).status_code == 200
    data = overview(client)
    d = next(x for x in data['drafts'] if x['id'] == draft['id'])
    assert d['revision'] == 2 and d['analysis']['outdated'] and d['pending_reviews'] == 0
    outdated = [a for a in data['attention'] if a['kind'] == 'outdated']
    assert outdated and 'Ran on v1; the draft is now v2' in outdated[0]['detail'] and outdated[0]['target'] == 'analysis'
    assert data['activity'][0]['label'] == 'Version 2 saved'


def test_impact_results_and_ordering(client):
    draft = client.get('/api/drafts').json()[0]
    client.post(f"/api/drafts/{draft['id']}/simulate", json={'alternative_text': 'Pasal 1\nLayanan digital dan kanal pendampingan.'})
    d = overview(client)['drafts'][0]
    assert d['impact']['kind'] == 'simulation' and not d['impact']['outdated']
    created = client.post('/api/drafts', json={'title': 'Perlindungan upah pekerja', 'regulation_type': 'PERDA_KAB', 'scope': 'Upah',
                                               'preamble': 'Contoh.', 'articles': [{'number': '1', 'text': 'Upah dibayar tepat waktu.'}]})
    assert created.status_code == 201
    titles = [x['title'] for x in overview(client)['drafts']]
    assert titles[0] == 'Perlindungan upah pekerja'  # most recently updated first
