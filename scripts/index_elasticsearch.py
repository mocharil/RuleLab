"""Create an index and ingest corpus with cached Gemini embeddings. Resumable."""
import asyncio,json,sys,hashlib,tempfile,os
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from app import store
from app.config import ROOT,settings
from app.services.ai import embedding
from app.services.retrieval import elastic_client

async def main():
 store.initialize();cache_path=ROOT/'data/embeddings-cache.json'
 cache=json.loads(cache_path.read_text()) if cache_path.exists() else {}
 async with elastic_client() as c:
  r=await c.get('/'+settings.elastic_index)
  if r.status_code==404:
   r=await c.put('/'+settings.elastic_index,json={'mappings':{'properties':{
    'text':{'type':'text'},'title':{'type':'text'},'topics':{'type':'text'},'regulation_id':{'type':'keyword'},
    'embedding':{'type':'dense_vector','dims':settings.embedding_dimensions,'index':True,'similarity':'cosine'}}}});r.raise_for_status()
  else:
   r.raise_for_status()
   mapping=r.json().get(settings.elastic_index,{}).get('mappings',{})
   dims=mapping.get('properties',{}).get('embedding',{}).get('dims')
   if dims!=settings.embedding_dimensions:raise ValueError('Dimensi indeks berbeda. Gunakan ELASTICSEARCH_INDEX baru sebelum indexing.')
  for d in store.regulations():
   for a in d['articles']:
    digest=hashlib.sha256(a['text'].encode()).hexdigest()
    key=f"{settings.provider}:{settings.project}:{settings.embedding_location}:{settings.embedding_model}:{settings.embedding_dimensions}:{a['id']}:{digest}"
    if key not in cache:
     cache[key]=await embedding(a['text'],'RETRIEVAL_DOCUMENT')
     fd,name=tempfile.mkstemp(dir=cache_path.parent,prefix='.embedding-cache-')
     try:
      with os.fdopen(fd,'w') as output:json.dump(cache,output)
      os.replace(name,cache_path)
     finally:Path(name).unlink(missing_ok=True)
    r=await c.put(f'/{settings.elastic_index}/_doc/{a["id"].replace("/","%2F")}',json={
     'text':a['text'],'title':d['metadata']['title'],'topics':' '.join(a['enrichment']['topics']),
     'regulation_id':d['id'],'embedding':cache[key]});r.raise_for_status()
   print('Indexed',d['id'],len(d['articles']),flush=True)
  r=await c.post('/'+settings.elastic_index+'/_refresh');r.raise_for_status()
  r=await c.get('/'+settings.elastic_index+'/_count');r.raise_for_status()
  expected=sum(len(doc['articles']) for doc in store.regulations())
  if r.json()['count']!=expected:raise ValueError('Jumlah dokumen indeks berbeda dari corpus. Gunakan indeks baru untuk menghindari sumber lama.')
  meta={'corpus_sha':hashlib.sha256((ROOT/'data/corpus.json').read_bytes()).hexdigest(),'model':settings.embedding_model,'dimensions':settings.embedding_dimensions,'provider':settings.provider,'location':settings.embedding_location}
  r=await c.put('/'+settings.elastic_index+'/_mapping',json={'_meta':{'rulelab':meta}});r.raise_for_status()
 print('Ready. Set SEARCH_BACKEND=elasticsearch and restart server.')
if __name__=='__main__':asyncio.run(main())
