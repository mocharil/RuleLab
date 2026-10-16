import os,sys,uuid
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from app.config import settings
from app.main import app
from app import store

PG_URL=os.getenv('RULELAB_TEST_DATABASE_URL')

def _reset_pool():
 if store._pool is not None:
  store._pool.close();store._pool=None

@pytest.fixture(scope='session')
def pg_base_corpus():
 """PostgreSQL mode: ingest the corpus once into the test database's public schema."""
 if not PG_URL:return None
 settings.database_url=PG_URL;_reset_pool()
 store.initialize()
 _reset_pool();settings.database_url=''
 return PG_URL

@pytest.fixture
def client(tmp_path,monkeypatch,pg_base_corpus):
 monkeypatch.setattr(settings,'db_path',tmp_path/'test.sqlite3')
 monkeypatch.setattr(settings,'provider','demo')
 monkeypatch.setattr(settings,'search_backend','sqlite')
 monkeypatch.setattr(settings,'api_token','')
 schema=None
 if PG_URL:  # run the suite against PostgreSQL: each test gets a private schema holding a copy of the corpus
  schema='t_'+uuid.uuid4().hex[:10]
  monkeypatch.setattr(settings,'database_url',PG_URL);_reset_pool()
  with store.db() as c:
   c.execute(f'CREATE SCHEMA {schema}')
   for table in ('regulations','articles','article_search','metadata'):c.execute(f'CREATE TABLE {schema}.{table} AS TABLE public.{table}')
  _reset_pool()
  monkeypatch.setattr(settings,'database_url',PG_URL+f' options=-csearch_path={schema}')
  monkeypatch.setattr(store,'_corpus_bytes',lambda local_only:None)  # corpus already copied; never re-ingest per test
 with TestClient(app) as client:yield client
 if schema:
  _reset_pool();settings.database_url=PG_URL
  with store.db() as c:c.execute(f'DROP SCHEMA {schema} CASCADE')
  _reset_pool()
