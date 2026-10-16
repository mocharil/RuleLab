"""Local readiness is separate from an explicit, billable provider probe."""
from datetime import datetime,timezone
import hashlib
from pathlib import Path
from pydantic import BaseModel
from typing import Literal
from app.config import ROOT,settings
from app import store
from app.services import ai,retrieval,sources
from app.services.credentials import service_account_info,CredentialError

_last_probe=None

class ConnectionOutput(BaseModel):
    status: Literal['ok']


def signature():
    path=Path(settings.credentials_path).expanduser() if settings.credentials_path else None
    if path and not path.is_absolute():path=ROOT/path
    return (settings.provider,settings.project,settings.location,settings.model,str(path),
            path.stat().st_mtime_ns if path and path.exists() else None,settings.search_backend,
            settings.embedding_model,settings.embedding_location,settings.embedding_dimensions,settings.elastic_url,settings.elastic_index,str(settings.db_path),
            hashlib.sha256((settings.api_key+settings.elastic_key+settings.elastic_password).encode()).hexdigest(),
            store.corpus_sha())


def inspect():
    checks=[]
    def add(key,label,status,detail):checks.append({'key':key,'label':label,'status':status,'detail':detail})
    add('provider','AI provider','passed' if settings.provider in {'demo','gemini','vertex'} else 'failed',settings.provider)
    if settings.provider=='vertex':
        if settings.credentials_path:
            try:
                info=service_account_info((ROOT/Path(settings.credentials_path).expanduser()).resolve())
                add('credentials','Service account','passed','SA format valid; token and IAM not tested yet.')
                project=settings.project or info['project_id']
            except CredentialError as exc:
                add('credentials','Service account','failed',str(exc));project=settings.project
        else:
            add('credentials','Application Default Credentials','pending','Run the connection test to check ADC on the server.');project=settings.project
        add('project','Google Cloud project','passed' if project else 'pending',project or 'Will be inferred from ADC during the connection test.')
    elif settings.provider=='gemini':
        add('credentials','Gemini API key','passed' if settings.api_key else 'failed','Available on the server.' if settings.api_key else 'GEMINI_API_KEY is not configured.');project=None
    else:
        add('credentials','Demo mode','passed','Local templates; no LLM service is called.');project=None
    try:
        regulations=store.regulations()
        with store.db() as connection:
            count=connection.execute('SELECT COUNT(*) FROM articles').fetchone()[0]
            fts=connection.execute('SELECT COUNT(*) FROM article_search').fetchone()[0]
        add('corpus','Corpus and local index','passed' if count and count==fts else 'failed',f'{len(regulations)} regulations · {count} articles/blocks · {fts} FTS entries.')
        missing=sources.missing(regulations)
        where='Google Cloud Storage' if sources.using_gcs() else 'local folder'
        add('sources','Source documents','failed' if missing else 'passed',f'{len(missing)} source files not available yet.' if missing else f'Original texts available for tracing ({where}).')
    except Exception:
        add('corpus','Local database','failed','The database or corpus cannot be read. Check the data folder and write permissions.')
    add('search','Retrieval','passed' if settings.search_backend=='sqlite' else 'pending' if settings.search_backend=='elasticsearch' else 'failed',
        'SQLite BM25 ready; embeddings not needed.' if settings.search_backend=='sqlite' else 'Elasticsearch and embeddings are checked during the connection test.' if settings.search_backend=='elasticsearch' else 'Invalid SEARCH_BACKEND.')
    recent=_last_probe['result'] if _last_probe and _last_probe['signature']==signature() else None
    return {'provider':settings.provider,'model':None if settings.provider=='demo' else settings.model,'project':project,
            'location':settings.location,'embedding_location':settings.embedding_location,'search_backend':settings.search_backend,
            'local_ready':not any(check['status']=='failed' for check in checks),'live_ready':recent['ready'] if recent else None,
            'checks':checks,'last_probe':recent,'notice':'Local checks do not prove IAM access, billing, quota or live model availability.'}


async def validate_elastic_index():
 async with retrieval.elastic_client() as client:
  response=await client.get('/'+settings.elastic_index+'/_mapping');response.raise_for_status()
  mapping=response.json().get(settings.elastic_index,{}).get('mappings',{})
  metadata=mapping.get('_meta',{}).get('rulelab',{})
  expected={'corpus_sha':store.corpus_sha(),'model':settings.embedding_model,'dimensions':settings.embedding_dimensions,'provider':settings.provider,'location':settings.embedding_location}
  if any(metadata.get(key)!=value for key,value in expected.items()):raise ai.AIError('The Elasticsearch index does not match the current corpus/model. Run scripts/index_elasticsearch.py before enabling retrieval.','retrieval')
  count=await client.get('/'+settings.elastic_index+'/_count');count.raise_for_status()
  if count.json()['count']!=sum(len(doc['articles']) for doc in store.regulations()):raise ai.AIError('Index document count differs from the corpus. Use a new index and re-index.','retrieval')


async def probe():
    global _last_probe
    result={'ready':False,'checked_at':datetime.now(timezone.utc).isoformat(),'provider':settings.provider,
            'model':None if settings.provider=='demo' else settings.model,'steps':[]}
    local=inspect()
    if not local['local_ready']:
        result.update(error_code='configuration',detail='Fix the failing local checks before the connection test.')
    elif settings.provider=='demo':
        result.update(ready=True,live=False,detail='Demo mode ready. No LLM connection tested.')
    else:
        try:
            if settings.search_backend=='elasticsearch':await validate_elastic_index()
            output,meta=await ai.generate('Uji koneksi. Kembalikan status ok sesuai schema.',{},ConnectionOutput,max_output_tokens=4096,legal_guide=False)
            result['steps'].append({'label':'Authentication & structured output','status':'passed','provider':meta['provider'],'model':meta['model']})
            hits=await retrieval.search('pelayanan publik')
            if not hits:raise ai.AIError('Retrieval did not find the sample corpus. Check the index.','retrieval')
            result['steps'].append({'label':'Source retrieval','status':'passed','sources':len(hits),'backend':settings.search_backend})
            result.update(ready=True,live=True,detail='Model connection, JSON output and retrieval tested successfully.')
        except ai.AIError as exc:
            result.update(error_code=exc.code,detail=str(exc),retryable=exc.retryable)
        except Exception:
            result.update(error_code='retrieval',detail='The search index is not ready. Check the connection and dimensions, then run Elasticsearch indexing.')
    _last_probe={'signature':signature(),'result':result}
    return result
