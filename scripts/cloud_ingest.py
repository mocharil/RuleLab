"""Load the corpus and source-document checksums into the database (Cloud SQL or SQLite).

Run as a Cloud Run job (same image, VPC and service account as the service) after uploading new documents:

    python scripts/cloud_ingest.py            # corpus.json -> regulations/articles/search index, then hash the sources
    python scripts/cloud_ingest.py --no-hash  # skip hashing the original documents

The corpus is read from data/corpus.json when present, otherwise from gs://$RULELAB_SOURCES_BUCKET/data/corpus.json.
"""
import hashlib,sys,time
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from app import store
from app.config import settings
from app.services import sources

def main():
 started=time.time()
 store.initialize()
 content=store._corpus_bytes(False)
 if not content:raise SystemExit('No corpus.json found (local data/ or the sources bucket).')
 sha=hashlib.sha256(content).hexdigest()
 if store.corpus_sha()==sha:print('Corpus already ingested:',sha[:12])
 else:
  with store.db() as c:
   if store.is_postgres():c.execute('SELECT pg_advisory_xact_lock(7002)')
   store.ingest_corpus(c,content)
  print('Corpus ingested:',sha[:12],f'({time.time()-started:.0f}s)')
 if '--no-hash' not in sys.argv:
  print('Hashed new/changed source documents:',sources.sync_checksums())
 store.initialize()
 print(len(store.regulations()),'regulations ·',sum(len(d['articles']) for d in store.regulations()),'articles',f'· {time.time()-started:.0f}s')

if __name__=='__main__':main()
