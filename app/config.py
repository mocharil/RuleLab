from dataclasses import dataclass
from pathlib import Path
import os
from dotenv import load_dotenv
ROOT=Path(__file__).resolve().parents[1]
# .env is authoritative for provider credentials, but explicitly set RULELAB_* variables
# (e.g. RULELAB_DB for an isolated test database) must not be silently replaced by it.
_explicit={k:v for k,v in os.environ.items() if k.startswith('RULELAB_')}
load_dotenv(ROOT/'.env',override=os.getenv('AI_PROVIDER')!='demo')
os.environ.update(_explicit)

@dataclass
class Settings:
 provider: str = os.getenv('AI_PROVIDER','demo')
 model: str = os.getenv('GEMINI_MODEL','gemini-3.8-flash')
 api_key: str = os.getenv('GEMINI_API_KEY','')
 credentials_path: str = os.getenv('GOOGLE_APPLICATION_CREDENTIALS','')
 project: str = os.getenv('GOOGLE_CLOUD_PROJECT','')
 location: str = os.getenv('GOOGLE_CLOUD_LOCATION','global')
 search_backend: str = os.getenv('SEARCH_BACKEND','sqlite')
 elastic_url: str = os.getenv('ELASTICSEARCH_URL','http://localhost:9200')
 elastic_index: str = os.getenv('ELASTICSEARCH_INDEX','rulelab-clauses')
 elastic_key: str = os.getenv('ELASTICSEARCH_API_KEY','')
 elastic_user: str = os.getenv('ELASTICSEARCH_USERNAME','')
 elastic_password: str = os.getenv('ELASTICSEARCH_PASSWORD','')
 elastic_ca: str = os.getenv('ELASTICSEARCH_CA_CERT','')
 embedding_model: str = os.getenv('EMBEDDING_MODEL','gemini-embedding-001')
 embedding_location: str = os.getenv('EMBEDDING_LOCATION','us-central1')
 ai_timeout: int = int(os.getenv('RULELAB_AI_TIMEOUT','90'))
 ai_concurrency: int = int(os.getenv('RULELAB_AI_CONCURRENCY','5'))
 embedding_dimensions: int = int(os.getenv('EMBEDDING_DIMENSIONS','768'))
 db_path: Path = ROOT/os.getenv('RULELAB_DB','data/rulelab.sqlite3')
 api_token: str = os.getenv('RULELAB_API_TOKEN','')
 deployment_mode: str = os.getenv('RULELAB_DEPLOYMENT_MODE','development')
 access_keys: str = os.getenv('RULELAB_ACCESS_KEYS','[]')
 allowed_origins: str = os.getenv('RULELAB_ALLOWED_ORIGINS','')
 max_agent_jobs: int = int(os.getenv('RULELAB_MAX_AGENT_JOBS','4'))
 agent_step_timeout: int = int(os.getenv('RULELAB_AGENT_STEP_TIMEOUT','180'))
settings=Settings()
