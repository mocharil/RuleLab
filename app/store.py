"""SQLite canonical snapshots and immutable revisions. FTS is the offline retrieval backend."""
from __future__ import annotations
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
import hashlib,json,sqlite3,uuid
from app.config import ROOT,settings

class RevisionConflict(Exception):pass

def now():return datetime.now(timezone.utc).isoformat()

def connect():
 c=sqlite3.connect(settings.db_path,timeout=15)
 c.row_factory=sqlite3.Row;c.execute('PRAGMA foreign_keys=ON');c.execute('PRAGMA busy_timeout=15000')
 return c
@contextmanager
def db():
 c=connect()
 try:
  yield c
  c.commit()
 except Exception:
  c.rollback()
  raise
 finally:
  c.close()

def initialize():
 settings.db_path.parent.mkdir(parents=True,exist_ok=True)
 with db() as c:
  c.executescript('''
  PRAGMA journal_mode=WAL;
  CREATE TABLE IF NOT EXISTS regulations(id TEXT PRIMARY KEY,payload TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS articles(id TEXT PRIMARY KEY,regulation_id TEXT NOT NULL,payload TEXT NOT NULL);
  CREATE VIRTUAL TABLE IF NOT EXISTS article_search USING fts5(id UNINDEXED,text,topics,title,tokenize='unicode61');
  CREATE TABLE IF NOT EXISTS drafts(id TEXT PRIMARY KEY,revision INTEGER NOT NULL,payload TEXT NOT NULL,updated_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS revisions(draft_id TEXT,revision INTEGER,payload TEXT NOT NULL,created_at TEXT NOT NULL,PRIMARY KEY(draft_id,revision));
  CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY,draft_id TEXT,revision INTEGER,kind TEXT,payload TEXT,created_at TEXT,review_status TEXT DEFAULT 'needs_review',review_notes TEXT DEFAULT '');
  CREATE TABLE IF NOT EXISTS metadata(key TEXT PRIMARY KEY,value TEXT NOT NULL);
  ''')
  corpus=ROOT/'data/corpus.json'
  if corpus.exists():
   content=corpus.read_bytes();fingerprint=hashlib.sha256(content).hexdigest()
   old=c.execute("SELECT value FROM metadata WHERE key='corpus_sha'").fetchone()
   if not old or old['value']!=fingerprint:
    c.execute('DELETE FROM regulations');c.execute('DELETE FROM articles');c.execute('DELETE FROM article_search')
    for doc in json.loads(content)['documents']:
     c.execute('INSERT INTO regulations VALUES (?,?)',(doc['id'],json.dumps(doc,ensure_ascii=False)))
     for a in doc['articles']:
      c.execute('INSERT INTO articles VALUES (?,?,?)',(a['id'],doc['id'],json.dumps(a,ensure_ascii=False)))
      c.execute('INSERT INTO article_search VALUES (?,?,?,?)',(a['id'],a['text'],' '.join(a['enrichment']['topics']),doc['metadata']['title']))
    c.execute("INSERT OR REPLACE INTO metadata VALUES ('corpus_sha',?)",(fingerprint,))
  if not c.execute('SELECT id FROM drafts LIMIT 1').fetchone():
   create_draft({'title':'Layanan Publik Digital yang Inklusif','regulation_type':'PP','scope':'Layanan permohonan administrasi publik','preamble':'Rancangan simulasi untuk pengujian RuleLab. Belum merupakan naskah resmi.',
    'articles':[{'number':'1','text':'Dalam rancangan ini, layanan digital adalah layanan permohonan administrasi melalui aplikasi elektronik.'},
     {'number':'2','text':'(1) Permohonan hanya dapat diajukan melalui aplikasi digital.\n(2) Pemohon yang tidak memiliki akses internet tidak dapat mengajukan permohonan.'},
     {'number':'3','text':'Pengaduan masyarakat tidak perlu ditanggapi oleh penyelenggara.'},
     {'number':'4','text':'Peraturan ini berlaku sejak ditetapkan tanpa masa transisi.'}]},connection=c)

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
  if not r:raise KeyError('Rancangan tidak ditemukan')
  return {'id':r['id'],'revision':r['revision'],'updated_at':r['updated_at'],**json.loads(r['payload'])}
 if connection:return read(connection)
 with db() as c:return read(c)

def save_draft(id,payload,expected):
 timestamp=now();raw=json.dumps(payload,ensure_ascii=False)
 with db() as c:
  row=c.execute('UPDATE drafts SET payload=?,revision=revision+1,updated_at=? WHERE id=? AND revision=?',(raw,timestamp,id,expected))
  if row.rowcount!=1:raise RevisionConflict('Draft sudah berubah. Muat ulang sebelum menyimpan.')
  c.execute('INSERT INTO revisions VALUES (?,?,?,?)',(id,expected+1,raw,timestamp))
 return get_draft(id)

def list_drafts():
 with db() as c:return [{'id':r['id'],'revision':r['revision'],'updated_at':r['updated_at'],**json.loads(r['payload'])} for r in c.execute('SELECT * FROM drafts ORDER BY updated_at DESC')]

def regulations():
 with db() as c:return [json.loads(r['payload']) for r in c.execute('SELECT payload FROM regulations ORDER BY id')]

def article(id):
 with db() as c:
  r=c.execute('SELECT payload,regulation_id FROM articles WHERE id=?',(id,)).fetchone()
  if not r:raise KeyError('Pasal tidak ditemukan')
  d=json.loads(c.execute('SELECT payload FROM regulations WHERE id=?',(r['regulation_id'],)).fetchone()['payload'])
  return {**json.loads(r['payload']),'regulation_id':d['id'],'regulation_label':f"{d['metadata']['type']} {d['metadata']['number']}/{d['metadata']['year']}",'regulation_type':d['metadata']['type'],'hierarchy_rank':d['metadata']['hierarchy_rank'],'version_kind':d['metadata']['version_kind'],'promulgated_on':d['metadata']['promulgated_on']}

def add_run(draft,kind,payload):
 id=uuid.uuid4().hex
 with db() as c:c.execute('INSERT INTO runs(id,draft_id,revision,kind,payload,created_at) VALUES (?,?,?,?,?,?)',(id,draft['id'],draft['revision'],kind,json.dumps(payload,ensure_ascii=False),now()))
 return get_run(id)

def get_run(id):
 with db() as c:
  r=c.execute('SELECT * FROM runs WHERE id=?',(id,)).fetchone()
  if not r:raise KeyError('Analisis tidak ditemukan')
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
