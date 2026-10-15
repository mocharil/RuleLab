"""SQLite FTS for offline use; BM25 + vector rank fusion for Elasticsearch."""
import re
import httpx
from app import store
from app.config import settings
from app.services.ai import embedding

STOP={'yang','dan','atau','dalam','dengan','untuk','ini','itu','dapat','pasal','ayat','oleh','pada','sebagai','akan','tidak','hanya','dari','di','ke','adalah','peraturan'}
SYNONYMS={'digital':['elektronik','informasi','manual'],'internet':['akses','kemudahan','keterjangkauan'],
 'disabilitas':['rentan','aksesibilitas','fasilitas'],'pengaduan':['keluhan','tanggapan','ombudsman'],
 'biaya':['tarif','anggaran'],'warga':['masyarakat'],'konsultasi':['partisipasi','mengikutsertakan']}

def tokens(query):
 words=[w for w in re.findall(r'[\w]+',query.lower()) if len(w)>2 and w not in STOP]
 words=words[:40]
 for w in list(words):words.extend(SYNONYMS.get(w,[]))
 return list(dict.fromkeys(words))[:55]

def sqlite_search(query,limit=12,regulation_id=None):
 words=tokens(query)
 if not words:return []
 fts=' OR '.join('"'+w+'"' for w in words)
 with store.db() as c:
  sql='SELECT s.id,bm25(article_search,0,1,1.5,0.5) rank FROM article_search s JOIN articles a ON s.id=a.id WHERE article_search MATCH ?'
  params=[fts]
  if regulation_id:sql+=' AND a.regulation_id=?';params.append(regulation_id)
  sql+=' ORDER BY rank LIMIT ?';params.append(limit)
  rows=c.execute(sql,params).fetchall()
 return [{**store.article(r['id']),'retrieval_score':round(-r['rank'],5),'retrieval_method':'sqlite_fts_bm25'} for r in rows]

def elastic_client():
 headers={'Authorization':'ApiKey '+settings.elastic_key} if settings.elastic_key else {}
 auth=(settings.elastic_user,settings.elastic_password) if settings.elastic_user else None
 return httpx.AsyncClient(base_url=settings.elastic_url.rstrip('/'),headers=headers,auth=auth,verify=settings.elastic_ca or True,timeout=45)

async def elastic_search(query,limit=12,regulation_id=None):
 vector=await embedding(query)
 filters=[{'term':{'regulation_id':regulation_id}}] if regulation_id else []
 async with elastic_client() as client:
  bodies=[{'size':50,'query':{'bool':{'must':[{'multi_match':{'query':' '.join(tokens(query)),'fields':['text','topics^2','title']}}],'filter':filters}}},
   {'size':50,'knn':{'field':'embedding','query_vector':vector,'k':50,'num_candidates':150,**({'filter':{'bool':{'filter':filters}}} if filters else {})}}]
  responses=[]
  for body in bodies:
   r=await client.post(f'/{settings.elastic_index}/_search',json=body);r.raise_for_status();responses.append(r.json()['hits']['hits'])
 scores={}
 for hits in responses:
  for rank,hit in enumerate(hits,1):scores[hit['_id']]=scores.get(hit['_id'],0)+1/(60+rank)
 result=[]
 for id,score in sorted(scores.items(),key=lambda x:-x[1])[:limit]:
  try:result.append({**store.article(id),'retrieval_score':round(score,6),'retrieval_method':'elasticsearch_bm25_vector_rrf'})
  except KeyError:raise ValueError('The Elasticsearch index differs from the local corpus. Run a reindex.')
 return result

async def search(query,limit=12,regulation_id=None):
 if settings.search_backend=='elasticsearch':return await elastic_search(query,limit,regulation_id)
 if settings.search_backend!='sqlite':raise ValueError('SEARCH_BACKEND must be sqlite or elasticsearch')
 return sqlite_search(query,limit,regulation_id)

async def context(query,limit=14):
 hits=await search(query,limit)
 seen={a['id'] for a in hits}
 # Add definitions and adjacent clauses without claiming comprehensive retrieval.
 for hit in list(hits)[:6]:
  doc=next((d for d in store.regulations() if d['id']==hit['regulation_id']),None)
  if not doc:continue
  wanted={'1'}
  if hit['number'].isdigit():wanted|={str(int(hit['number'])-1),str(int(hit['number'])+1)}
  for a in doc['articles']:
   if a['number'] in wanted and a['id'] not in seen and len(hits)<28:
    hits.append({**store.article(a['id']),'retrieval_method':'definition_or_neighbor'});seen.add(a['id'])
 hits=expand_versions(hits)
 return hits

def expand_versions(hits):
 """Add related amendment blocks and effective-date containers, not consolidation."""
 hits=list(hits);seen={a['id'] for a in hits};docs=store.regulations()
 for hit in list(hits):
  related=[]
  for doc in docs:
   if hit['regulation_id'] in doc['metadata'].get('amends',[]):related.append(doc)
   if hit.get('target_regulation_id')==doc['id']:related.append(doc)
  for doc in related:
   for a in doc['articles']:
    if a['number'] in {hit['number'],'II'} and a['id'] not in seen:
     hits.append({**store.article(a['id']),'retrieval_method':'amendment_or_base_version'});seen.add(a['id'])
 return hits

def evidence_payload(evidence):
 return [{'id':a['id'],'label':a['regulation_label']+' Pasal '+a['number'], 'text':a['text'],
  'hierarchy_rank':a['hierarchy_rank'],'regulation_type':a['regulation_type'],'version_kind':a['version_kind'],
  'legal_status':a['legal_status'],'target_regulation_id':a.get('target_regulation_id'),
  'promulgated_on':a['promulgated_on'],'source_url':a['source']['url'],'pages':a['pages']} for a in evidence]
