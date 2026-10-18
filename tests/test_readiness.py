import asyncio,json,math
import httpx,pytest
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from dotenv import dotenv_values
from app.config import settings
from app.services import ai,simulation
from app.services.credentials import service_account_info,CredentialError
from app.models import AnalysisOutput,Assumptions

@pytest.fixture(autouse=True)
def clear_auth():
    ai.reset_auth_cache();yield;ai.reset_auth_cache()

@pytest.fixture
def sa_file(tmp_path):
    key=rsa.generate_private_key(public_exponent=65537,key_size=2048)
    data={'type':'service_account','project_id':'rulelab-test-project','client_email':'test@rulelab-test-project.iam.gserviceaccount.com',
          'private_key':key.private_bytes(serialization.Encoding.PEM,serialization.PrivateFormat.PKCS8,serialization.NoEncryption()).decode(),
          'token_uri':'https://oauth2.googleapis.com/token'}
    path=tmp_path/'account with spaces.json';path.write_text(json.dumps(data));return path


def test_setup_infers_project_preserves_other_settings(sa_file,tmp_path):
    from scripts.setup_vertex import write_config
    env=tmp_path/'.env';env.write_text('SEARCH_BACKEND=sqlite\nRULELAB_API_TOKEN="preserved-unit-value"\nGEMINI_MODEL=chosen-model\n')
    result=write_config(sa_file,env_path=env)
    configured=dotenv_values(env)
    assert configured['AI_PROVIDER']=='vertex' and configured['GOOGLE_CLOUD_PROJECT']=='rulelab-test-project'
    assert configured['GOOGLE_APPLICATION_CREDENTIALS']==str(sa_file)
    assert configured['GEMINI_MODEL']=='chosen-model' and configured['RULELAB_API_TOKEN']=='preserved-unit-value'
    assert 'PRIVATE KEY' not in env.read_text() and 'client_email' not in env.read_text()
    assert result['project']=='rulelab-test-project'

@pytest.mark.parametrize('payload',[{'type':'authorized_user'},{'type':'service_account'},['not-an-object']])
def test_wrong_credential_kind_is_rejected(tmp_path,payload):
    path=tmp_path/'invalid.json';path.write_text(json.dumps(payload))
    with pytest.raises(CredentialError):service_account_info(path,validate_key=True)


def test_unofficial_token_endpoint_is_rejected(sa_file):
    payload=json.loads(sa_file.read_text());payload['token_uri']='https://untrusted.invalid/token';sa_file.write_text(json.dumps(payload))
    with pytest.raises(CredentialError):service_account_info(sa_file)


def test_vertex_infers_adc_project_and_caches_refresh(monkeypatch):
    import google.auth
    calls=[]
    class Credential:
        token=None;valid=False
        def refresh(self,request):calls.append('refresh');self.token='test-token';self.valid=True
    credential=Credential()
    def default(scopes):calls.append('load');return credential,'inferred-project'
    monkeypatch.setattr(google.auth,'default',default)
    monkeypatch.setattr(settings,'provider','vertex');monkeypatch.setattr(settings,'project','');monkeypatch.setattr(settings,'credentials_path','')
    url,_=asyncio.run(ai.endpoint());url2,_=asyncio.run(ai.endpoint())
    assert '/projects/inferred-project/' in url and url==url2 and calls==['load','refresh']
    credential.valid=False;asyncio.run(ai.endpoint());assert calls==['load','refresh','refresh']


def test_vertex_schema_resolves_refs_and_nullable_fields():
    from app.services.social import Reaction
    schema=ai.vertex_schema(Reaction)
    assert schema['properties']['reply_to']=={'type':'STRING','nullable':True}
    assert '$ref' not in json.dumps(ai.vertex_schema(AnalysisOutput)) and 'pattern' not in json.dumps(schema)
    assert schema['type']=='OBJECT'


def test_vertex_rest_schema_and_regional_embedding(monkeypatch):
    import google.auth
    class Credential:
        valid=True;token='test-token'
    monkeypatch.setattr(google.auth,'default',lambda scopes:(Credential(),'unit-project'))
    for key,value in {'provider':'vertex','project':'unit-project','credentials_path':'','location':'global','embedding_location':'us-central1','embedding_dimensions':3}.items():monkeypatch.setattr(settings,key,value)
    requests=[]
    async def post(url,headers,payload):
        requests.append((url,payload))
        if url.endswith(':predict'):return {'predictions':[{'embeddings':{'values':[1,2,2]}}]}
        return {'candidates':[{'finishReason':'STOP','content':{'parts':[{'text':'{"summary":"ok","findings":[],"limitations":[]}' }]}}]}
    monkeypatch.setattr(ai,'post_json',post)
    asyncio.run(ai.generate('test',{},AnalysisOutput));vector=asyncio.run(ai.embedding('layanan publik'))
    assert 'responseSchema' in requests[0][1]['generationConfig'] and 'responseJsonSchema' not in requests[0][1]['generationConfig']
    assert 'us-central1-aiplatform.googleapis.com' in requests[1][0] and '/locations/us-central1/' in requests[1][0]
    assert math.isclose(sum(value*value for value in vector),1)

@pytest.mark.parametrize('status,code',[(400,'invalid_request'),(401,'unauthenticated'),(403,'permission_denied'),(404,'model_not_found'),(429,'quota'),(503,'provider_unavailable')])
def test_provider_errors_are_actionable_and_redacted(status,code):
    error=ai.provider_error(httpx.Response(status,json={'error':{'message':'PRIVATE-SERVER-MESSAGE'}}))
    assert error.code==code and 'PRIVATE-SERVER-MESSAGE' not in str(error)
    assert 'PRIVATE-SERVER-MESSAGE' not in ai.public_diagnostic(error)


def test_disabled_api_is_explained():
    error=ai.provider_error(httpx.Response(403,json={'error':{'details':[{'reason':'SERVICE_DISABLED'}]}}))
    assert error.code=='api_disabled' and 'aiplatform.googleapis.com' in str(error)


def test_readiness_get_makes_no_model_call_and_demo_is_explicit(client,monkeypatch):
    async def forbidden(*args,**kwargs):raise AssertionError('GET must not call provider')
    monkeypatch.setattr(ai,'generate',forbidden)
    local=client.get('/api/readiness').json()
    assert local['local_ready'] and local['provider']=='demo'
    report=client.post('/api/readiness/probe',json={}).json()
    assert report['ready'] and report['live'] is False


def test_failed_probe_never_marks_live_ready(client,monkeypatch):
    monkeypatch.setattr(settings,'provider','gemini');monkeypatch.setattr(settings,'api_key','unit-key')
    async def fail(*args,**kwargs):raise ai.AIError('Model tidak tersedia.','model_not_found')
    monkeypatch.setattr(ai,'generate',fail)
    report=client.post('/api/readiness/probe',json={}).json()
    assert not report['ready'] and report['error_code']=='model_not_found'
    assert client.get('/api/readiness').json()['live_ready'] is False
    monkeypatch.setattr(settings,'api_key','new-unit-key')
    assert client.get('/api/readiness').json()['live_ready'] is None


def test_probe_requires_admin(client,monkeypatch):
    monkeypatch.setattr(settings,'access_keys',json.dumps([{'id':'editor','role':'editor','token':'e'*32}]))
    assert client.post('/api/readiness/probe',json={},headers={'Authorization':'Bearer '+'e'*32}).status_code==403


def test_long_embeddings_use_complete_bounded_chunks(monkeypatch):
    monkeypatch.setattr(settings,'provider','gemini');monkeypatch.setattr(settings,'api_key','test-key');monkeypatch.setattr(settings,'embedding_dimensions',2)
    texts=[]
    async def post(url,headers,payload):texts.append(payload['content']['parts'][0]['text']);return {'embedding':{'values':[1,0]}}
    monkeypatch.setattr(ai,'post_json',post)
    text='layanan '+('administrasi publik '*400)
    vector=asyncio.run(ai.embedding(text,'RETRIEVAL_DOCUMENT'))
    assert len(texts)>1 and max(map(len,texts))<=2800
    assert ''.join(texts).replace(' ','')==text.replace(' ','') and vector==[1,0]


def test_http_requests_obey_concurrency_limit(monkeypatch):
    active=0;peak=0;original=httpx.AsyncClient
    async def handler(request):
        nonlocal active,peak
        active+=1;peak=max(peak,active);await asyncio.sleep(.02);active-=1
        return httpx.Response(200,json={'ok':True})
    monkeypatch.setattr(ai.httpx,'AsyncClient',lambda **kwargs:original(transport=httpx.MockTransport(handler),**kwargs))
    monkeypatch.setattr(settings,'ai_concurrency',2)
    async def requests():return await asyncio.gather(*(ai.post_json('https://provider.invalid',{}, {}) for _ in range(6)))
    assert len(asyncio.run(requests()))==6 and peak==2


def test_perspective_failure_cancels_siblings(client,monkeypatch):
    monkeypatch.setattr(settings,'provider','gemini');cancelled=[]
    async def generate(task,data,schema):
        if data['stakeholder']==simulation.PERSONAS[0][0]:raise ai.AIError('test failure')
        try:await asyncio.sleep(10)
        finally:cancelled.append(data['stakeholder'])
    monkeypatch.setattr(ai,'generate',generate)
    with pytest.raises(ai.AIError):asyncio.run(simulation.simulate(client.get('/api/drafts').json()[0],'Alternatif layanan publik.',Assumptions().model_dump()))
    assert len(cancelled)==3


def test_project_id_is_never_returned(monkeypatch):
    import json
    monkeypatch.setattr(settings,'provider','vertex');monkeypatch.setattr(settings,'project','secret-project-id');monkeypatch.setattr(settings,'credentials_path','')
    from app.services import readiness
    result=readiness.inspect()
    assert result['project_configured'] is True and 'secret-project-id' not in json.dumps(result)
