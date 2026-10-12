"""Local readiness is separate from an explicit, billable provider probe."""
from datetime import datetime,timezone
import hashlib,json
from pathlib import Path
from pydantic import BaseModel
from typing import Literal
from app.config import ROOT,settings
from app import store
from app.services import ai,retrieval
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
            (ROOT/'data/corpus.json').stat().st_mtime_ns if (ROOT/'data/corpus.json').exists() else None)


def inspect():
    checks=[]
    def add(key,label,status,detail):checks.append({'key':key,'label':label,'status':status,'detail':detail})
    add('provider','Provider AI','passed' if settings.provider in {'demo','gemini','vertex'} else 'failed',settings.provider)
    if settings.provider=='vertex':
        if settings.credentials_path:
            try:
                info=service_account_info((ROOT/Path(settings.credentials_path).expanduser()).resolve())
                add('credentials','Service account','passed','Format SA valid; token dan IAM belum diuji.')
                project=settings.project or info['project_id']
            except CredentialError as exc:
                add('credentials','Service account','failed',str(exc));project=settings.project
        else:
            add('credentials','Application Default Credentials','pending','Uji koneksi untuk memeriksa ADC pada server.');project=settings.project
        add('project','Project Google Cloud','passed' if project else 'pending',project or 'Akan diinfer dari ADC saat uji koneksi.')
    elif settings.provider=='gemini':
        add('credentials','Gemini API key','passed' if settings.api_key else 'failed','Tersedia di server.' if settings.api_key else 'GEMINI_API_KEY belum dikonfigurasi.');project=None
    else:
        add('credentials','Mode demo','passed','Template lokal; tidak memanggil layanan LLM.');project=None
    try:
        regulations=store.regulations()
        with store.db() as connection:
            count=connection.execute('SELECT COUNT(*) FROM articles').fetchone()[0]
            fts=connection.execute('SELECT COUNT(*) FROM article_search').fetchone()[0]
        add('corpus','Corpus dan indeks lokal','passed' if count and count==fts else 'failed',f'{len(regulations)} regulasi · {count} pasal/blok · {fts} entri FTS.')
        missing=[doc['id'] for doc in regulations if not (ROOT/'data'/doc['provenance']['raw_file']).is_file()]
        add('sources','Naskah sumber','failed' if missing else 'passed','File sumber belum tersedia.' if missing else 'Naskah asli tersedia untuk penelusuran.')
    except Exception:
        add('corpus','Database lokal','failed','Database atau corpus tidak dapat dibaca. Periksa folder data dan izin tulis.')
    add('search','Retrieval','passed' if settings.search_backend=='sqlite' else 'pending' if settings.search_backend=='elasticsearch' else 'failed',
        'SQLite BM25 siap; embedding tidak diperlukan.' if settings.search_backend=='sqlite' else 'Elasticsearch dan embedding diperiksa saat uji koneksi.' if settings.search_backend=='elasticsearch' else 'SEARCH_BACKEND tidak valid.')
    recent=_last_probe['result'] if _last_probe and _last_probe['signature']==signature() else None
    return {'provider':settings.provider,'model':None if settings.provider=='demo' else settings.model,'project':project,
            'location':settings.location,'embedding_location':settings.embedding_location,'search_backend':settings.search_backend,
            'local_ready':not any(check['status']=='failed' for check in checks),'live_ready':recent['ready'] if recent else None,
            'checks':checks,'last_probe':recent,'notice':'Pemeriksaan lokal tidak membuktikan akses IAM, billing, kuota, atau ketersediaan model live.'}


async def validate_elastic_index():
 async with retrieval.elastic_client() as client:
  response=await client.get('/'+settings.elastic_index+'/_mapping');response.raise_for_status()
  mapping=response.json().get(settings.elastic_index,{}).get('mappings',{})
  metadata=mapping.get('_meta',{}).get('rulelab',{})
  expected={'corpus_sha':hashlib.sha256((ROOT/'data/corpus.json').read_bytes()).hexdigest(),'model':settings.embedding_model,'dimensions':settings.embedding_dimensions,'provider':settings.provider,'location':settings.embedding_location}
  if any(metadata.get(key)!=value for key,value in expected.items()):raise ai.AIError('Indeks Elasticsearch belum sesuai corpus/model saat ini. Jalankan scripts/index_elasticsearch.py sebelum mengaktifkan retrieval.','retrieval')
  count=await client.get('/'+settings.elastic_index+'/_count');count.raise_for_status()
  if count.json()['count']!=sum(len(doc['articles']) for doc in store.regulations()):raise ai.AIError('Jumlah dokumen indeks berbeda dari corpus. Gunakan indeks baru lalu indeksasi ulang.','retrieval')


async def probe():
    global _last_probe
    result={'ready':False,'checked_at':datetime.now(timezone.utc).isoformat(),'provider':settings.provider,
            'model':None if settings.provider=='demo' else settings.model,'steps':[]}
    local=inspect()
    if not local['local_ready']:
        result.update(error_code='configuration',detail='Perbaiki pemeriksaan lokal yang gagal sebelum uji koneksi.')
    elif settings.provider=='demo':
        result.update(ready=True,live=False,detail='Mode demo siap. Tidak ada koneksi LLM yang diuji.')
    else:
        try:
            if settings.search_backend=='elasticsearch':await validate_elastic_index()
            output,meta=await ai.generate('Uji koneksi. Kembalikan status ok sesuai schema.',{},ConnectionOutput,max_output_tokens=4096,legal_guide=False)
            result['steps'].append({'label':'Autentikasi & structured output','status':'passed','provider':meta['provider'],'model':meta['model']})
            hits=await retrieval.search('pelayanan publik')
            if not hits:raise ai.AIError('Retrieval tidak menemukan corpus contoh. Periksa indeks.','retrieval')
            result['steps'].append({'label':'Retrieval sumber','status':'passed','sources':len(hits),'backend':settings.search_backend})
            result.update(ready=True,live=True,detail='Koneksi model, output JSON dan retrieval berhasil diuji.')
        except ai.AIError as exc:
            result.update(error_code=exc.code,detail=str(exc),retryable=exc.retryable)
        except Exception:
            result.update(error_code='retrieval',detail='Indeks pencarian belum siap. Periksa koneksi, dimensi, dan jalankan indeksasi Elasticsearch.')
    _last_probe={'signature':signature(),'result':result}
    return result
