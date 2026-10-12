import asyncio
from io import BytesIO
import pytest
from docx import Document
from app.config import settings
from app.models import Assumptions
from app import store
from app.services import social, agents, ai, export

def test_demo_social_rounds_are_bound_to_snapshot(client):
    draft = client.get('/api/drafts').json()[0]
    req = agents.JobRequest(intent='social',expected_revision=draft['revision'],
                           alternative_text='Pasal 2\nPelayanan menyediakan kanal pendampingan.')
    job_id,_ = agents.create(draft['id'],req,'editor','social')
    asyncio.run(agents.execute(job_id))
    job=agents.get(job_id)
    assert job['status']=='completed' and job['intent']=='social'
    run=store.get_run(job['result']['social_run_id'])
    assert run['revision']==draft['revision']
    p=run['payload']
    assert len(p['personas'])==5 and p['provider']['mode']=='demo'
    for scenario in ['A','B']:
        comments=p['scenarios'][scenario]['comments']
        assert len(comments)==15
        for c in comments:
            previous=[x for x in comments if x['round']<c['round'] and x['persona_id']!=c['persona_id']]
            assert c['reply_to'] in {x['id'] for x in previous} if c['round']>1 else c['reply_to'] is None
            assert not c['evidence_ids'] # Templates must not invent legal support.
        assert len(p['scenarios'][scenario]['summary']['latest_comment_ids'])==5
    assert store.get_draft(draft['id'])['revision']==draft['revision']
    assert len([e for e in job['events'] if e['tool']=='social_reaction' and e['status']=='completed'])==30
    data=export.export_docx(draft,[run],report=True)
    assert 'Forum netizen sintetis' in '\n'.join(x.text for x in Document(BytesIO(data)).paragraphs)

def test_live_personas_receive_prior_context_and_scenario_isolation(client,monkeypatch):
    monkeypatch.setattr(settings,'provider','gemini')
    calls=[]
    async def fake(task,data,schema):
        calls.append(data)
        previous=data['previous_comments']
        targets=[x for x in previous if x['persona_id']!=data['persona']['id']]
        return {'stance':'conditional','comment':'Saya meminta prosedur pelayanan yang jelas.',
                'rationale':'Kondisi persona memerlukan akses dan kepastian prosedur.',
                'issue':'clarity','proposal':'Uji prosedur bersama pemohon.',
                'reply_to':targets[-1]['id'] if targets else None,'evidence_ids':[]}, {'mode':'live'}
    monkeypatch.setattr(ai,'generate',fake)
    draft=client.get('/api/drafts').json()[0]
    events=[]
    p=asyncio.run(social.simulate(draft,'Alternatif dengan kanal bantuan.',Assumptions().model_dump(),[],lambda *e:events.append(e)))
    assert len(calls)==30 and p['provider']['mode']=='live'
    for data in calls:
        assert len(data['previous_comments'])==5*(data['round']-1)
        assert all(c['scenario']==data['scenario'] and c['round']<data['round'] for c in data['previous_comments'])
        assert 'persona' in data and 'regulation_text' in data and 'assumptions' in data

@pytest.mark.parametrize('invalid',['source','target'])
def test_invalid_live_sources_or_reply_rejected(client,monkeypatch,invalid):
    monkeypatch.setattr(settings,'provider','gemini')
    async def fake(*args):
        return {'stance':'concern','comment':'Saya membutuhkan informasi yang lebih jelas.',
                'rationale':'Konteks persona belum cukup untuk menilai pelaksanaan.',
                'issue':'clarity','proposal':'Perjelas prosedur pelaksanaan.',
                'reply_to':'invented-id' if invalid=='target' else None,
                'evidence_ids':['invented-law'] if invalid=='source' else []}, {}
    monkeypatch.setattr(ai,'generate',fake)
    draft=client.get('/api/drafts').json()[0]
    with pytest.raises(ai.AIError):
        asyncio.run(social.simulate(draft,'Alternatif pelayanan publik.',Assumptions().model_dump(),[],lambda *e:None))

def test_live_failure_preserves_partial_events_no_demo_fallback(client,monkeypatch):
    draft=client.get('/api/drafts').json()[0]
    async def fail(*args,**kwargs): raise ai.AIError('not available')
    monkeypatch.setattr(social,'simulate',fail)
    job_id,_=agents.create(draft['id'],agents.JobRequest(intent='social',expected_revision=1,
                        alternative_text='Alternatif pelayanan publik.'),'editor','fail-social')
    asyncio.run(agents.execute(job_id))
    job=agents.get(job_id)
    assert job['status']=='failed' and not job['result']
    assert not any(r['kind']=='social' for r in store.runs(draft['id']))

def test_cancellation_stops_all_persona_tasks(client,monkeypatch):
    monkeypatch.setattr(settings,'provider','gemini')
    started=[];stopped=[]
    async def slow(task,data,schema):
        started.append(data['persona']['id'])
        try:await asyncio.sleep(10)
        finally:stopped.append(data['persona']['id'])
    monkeypatch.setattr(ai,'generate',slow)
    draft=client.get('/api/drafts').json()[0]
    async def run():
        t=asyncio.create_task(social.simulate(draft,'Alternatif pelayanan publik.',Assumptions().model_dump(),[],lambda *e:None))
        for _ in range(20):
            await asyncio.sleep(.001)
            if len(started)==5:break
        t.cancel()
        with pytest.raises(asyncio.CancelledError):await t
    asyncio.run(run())
    assert len(started)==5 and set(stopped)==set(started)

def test_aggregation_only_counts_latest_reactions():
    comments=[{'id':'old','persona_id':'sari','stance':'concern','issue':'access'},
              {'id':'new','persona_id':'sari','stance':'conditional','issue':'capacity'}]
    summary=social.aggregate(comments)
    assert summary['stance_groups']['concern']==[]
    assert summary['stance_groups']['conditional']==['new']
    assert summary['issues']=={'capacity':['new']}

def test_persona_timeout_is_terminal_and_cancels_siblings(client,monkeypatch):
    monkeypatch.setattr(settings,'provider','gemini')
    monkeypatch.setattr(settings,'agent_step_timeout',.01)
    async def slow(*args):
        await asyncio.sleep(10)
    monkeypatch.setattr(ai,'generate',slow)
    events=[]
    draft=client.get('/api/drafts').json()[0]
    with pytest.raises(TimeoutError):
        asyncio.run(social.simulate(draft,'Alternatif pelayanan publik.',Assumptions().model_dump(),[],lambda *e:events.append(e)))
    assert not any(e[1]=='social_reaction' and e[2]=='completed' for e in events)
    terminal=[e for e in events if e[1]=='social_reaction' and e[2] in {'failed','cancelled'}]
    assert len(terminal)==5
