import asyncio
import hashlib
import json
import pytest
from app import store
from app.config import ROOT,settings
from app.models import AnalysisOutput
from app.services import ai,legal,retrieval

def source(client,reg='uu-25-2009',number='4'):
    doc=next(d for d in store.regulations() if d['id']==reg)
    return store.article(next(a['id'] for a in doc['articles'] if a['number']==number))

def finding(e):
    return {'article_number':'1','category':'potential_vertical_conflict','severity':'high','title':'Test',
      'reasoning':'Potensi konflik','evidence_ids':[e['id']],'review_questions':[],
      'legal_rule_ids':['hierarchy','conflict_test'],'evidence_quotes':[{'evidence_id':e['id'],'quote':e['text'][:80]}],
      'norm_collision':'Norma rancangan membatasi kanal sedangkan sumber melindungi akses; perlu review.',
      'legal_checks':dict.fromkeys(['temporal','scope','authority','exceptions','alternative_interpretation'],'Konteks diperiksa; masih perlu verifikasi ahli.')}

def event(**kw):
    return {'id':'e1','review_status':'reviewed','source_quote':'Ketentuan ayat (2) Pasal 49 diubah',
      'source_url':'https://peraturan.go.id/files/uu13-2022.pdf','source_regulation_type':'UU',
      'target_regulation_id':'example-uu','effective_from':'2022-06-16','operation':'replace_unit',
      'unit_id':'49/2','replacement_text':'Teks ayat kedua baru.',**kw}

def snapshot():
    return {'regulation_id':'example-uu','regulation_type':'UU','units':{
      '49/1':{'text':'Ayat pertama lama.','status':'original'},
      '49/2':{'text':'Ayat kedua lama.','status':'original'},
      '49/3':{'text':'Ayat ketiga lama.','status':'original'}}}

def test_rulebook_provenance_and_classification():
    pack=legal.rulebook();assert len(pack['rules'])==28;assert not pack['current_law_certified']
    for rule in pack['rules']:
        if rule['source']:
            src=rule['source'];assert hashlib.sha256((ROOT/src['raw_file']).read_bytes()).hexdigest()==src['sha256']
            assert src['locator'];assert src['url'].startswith('https://peraturan.go.id/')
        else:assert rule['classification']=='engineering_guardrail'
    assert '176' in next(r for r in pack['rules'] if r['id']=='source_versions')['instruction']

def test_actual_2022_partial_instruction_preserved():
    events=legal.change_candidates()
    partial=next(c for c in events if c['id']=='uu-13-2022/instruction/5')
    assert partial['operation']=='replace_paragraph';assert partial['target_articles']==['49']
    assert partial['target_paragraphs']==['2'];assert partial['pages']==[5]
    assert partial['effective_from'] is None;assert not partial['auto_apply']
    assert all(c['review_status']=='pending' for c in events)

def test_explanation_change_not_merged_with_next_norm_change():
    events=legal.change_candidates()
    explanation=next(c for c in events if c['id']=='uu-15-2019/instruction/12')
    next_norm=next(c for c in events if c['id']=='uu-15-2019/instruction/13')
    assert explanation['operation']=='change_explanation'
    assert '13. Ketentuan' not in explanation['source_quote']
    assert explanation['target_articles']==['72'];assert next_norm['target_articles']==['85']

def test_partial_change_preserves_other_paragraphs_and_provenance():
    before=snapshot();result=legal.apply_reviewed_change(before,event(),'2022-07-01')
    assert result['units']['49/1']==before['units']['49/1'];assert result['units']['49/3']==before['units']['49/3']
    assert result['units']['49/2']['text']=='Teks ayat kedua baru.'
    assert before['units']['49/2']['text']=='Ayat kedua lama.'
    assert result['history'][0]['source_quote'];assert not result['current_law_verified']

def test_insert_and_delete_do_not_renumber():
    result=legal.apply_reviewed_change(snapshot(),event(operation='insert_unit',unit_id='49/1a'),'2022-07-01')
    assert '49/1a' in result['units'];assert '49/2' in result['units']
    result=legal.apply_reviewed_change(result,event(id='e2',operation='delete_unit'),'2022-07-01')
    assert result['units']['49/2']['status']=='deleted';assert result['units']['49/3']['text']=='Ayat ketiga lama.'
    with pytest.raises(ValueError):legal.apply_reviewed_change(result,event(id='e3',operation='insert_unit'),'2022-07-01')

@pytest.mark.parametrize('update',[{'review_status':'pending'},{'effective_from':None},{'target_regulation_id':'wrong'},
 {'source_regulation_type':'PP'},{'operation':'phrase_replace'},{'source_quote':''}])
def test_uncertain_or_unauthorized_change_not_applied(update):
    with pytest.raises(ValueError):legal.apply_reviewed_change(snapshot(),event(**update),'2023-01-01')

def test_temporal_boundary_and_operation_order():
    before=snapshot();assert legal.apply_reviewed_change(before,event(),'2022-06-15')==before
    applied=legal.apply_reviewed_change(before,event(),'2022-06-16');assert applied!=before
    with pytest.raises(ValueError):legal.apply_reviewed_change(applied,event(),'2022-07-01')
    with pytest.raises(ValueError):legal.apply_reviewed_change(applied,event(id='e2',effective_from='2022-01-01'),'2022-07-01')

def test_repeal_does_not_revoke_other_regulations():
    other={'regulation_id':'example-pp','status':'original'}
    result=legal.apply_reviewed_change(snapshot(),event(operation='repeal_regulation'),'2023-01-01')
    assert result['status']=='repealed';assert other['status']=='original'
    with pytest.raises(ValueError):legal.apply_reviewed_change(snapshot(),event(operation='repeal_regulation',source_regulation_type='PP'),'2023-01-01')

def test_rag_fetches_actual_amendment_and_effective_clause(client):
    original=source(client,'uu-12-2011','96')
    evidence=retrieval.expand_versions([original])
    assert any(e['regulation_id']=='uu-13-2022' and e['number']=='96' for e in evidence)
    assert any(e['regulation_id']=='uu-13-2022' and e['number']=='II' for e in evidence)
    assert original['version_kind']=='original_amended'

def test_article8_has_no_numeric_rank(client):
    ctx=legal.context('PERMEN',[source(client)])
    assert ctx['draft_hierarchy_rank'] is None;assert ctx['authority_check_required']
    f=finding(source(client));legal.validate_finding(f,[source(client)],'PERMEN','2026-10-11',True)
    assert f['category']=='coverage_gap'

@pytest.mark.parametrize('mutation',['quote','rule','missing_checks','future','wrong_rank'])
def test_llm_judgment_gates(client,mutation):
    e=source(client);f=finding(e)
    if mutation=='quote':
        f['evidence_quotes'][0]['quote']='Sumber ini menyatakan semua PP batal.'
        with pytest.raises(ValueError):legal.validate_finding(f,[e],'PP','2026-10-11',True)
    elif mutation=='rule':
        f['legal_rule_ids']=['invented_rule']
        with pytest.raises(ValueError):legal.validate_finding(f,[e],'PP','2026-10-11',True)
    else:
        if mutation=='missing_checks':f['legal_checks']={}
        when='2000-01-01' if mutation=='future' else '2026-10-11'
        kind='UU' if mutation=='wrong_rank' else 'PP'
        legal.validate_finding(f,[e],kind,when,True)
        assert f['category']=='coverage_gap';assert f['validation']['warnings']

def test_supported_potential_still_not_final_verdict(client):
    e=source(client);f=finding(e);legal.validate_finding(f,[e],'PP','2026-10-11',True)
    assert f['category']=='potential_vertical_conflict';assert f['validation']['source_quotes_checked']==1
    assert not f['validation']['current_law_verified']

def test_rulebook_in_actual_provider_payload(monkeypatch):
    monkeypatch.setattr(settings,'provider','gemini');monkeypatch.setattr(settings,'api_key','test')
    captured={}
    async def fake(url,headers,payload):
        captured.update(payload)
        return {'candidates':[{'finishReason':'STOP','content':{'parts':[{'text':json.dumps({'summary':'Test','findings':[],'limitations':[]})}]}}]}
    monkeypatch.setattr(ai,'post_json',fake)
    asyncio.run(ai.generate('test',{},AnalysisOutput))
    system=captured['systemInstruction']['parts'][0]['text']
    assert legal.rulebook()['version'] in system;assert '[change_unit;' in system;assert '[authority;' in system

def test_api_date_and_guide(client):
    assert len(client.get('/api/legal/guide').json()['rules'])==28
    draft=client.get('/api/drafts').json()[0]
    response=client.post('/api/drafts/'+draft['id']+'/analyze',json={'as_of_date':'2000-01-01'})
    assert response.status_code==200
    payload=response.json()['payload'];assert payload['legal_context']['as_of_date']=='2000-01-01'
    assert all(f['category']!='potential_vertical_conflict' for f in payload['findings'])
    assert client.post('/api/drafts/'+draft['id']+'/analyze',json={'as_of_date':'invalid'}).status_code==422
