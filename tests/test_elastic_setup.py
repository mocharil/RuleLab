import asyncio,json,hashlib
import httpx
from app.config import settings
from app.services import readiness
from scripts import index_elasticsearch


def test_index_cache_uses_content_hash_and_mapping_metadata(tmp_path,monkeypatch):
    corpus=tmp_path/'data';corpus.mkdir();(corpus/'corpus.json').write_text('{"documents":[]}')
    document={'id':'law','metadata':{'title':'Test law'},'articles':[{'id':'law/1','text':'Pelayanan publik.','enrichment':{'topics':['access']}}]}
    monkeypatch.setattr(index_elasticsearch,'ROOT',tmp_path)
    monkeypatch.setattr(index_elasticsearch.store,'initialize',lambda:None)
    monkeypatch.setattr(index_elasticsearch.store,'regulations',lambda:[document])
    monkeypatch.setattr(settings,'embedding_dimensions',2)
    indexed={};metadata={};calls=[];exists=False
    async def embed(text,task):calls.append(text);return [1.0,0.0]
    monkeypatch.setattr(index_elasticsearch,'embedding',embed)
    def handler(request):
        nonlocal exists,metadata
        route=request.url.path
        if request.method=='GET' and route.endswith('/_count'):return httpx.Response(200,json={'count':len(indexed)})
        if request.method=='GET':return httpx.Response(200,json={settings.elastic_index:{'mappings':{'properties':{'embedding':{'dims':2}}}}}) if exists else httpx.Response(404)
        if request.method=='PUT' and '/_doc/' in route:indexed[route]=json.loads(request.content)
        elif request.method=='PUT' and route.endswith('/_mapping'):metadata=json.loads(request.content)['_meta']['rulelab']
        elif request.method=='PUT':exists=True
        return httpx.Response(200,json={'acknowledged':True})
    monkeypatch.setattr(index_elasticsearch,'elastic_client',lambda:httpx.AsyncClient(base_url='http://elastic-test',transport=httpx.MockTransport(handler)))
    asyncio.run(index_elasticsearch.main());asyncio.run(index_elasticsearch.main());assert len(calls)==1
    document['articles'][0]['text']='Pelayanan publik dengan pendampingan.'
    asyncio.run(index_elasticsearch.main());assert len(calls)==2
    assert metadata['dimensions']==2 and metadata['corpus_sha']==hashlib.sha256((corpus/'corpus.json').read_bytes()).hexdigest()


def test_readiness_rejects_legacy_or_mismatched_index(client,monkeypatch):
    def handler(request):return httpx.Response(200,json={settings.elastic_index:{'mappings':{'_meta':{'rulelab':{'dimensions':999}}}}})
    monkeypatch.setattr(readiness.retrieval,'elastic_client',lambda:httpx.AsyncClient(base_url='http://elastic-test',transport=httpx.MockTransport(handler)))
    import pytest
    from app.services.ai import AIError
    with pytest.raises(AIError,match='belum sesuai'):asyncio.run(readiness.validate_elastic_index())
