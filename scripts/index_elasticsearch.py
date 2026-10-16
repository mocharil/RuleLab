"""Create/refresh the Elasticsearch index from the corpus stored in the database (SQLite or Cloud SQL).

Resumable and incremental: each document stores the SHA-256 of its text, so unchanged articles keep their
existing embedding and are not sent to Gemini again; articles removed from the corpus are deleted.
Embeddings are produced concurrently and documents are written with the bulk API.

    python scripts/index_elasticsearch.py            # uses ELASTICSEARCH_* and EMBEDDING_* settings
"""
import asyncio,json,os,sys,hashlib
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from app import store
from app.config import settings
from app.services.ai import embedding,AIError
from app.services.retrieval import elastic_client

CONCURRENCY=int(os.getenv('RULELAB_INDEX_CONCURRENCY','10'))
BULK=200

def sha(text):return hashlib.sha256(text.encode()).hexdigest()

async def embed_with_retry(text):
 for attempt in range(6):
  try:return await embedding(text,'RETRIEVAL_DOCUMENT')
  except AIError as exc:
   if attempt==5 or not getattr(exc,'retryable',True):raise
   await asyncio.sleep(2**attempt)

async def existing(c):
 """{doc id: text_sha} of everything already indexed."""
 found={};r=await c.post(f'/{settings.elastic_index}/_search?scroll=2m',json={'size':5000,'_source':['text_sha']});r.raise_for_status();body=r.json()
 while body['hits']['hits']:
  for h in body['hits']['hits']:found[h['_id']]=h['_source'].get('text_sha')
  r=await c.post('/_search/scroll',json={'scroll':'2m','scroll_id':body['_scroll_id']});r.raise_for_status();body=r.json()
 await c.request('DELETE','/_search/scroll',json={'scroll_id':body.get('_scroll_id')})
 return found

async def bulk(c,lines):
 if not lines:return
 r=await c.post('/_bulk',content='\n'.join(lines)+'\n',headers={'Content-Type':'application/x-ndjson'});r.raise_for_status()
 if r.json().get('errors'):
  bad=[i for i in r.json()['items'] if next(iter(i.values())).get('error')][:3]
  raise RuntimeError('Bulk indexing errors: '+json.dumps(bad)[:600])

async def main():
 store.initialize()
 async with elastic_client() as c:
  r=await c.get('/'+settings.elastic_index)
  if r.status_code==404:
   r=await c.put('/'+settings.elastic_index,json={'settings':{'number_of_shards':1,'number_of_replicas':0},'mappings':{'properties':{
    'text':{'type':'text'},'title':{'type':'text'},'topics':{'type':'text'},'regulation_id':{'type':'keyword'},'text_sha':{'type':'keyword'},
    'embedding':{'type':'dense_vector','dims':settings.embedding_dimensions,'index':True,'similarity':'cosine'}}}});r.raise_for_status()
   have={}
  else:
   r.raise_for_status()
   dims=r.json().get(settings.elastic_index,{}).get('mappings',{}).get('properties',{}).get('embedding',{}).get('dims')
   if dims!=settings.embedding_dimensions:raise ValueError('Index dimensions differ. Use a new ELASTICSEARCH_INDEX before indexing.')
   have=await existing(c)
  docs=[(d,a) for d in store.regulations() for a in d['articles']]
  wanted={a['id'] for _,a in docs}
  stale=[i for i in have if i not in wanted]
  todo=[(d,a) for d,a in docs if have.get(a['id'])!=sha(a['text'])]
  print(f'{len(docs)} articles · {len(todo)} to embed · {len(stale)} stale',flush=True)
  semaphore=asyncio.Semaphore(CONCURRENCY);lines=[];done=0;lock=asyncio.Lock()
  async def work(d,a):
   nonlocal lines,done
   doc={'text':a['text'],'title':d['metadata']['title'],'topics':' '.join(a['enrichment']['topics']),'regulation_id':d['id'],'text_sha':sha(a['text'])}
   if a['text'].strip():
    try:
     async with semaphore:doc['embedding']=await embed_with_retry(a['text'])
    except AIError as exc:  # keep the article searchable by BM25 rather than failing the whole run
     print(f'  no embedding for {a["id"]}: {exc}',flush=True)
   else:print(f'  empty text, BM25 only: {a["id"]}',flush=True)
   async with lock:
    lines+=[json.dumps({'index':{'_index':settings.elastic_index,'_id':a['id']}}),json.dumps(doc,ensure_ascii=False)];done+=1
    if len(lines)>=BULK*2:
     batch,lines=lines,[];await bulk(c,batch)
    if done%500==0:print(f'  indexed {done}/{len(todo)}',flush=True)
  for i in range(0,len(todo),CONCURRENCY*20):
   await asyncio.gather(*(work(d,a) for d,a in todo[i:i+CONCURRENCY*20]))
  await bulk(c,lines)
  await bulk(c,[json.dumps({'delete':{'_index':settings.elastic_index,'_id':i}}) for i in stale])
  r=await c.post('/'+settings.elastic_index+'/_refresh');r.raise_for_status()
  r=await c.get('/'+settings.elastic_index+'/_count');r.raise_for_status()
  if r.json()['count']!=len(docs):raise ValueError(f'Index has {r.json()["count"]} documents, corpus has {len(docs)}.')
  meta={'corpus_sha':store.corpus_sha(),'model':settings.embedding_model,'dimensions':settings.embedding_dimensions,'provider':settings.provider,'location':settings.embedding_location}
  r=await c.put('/'+settings.elastic_index+'/_mapping',json={'_meta':{'rulelab':meta}});r.raise_for_status()
 print('Ready. Set SEARCH_BACKEND=elasticsearch and restart the service.')

if __name__=='__main__':asyncio.run(main())
