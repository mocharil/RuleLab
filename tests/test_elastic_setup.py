import asyncio,json,hashlib
import httpx
from app.config import settings
from app.services import readiness
from scripts import index_elasticsearch


def test_incremental_bulk_indexing_skips_unchanged_text_and_records_metadata(monkeypatch):
    document={'id':'law','metadata':{'title':'Test law'},'articles':[{'id':'law/1','text':'Pelayanan publik.','enrichment':{'topics':['access']}},
                                                                    {'id':'law/2','text':'Pengaduan masyarakat.','enrichment':{'topics':['clarity']}}]}
    monkeypatch.setattr(index_elasticsearch.store,'initialize',lambda:None)
    monkeypatch.setattr(index_elasticsearch.store,'regulations',lambda:[document])
    monkeypatch.setattr(index_elasticsearch.store,'corpus_sha',lambda:'abc123')
    monkeypatch.setattr(settings,'embedding_dimensions',2)
    indexed={};metadata={};calls=[];state={'exists':False,'scrolled':False}
    async def embed(text,task):calls.append(text);return [1.0,0.0]
    monkeypatch.setattr(index_elasticsearch,'embedding',embed)
    def handler(request):
        route=request.url.path;method=request.method
        if method=='GET' and route.endswith('/_count'):return httpx.Response(200,json={'count':len(indexed)})
        if method=='GET':return httpx.Response(200,json={settings.elastic_index:{'mappings':{'properties':{'embedding':{'dims':2}}}}}) if state['exists'] else httpx.Response(404)
        if method=='PUT' and route.endswith('/_mapping'):metadata.update(json.loads(request.content)['_meta']['rulelab']);return httpx.Response(200,json={})
        if method=='PUT':state['exists']=True;return httpx.Response(200,json={})
        if method=='POST' and route.endswith('/_search'):
            hits=[{'_id':i,'_source':{'text_sha':d['text_sha']}} for i,d in indexed.items()]
            return httpx.Response(200,json={'_scroll_id':'s','hits':{'hits':hits}})
        if method=='POST' and route.endswith('/_search/scroll'):return httpx.Response(200,json={'_scroll_id':'s','hits':{'hits':[]}})
        if method=='DELETE':return httpx.Response(200,json={})
        if method=='POST' and route.endswith('/_bulk'):
            lines=[json.loads(l) for l in request.content.decode().splitlines() if l]
            for i in range(0,len(lines),2):
                action=lines[i]
                if 'index' in action:indexed[action['index']['_id']]=lines[i+1]
                else:indexed.pop(action['delete']['_id'],None);lines.insert(i+1,None)
            return httpx.Response(200,json={'errors':False,'items':[]})
        return httpx.Response(200,json={'acknowledged':True})
    monkeypatch.setattr(index_elasticsearch,'elastic_client',lambda:httpx.AsyncClient(base_url='http://elastic-test',transport=httpx.MockTransport(handler)))
    asyncio.run(index_elasticsearch.main());assert len(calls)==2 and set(indexed)=={'law/1','law/2'}
    asyncio.run(index_elasticsearch.main());assert len(calls)==2          # nothing changed: no new embeddings
    document['articles'][0]['text']='Pelayanan publik dengan pendampingan.'
    asyncio.run(index_elasticsearch.main());assert len(calls)==3          # only the edited article is embedded again
    assert indexed['law/1']['text'].endswith('pendampingan.') and metadata['dimensions']==2 and metadata['corpus_sha']=='abc123'
    document['articles'].pop()
    asyncio.run(index_elasticsearch.main());assert set(indexed)=={'law/1'}  # removed articles are deleted


def test_readiness_rejects_legacy_or_mismatched_index(client,monkeypatch):
    def handler(request):return httpx.Response(200,json={settings.elastic_index:{'mappings':{'_meta':{'rulelab':{'dimensions':999}}}}})
    monkeypatch.setattr(readiness.retrieval,'elastic_client',lambda:httpx.AsyncClient(base_url='http://elastic-test',transport=httpx.MockTransport(handler)))
    import pytest
    from app.services.ai import AIError
    with pytest.raises(AIError,match='does not match'):asyncio.run(readiness.validate_elastic_index())
