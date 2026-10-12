"""Whole API workflow with Vertex REST/auth fixtures, never a cloud success claim."""
import json
import httpx
import google.auth
from app.config import ROOT,settings
from app.services import ai
from scripts.verify_live import verify_full


def test_vertex_contract_end_to_end(tmp_path,monkeypatch):
    for key,value in {'db_path':tmp_path/'e2e.sqlite3','provider':'vertex','project':'unit-project','credentials_path':'','location':'global','search_backend':'sqlite','api_token':'','access_keys':'[]','deployment_mode':'development'}.items():monkeypatch.setattr(settings,key,value)
    class Credential:
        token='unit-access-token';valid=True
    ai.reset_auth_cache()
    monkeypatch.setattr(google.auth,'default',lambda scopes:(Credential(),'unit-project'))
    sample=json.loads((ROOT/'data/example_draft.json').read_text())
    original=httpx.AsyncClient;seen=[]
    def provider(request):
        assert request.url.host=='aiplatform.googleapis.com' and request.headers['Authorization']=='Bearer unit-access-token'
        payload=json.loads(request.content)
        schema=payload['generationConfig']['responseSchema'];properties=schema['properties']
        content=payload['contents'][0]['parts'][0]['text'];data=json.loads(content.split('DATA_JSON:\n',1)[1]);seen.append(set(properties))
        if 'sections' in properties:
            a=data['evidence'][0];output={'status':'answered','sections':[{'heading':'Penjelasan fixture','explanation':'Uji integrasi galeri bersumber.','quotes':[{'evidence_id':a['id'],'quote':a['text'][:100]}]}],'limitations':['Fixture REST, bukan model nyata.'],'follow_up_questions':[]}
        elif 'status' in properties:output={'status':'ok'}
        elif 'articles' in properties:output={**sample,'regulation_type':data['regulation_type']}
        elif 'findings' in properties:output={'summary':'Output fixture untuk menguji kontrak REST.','findings':[],'limitations':['Fixture provider; bukan hasil Gemini nyata.']}
        elif 'workflow' in properties:output={'workflow':data['requested_workflow'],'rationale':'Menjalankan cakupan yang diminta.'}
        elif 'stakeholder' in properties:output={'stakeholder':data['stakeholder'],'benefits':['Pelayanan dapat dievaluasi.'],'risks':['Perlu data lapangan.'],'mitigations':['Lakukan uji bersama pengguna.'],'evidence_ids':[],'questions_to_validate':['Apakah kanal bantuan tersedia?']}
        elif 'stance' in properties:
            earlier=[item for item in data['previous_comments'] if item['persona_id']!=data['persona']['id']]
            output={'stance':'conditional','comment':'Saya meminta prosedur bantuan yang dapat diakses.','rationale':'Kondisi persona membutuhkan akses dan kepastian prosedur.','issue':'access','proposal':'Lakukan uji akses pengguna.','reply_to':earlier[-1]['id'] if earlier else None,'evidence_ids':[]}
        else:raise AssertionError(properties)
        return httpx.Response(200,json={'candidates':[{'finishReason':'STOP','content':{'parts':[{'text':json.dumps(output)}]}}],'usageMetadata':{'totalTokenCount':1}})
    monkeypatch.setattr(ai.httpx,'AsyncClient',lambda **kwargs:original(transport=httpx.MockTransport(provider),**kwargs))
    checks=verify_full(timeout=10)
    assert len(checks)>=16 and len([schema for schema in seen if 'stance' in schema])==30
    assert any(check['feature']=='Impor DOCX round trip' for check in checks)
    assert ai._auth_cache['project']=='unit-project'
    ai.reset_auth_cache()
