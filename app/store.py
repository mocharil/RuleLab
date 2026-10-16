"""Canonical snapshots and immutable revisions.

SQLite (default; offline, tests) or PostgreSQL / Cloud SQL when DATABASE_URL is set. The SQL used by the
application is written once with `?` placeholders; the PostgreSQL adapter below translates it.
FTS5 (SQLite) / tsvector (PostgreSQL) is the built-in retrieval backend; Elasticsearch is optional.
"""
from __future__ import annotations
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
import hashlib,json,os,sqlite3,time,uuid
from app.config import ROOT,settings

class RevisionConflict(Exception):pass

def now():return datetime.now(timezone.utc).isoformat()

def is_postgres():return bool(settings.database_url)

class Row(tuple):
 """Row readable by position and by column name (like sqlite3.Row); dict(row) works."""
 def __new__(cls,names,values):
  r=super().__new__(cls,values);r._names=names;return r
 def __getitem__(self,key):
  if isinstance(key,str):
   try:return super().__getitem__(self._names.index(key))
   except ValueError:raise KeyError(key) from None
  return super().__getitem__(key)
 def keys(self):return list(self._names)

def _row_factory(cursor):
 names=[d.name for d in (cursor.description or [])]
 return lambda values:Row(names,values)

_pool=None
def _get_pool():
 global _pool
 if _pool is None:
  from psycopg_pool import ConnectionPool
  kwargs={'row_factory':_row_factory}
  if os.getenv('DATABASE_PASSWORD'):kwargs['password']=os.environ['DATABASE_PASSWORD']
  _pool=ConnectionPool(settings.database_url,min_size=1,max_size=int(os.getenv('RULELAB_DB_POOL','12')),kwargs=kwargs,timeout=30,open=True)
 return _pool

class PGConnection:
 """Minimal sqlite-style facade over a psycopg connection (transaction owned by db())."""
 def __init__(self,raw):self.raw=raw
 def execute(self,sql,params=()):
  if sql.lstrip().upper().startswith('BEGIN'):return self.raw.execute('SELECT pg_advisory_xact_lock(7001)')  # BEGIN IMMEDIATE -> serialise writers
  return self.raw.execute(sql.replace('%','%%').replace('?','%s'),params)
 def executemany(self,sql,rows):
  with self.raw.cursor() as cur:cur.executemany(sql.replace('%','%%').replace('?','%s'),rows)
 def executescript(self,script):
  for statement in script.split(';'):
   if statement.strip():self.raw.execute(statement)

def auto_pk():return 'BIGSERIAL PRIMARY KEY' if is_postgres() else 'INTEGER PRIMARY KEY AUTOINCREMENT'

def connect():
 c=sqlite3.connect(settings.db_path,timeout=15)
 c.row_factory=sqlite3.Row;c.execute('PRAGMA foreign_keys=ON');c.execute('PRAGMA busy_timeout=15000');c.execute('PRAGMA synchronous=NORMAL')
 return c

def _transient(exc):
 if isinstance(exc,sqlite3.OperationalError):return any(s in str(exc).lower() for s in ('locked','busy'))
 return type(exc).__name__ in {'DeadlockDetected','SerializationFailure','OperationalError'}  # psycopg

def retry_locked(fn,*args,attempts=8,**kwargs):
 """Retry a database call while another writer holds the lock (SQLite) or on deadlock/serialisation errors (PostgreSQL)."""
 for attempt in range(attempts):
  try:return fn(*args,**kwargs)
  except Exception as exc:
   if attempt==attempts-1 or not _transient(exc):raise
   time.sleep(min(0.5*(attempt+1),3))

@contextmanager
def db():
 if is_postgres():
  with _get_pool().connection() as raw:  # commits on success, rolls back on error
   yield PGConnection(raw)
  return
 c=connect()
 try:
  yield c
  c.commit()
 except Exception:
  c.rollback()
  raise
 finally:
  c.close()

def _cache_key():return settings.database_url or str(settings.db_path)

_cache_db=None
_regs_cache=None
_arts_cache=None

SQLITE_SCHEMA='''
  PRAGMA journal_mode=WAL;
  CREATE TABLE IF NOT EXISTS regulations(id TEXT PRIMARY KEY,payload TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS articles(id TEXT PRIMARY KEY,regulation_id TEXT NOT NULL,payload TEXT NOT NULL);
  CREATE VIRTUAL TABLE IF NOT EXISTS article_search USING fts5(id UNINDEXED,text,topics,title,tokenize='unicode61');
  CREATE TABLE IF NOT EXISTS drafts(id TEXT PRIMARY KEY,revision INTEGER NOT NULL,payload TEXT NOT NULL,updated_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS revisions(draft_id TEXT,revision INTEGER,payload TEXT NOT NULL,created_at TEXT NOT NULL,PRIMARY KEY(draft_id,revision));
  CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY,draft_id TEXT,revision INTEGER,kind TEXT,payload TEXT,created_at TEXT,review_status TEXT DEFAULT 'needs_review',review_notes TEXT DEFAULT '');
  CREATE TABLE IF NOT EXISTS metadata(key TEXT PRIMARY KEY,value TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS source_files(path TEXT PRIMARY KEY,size BIGINT,sha256 TEXT,checked_at TEXT);
  '''
PG_SCHEMA='''
  CREATE TABLE IF NOT EXISTS regulations(id TEXT PRIMARY KEY,payload TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS articles(id TEXT PRIMARY KEY,regulation_id TEXT NOT NULL,payload TEXT NOT NULL);
  CREATE INDEX IF NOT EXISTS articles_regulation_idx ON articles(regulation_id);
  CREATE TABLE IF NOT EXISTS article_search(id TEXT PRIMARY KEY,tsv tsvector NOT NULL);
  CREATE INDEX IF NOT EXISTS article_search_tsv_idx ON article_search USING GIN(tsv);
  CREATE TABLE IF NOT EXISTS drafts(id TEXT PRIMARY KEY,revision INTEGER NOT NULL,payload TEXT NOT NULL,updated_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS revisions(draft_id TEXT,revision INTEGER,payload TEXT NOT NULL,created_at TEXT NOT NULL,PRIMARY KEY(draft_id,revision));
  CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY,draft_id TEXT,revision INTEGER,kind TEXT,payload TEXT,created_at TEXT,review_status TEXT DEFAULT 'needs_review',review_notes TEXT DEFAULT '');
  CREATE INDEX IF NOT EXISTS runs_draft_idx ON runs(draft_id,created_at);
  CREATE TABLE IF NOT EXISTS metadata(key TEXT PRIMARY KEY,value TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS source_files(path TEXT PRIMARY KEY,size BIGINT,sha256 TEXT,checked_at TEXT)
  '''

def corpus_sha():
 with db() as c:
  row=c.execute("SELECT value FROM metadata WHERE key='corpus_sha'").fetchone()
 return row['value'] if row else None

def _corpus_bytes(local_only):
 corpus=ROOT/'data/corpus.json'
 if corpus.exists():return corpus.read_bytes()
 if local_only or not settings.sources_bucket:return None
 from app.services import sources
 return sources.read('corpus.json')

def _clean(text):return text.replace('\x00','')

def ingest_corpus(c,content):
 """Replace the regulations/articles/search index with the corpus in `content` (bytes of corpus.json)."""
 fingerprint=hashlib.sha256(content).hexdigest();docs=json.loads(content)['documents']
 if is_postgres():
  c.execute('TRUNCATE regulations,articles,article_search')
  c.executemany('INSERT INTO regulations VALUES (?,?)',[(d['id'],json.dumps(d,ensure_ascii=False)) for d in docs])
  rows=[(a['id'],d['id'],json.dumps(a,ensure_ascii=False)) for d in docs for a in d['articles']]
  fts=[(a['id'],_clean(a['text']),' '.join(a['enrichment']['topics']),_clean(d['metadata']['title'])) for d in docs for a in d['articles']]
  for i in range(0,len(rows),2000):c.executemany('INSERT INTO articles VALUES (?,?,?)',rows[i:i+2000])
  for i in range(0,len(fts),2000):c.executemany("INSERT INTO article_search(id,tsv) VALUES (?,setweight(to_tsvector('simple',?),'B')||setweight(to_tsvector('simple',?),'A')||setweight(to_tsvector('simple',?),'C'))",fts[i:i+2000])
 else:
  c.execute('DELETE FROM regulations');c.execute('DELETE FROM articles');c.execute('DELETE FROM article_search')
  for doc in docs:
   c.execute('INSERT INTO regulations VALUES (?,?)',(doc['id'],json.dumps(doc,ensure_ascii=False)))
   for a in doc['articles']:
    c.execute('INSERT INTO articles VALUES (?,?,?)',(a['id'],doc['id'],json.dumps(a,ensure_ascii=False)))
    c.execute('INSERT INTO article_search VALUES (?,?,?,?)',(a['id'],a['text'],' '.join(a['enrichment']['topics']),doc['metadata']['title']))
 c.execute("INSERT INTO metadata(key,value) VALUES ('corpus_sha',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",(fingerprint,))
 return fingerprint

def initialize():
 global _cache_db,_regs_cache,_arts_cache
 _cache_db=None;_regs_cache=None;_arts_cache=None
 if not is_postgres():settings.db_path.parent.mkdir(parents=True,exist_ok=True)
 with db() as c:
  if is_postgres():
   c.execute('SELECT pg_advisory_xact_lock(7002)')  # one instance migrates/ingests at a time
   c.executescript(PG_SCHEMA)
   old=c.execute("SELECT value FROM metadata WHERE key='corpus_sha'").fetchone()
   local=(ROOT/'data/corpus.json').exists()
   if (local and (not old or old['value']!=hashlib.sha256((ROOT/'data/corpus.json').read_bytes()).hexdigest())) or (not old and not local):
    content=_corpus_bytes(False)
    if content:ingest_corpus(c,content)
  else:
   c.executescript(SQLITE_SCHEMA)
   content=_corpus_bytes(True)
   if content:
    old=c.execute("SELECT value FROM metadata WHERE key='corpus_sha'").fetchone()
    if not old or old['value']!=hashlib.sha256(content).hexdigest():ingest_corpus(c,content)
  if not c.execute('SELECT id FROM drafts LIMIT 1').fetchone():
   create_draft({'title':'Layanan Publik Digital yang Inklusif','regulation_type':'PP','scope':'Layanan permohonan administrasi publik','preamble':'Rancangan simulasi untuk pengujian RuleLab. Belum merupakan naskah resmi.',
    'articles':[{'number':'1','text':'Dalam rancangan ini, layanan digital adalah layanan permohonan administrasi melalui aplikasi elektronik.'},
     {'number':'2','text':'(1) Permohonan hanya dapat diajukan melalui aplikasi digital.\n(2) Pemohon yang tidak memiliki akses internet tidak dapat mengajukan permohonan.'},
     {'number':'3','text':'Pengaduan masyarakat tidak perlu ditanggapi oleh penyelenggara.'},
     {'number':'4','text':'Peraturan ini berlaku sejak ditetapkan tanpa masa transisi.'}]},connection=c)
 _ensure_corpus_cache()

def create_draft(payload,connection=None):
 id=uuid.uuid4().hex;timestamp=now();raw=json.dumps(payload,ensure_ascii=False)
 def insert(c):
  c.execute('INSERT INTO drafts VALUES (?,?,?,?)',(id,1,raw,timestamp));c.execute('INSERT INTO revisions VALUES (?,?,?,?)',(id,1,raw,timestamp))
 if connection:insert(connection)
 else:
  with db() as c:insert(c)
 return get_draft(id,connection)

def get_draft(id,connection=None):
 def read(c):
  r=c.execute('SELECT * FROM drafts WHERE id=?',(id,)).fetchone()
  if not r:raise KeyError('Draft not found')
  return {'id':r['id'],'revision':r['revision'],'updated_at':r['updated_at'],**json.loads(r['payload'])}
 if connection:return read(connection)
 with db() as c:return read(c)

def save_draft(id,payload,expected):
 timestamp=now();raw=json.dumps(payload,ensure_ascii=False)
 with db() as c:
  row=c.execute('UPDATE drafts SET payload=?,revision=revision+1,updated_at=? WHERE id=? AND revision=?',(raw,timestamp,id,expected))
  if row.rowcount!=1:raise RevisionConflict('The draft has changed. Reload before saving.')
  c.execute('INSERT INTO revisions VALUES (?,?,?,?)',(id,expected+1,raw,timestamp))
 return get_draft(id)

def list_drafts():
 with db() as c:return [{'id':r['id'],'revision':r['revision'],'updated_at':r['updated_at'],**json.loads(r['payload'])} for r in c.execute('SELECT * FROM drafts ORDER BY updated_at DESC')]

def _ensure_corpus_cache():
 global _cache_db,_regs_cache,_arts_cache
 path=_cache_key()
 if _cache_db==path and _regs_cache is not None and _arts_cache is not None:return
 with db() as c:
  regs=sorted([json.loads(r['payload']) for r in c.execute('SELECT payload FROM regulations ORDER BY id')],key=lambda d:(0 if d['quality']['article_count']>0 else 1,d['metadata']['hierarchy_rank'] if d['metadata']['hierarchy_rank'] is not None else 99,d['id']))
  reg_map={d['id']:d for d in regs}
  arts={}
  for r in c.execute('SELECT id,payload,regulation_id FROM articles ORDER BY id'):
   d=reg_map[r['regulation_id']]
   arts[r['id']]={**json.loads(r['payload']),'regulation_id':d['id'],'regulation_label':f"{d['metadata']['type']} {d['metadata']['number']}/{d['metadata']['year']}",'regulation_type':d['metadata']['type'],'hierarchy_rank':d['metadata']['hierarchy_rank'],'version_kind':d['metadata']['version_kind'],'promulgated_on':d['metadata']['promulgated_on']}
 _cache_db=path;_regs_cache=regs;_arts_cache=arts

def regulations():
 _ensure_corpus_cache()
 return _regs_cache

def article(id):
 _ensure_corpus_cache()
 if id not in _arts_cache:raise KeyError('Article not found')
 return dict(_arts_cache[id])

def add_run(draft,kind,payload):
 id=uuid.uuid4().hex
 with db() as c:c.execute('INSERT INTO runs(id,draft_id,revision,kind,payload,created_at) VALUES (?,?,?,?,?,?)',(id,draft['id'],draft['revision'],kind,json.dumps(payload,ensure_ascii=False),now()))
 return get_run(id)

def get_run(id):
 with db() as c:
  r=c.execute('SELECT * FROM runs WHERE id=?',(id,)).fetchone()
  if not r:raise KeyError('Analysis not found')
  return {**dict(r),'payload':json.loads(r['payload'])}

def runs(draft_id):
 with db() as c:return [{**dict(r),'payload':json.loads(r['payload'])} for r in c.execute('SELECT * FROM runs WHERE draft_id=? ORDER BY created_at DESC',(draft_id,))]

def review_run(id,status,notes):
 get_run(id)
 with db() as c:c.execute('UPDATE runs SET review_status=?,review_notes=? WHERE id=?',(status,notes,id))
 return get_run(id)

def history(id):
 get_draft(id)
 with db() as c:return [dict(r)|{'payload':json.loads(r['payload'])} for r in c.execute('SELECT * FROM revisions WHERE draft_id=? ORDER BY revision DESC',(id,))]
