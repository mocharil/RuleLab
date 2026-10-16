"""Original source documents (PDF/HTML) and the corpus files: local `data/` folder or a GCS bucket.

Set RULELAB_SOURCES_BUCKET (and optionally RULELAB_SOURCES_PREFIX, default `data/`) to read from Google Cloud
Storage with Application Default Credentials. Paths are the relative names stored in each regulation's
provenance, e.g. `raw/uu-no-25-tahun-2009.pdf`.
"""
from __future__ import annotations
import hashlib,threading,time
from pathlib import Path
from urllib.parse import quote
from app import store
from app.config import ROOT,settings

_API='https://storage.googleapis.com/storage/v1/b'
_session=None
_lock=threading.Lock()
_index_cache={'at':0.0,'names':set()}

def using_gcs():return bool(settings.sources_bucket)

def _http():
 global _session
 with _lock:
  if _session is None:
   import google.auth
   from google.auth.transport.requests import AuthorizedSession
   credentials,_=google.auth.default(scopes=['https://www.googleapis.com/auth/devstorage.read_write'])
   _session=AuthorizedSession(credentials)
  return _session

def _object(rel):return settings.sources_prefix.rstrip('/')+'/'+rel.lstrip('/')

def safe(rel):
 """Only relative paths below raw/ or the corpus files are served."""
 p=Path(rel)
 return bool(rel) and not p.is_absolute() and '..' not in p.parts and (p.parts[0]=='raw' or rel=='corpus.json')

def _local(rel):return (ROOT/'data'/rel).resolve()

def read(rel):
 """Whole object as bytes (None when missing)."""
 if not using_gcs():
  path=_local(rel);return path.read_bytes() if path.is_file() else None
 r=_http().get(f'{_API}/{settings.sources_bucket}/o/{quote(_object(rel),safe="")}',params={'alt':'media'},timeout=120)
 if r.status_code==404:return None
 r.raise_for_status();return r.content

def stream(rel,chunk=1<<20):
 """Yield the object in chunks (GCS) or the local file; raises FileNotFoundError when missing."""
 if not using_gcs():
  path=_local(rel)
  if not path.is_file():raise FileNotFoundError(rel)
  with path.open('rb') as handle:
   while True:
    block=handle.read(chunk)
    if not block:return
    yield block
 r=_http().get(f'{_API}/{settings.sources_bucket}/o/{quote(_object(rel),safe="")}',params={'alt':'media'},stream=True,timeout=120)
 if r.status_code==404:raise FileNotFoundError(rel)
 r.raise_for_status()
 try:
  yield from r.iter_content(chunk)
 finally:r.close()

def names(refresh=False):
 """Names (relative) of all documents under raw/ (cached for 5 minutes in GCS mode)."""
 if not using_gcs():
  folder=ROOT/'data/raw';return {'raw/'+p.name for p in folder.iterdir() if p.is_file()} if folder.is_dir() else set()
 if not refresh and time.time()-_index_cache['at']<300 and _index_cache['names']:return _index_cache['names']
 found=set();token=None;prefix=_object('raw/')
 while True:
  params={'prefix':prefix,'fields':'items(name),nextPageToken','maxResults':1000,**({'pageToken':token} if token else {})}
  r=_http().get(f'{_API}/{settings.sources_bucket}/o',params=params,timeout=60);r.raise_for_status();body=r.json()
  found.update(i['name'][len(settings.sources_prefix.rstrip('/'))+1:] for i in body.get('items',[]))
  token=body.get('nextPageToken')
  if not token:break
 _index_cache.update(at=time.time(),names=found);return found

def exists(rel):return rel in names()

def missing(regulations):
 have=names()
 return [d['id'] for d in regulations if d['provenance']['raw_file'] not in have]

def sync_checksums(limit=None):
 """Hash every original document once and store the result (run after uploading new sources)."""
 known={}
 with store.db() as c:
  known={r['path']:r['size'] for r in c.execute('SELECT path,size FROM source_files')}
 done=0
 for rel in sorted(names(refresh=True)):
  data=read(rel)
  if data is None:continue
  if known.get(rel)==len(data):continue
  with store.db() as c:
   c.execute('DELETE FROM source_files WHERE path=?',(rel,))
   c.execute('INSERT INTO source_files(path,size,sha256,checked_at) VALUES (?,?,?,?)',(rel,len(data),hashlib.sha256(data).hexdigest(),store.now()))
  done+=1
  if limit and done>=limit:break
 return done

def checksums():
 """{relative path: sha256}. GCS mode reads the table filled by sync_checksums; local mode hashes the files (cached)."""
 if using_gcs():
  with store.db() as c:
   return {r['path']:r['sha256'] for r in c.execute('SELECT path,sha256 FROM source_files')}
 return {rel:_local_digest(rel) for rel in names()}

_digest_cache={}
def _local_digest(rel):
 path=_local(rel);stat=path.stat();key=(rel,stat.st_size,stat.st_mtime_ns)
 if key not in _digest_cache:_digest_cache[key]=hashlib.sha256(path.read_bytes()).hexdigest()
 return _digest_cache[key]
