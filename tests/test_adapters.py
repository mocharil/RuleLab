import asyncio,json
import pytest,httpx
from app.config import settings
from app import store
from app.services import ai,retrieval
from app.models import AnalysisOutput

def test_elasticsearch_fusion_filters(client,monkeypatch):
 monkeypatch.setattr(settings,'search_backend','elasticsearch')
 doc=store.regulations()[0];ids=[a['id'] for a in doc['articles'][:3]]
 async def emb(query):return [0.1]*settings.embedding_dimensions
 monkeypatch.setattr(retrieval,'embedding',emb)
 bodies=[]
 def handler(request):
  body=json.loads(request.content);bodies.append(body)
  hits=[{'_id':ids[0]},{'_id':ids[1]}] if 'query' in body else [{'_id':ids[1]},{'_id':ids[2]}]
  return httpx.Response(200,json={'hits':{'hits':hits}})
 monkeypatch.setattr(retrieval,'elastic_client',lambda:httpx.AsyncClient(base_url='http://elastic-test',transport=httpx.MockTransport(handler)))
 result=asyncio.run(retrieval.search('pelayanan',limit=3,regulation_id=doc['id']))
 assert result[0]['id']==ids[1] # Shared match outranks single-list matches.
 assert result[0]['retrieval_method']=='elasticsearch_bm25_vector_rrf'
 assert bodies[0]['query']['bool']['filter']==[{'term':{'regulation_id':doc['id']}}]
 assert len(bodies[1]['knn']['query_vector'])==settings.embedding_dimensions

def test_vertex_endpoint_adc(monkeypatch):
 import google.auth
 monkeypatch.setattr(settings,'provider','vertex');monkeypatch.setattr(settings,'project','unit-project');monkeypatch.setattr(settings,'location','global');monkeypatch.setattr(settings,'credentials_path','')
 ai.reset_auth_cache()
 class Credentials:
  token=None
  def refresh(self,request):self.token='test-access-token'
 monkeypatch.setattr(google.auth,'default',lambda scopes:(Credentials(),'unit-project'))
 try:
  url,headers=asyncio.run(ai.endpoint())
  assert url.startswith('https://aiplatform.googleapis.com/v1/projects/unit-project/locations/global/')
  assert headers['Authorization']=='Bearer test-access-token'
 finally:
  ai.reset_auth_cache()

def test_incomplete_and_malformed_ai_rejected(monkeypatch):
 monkeypatch.setattr(settings,'provider','gemini');monkeypatch.setattr(settings,'api_key','test-key')
 async def truncated(*args):return {'candidates':[{'finishReason':'MAX_TOKENS','content':{'parts':[{'text':'{}'}]}}]}
 monkeypatch.setattr(ai,'post_json',truncated)
 with pytest.raises(ai.AIError):asyncio.run(ai.generate('test',{},AnalysisOutput))
 async def malformed(*args):return {'candidates':[{'finishReason':'STOP','content':{'parts':[{'text':'not-json'}]}}]}
 monkeypatch.setattr(ai,'post_json',malformed)
 with pytest.raises(ai.AIError):asyncio.run(ai.generate('test',{},AnalysisOutput))

def test_csp_is_enabled(client):
 response=client.get('/')
 csp=response.headers['content-security-policy']
 assert "script-src 'self'" in csp;assert 'unsafe-eval' not in csp
 assert response.headers['x-content-type-options']=='nosniff'
