import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from app.config import settings
from app.main import app

@pytest.fixture
def client(tmp_path,monkeypatch):
 monkeypatch.setattr(settings,'db_path',tmp_path/'test.sqlite3')
 monkeypatch.setattr(settings,'provider','demo')
 monkeypatch.setattr(settings,'search_backend','sqlite')
 monkeypatch.setattr(settings,'api_token','')
 with TestClient(app) as client:yield client
