#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
RULELAB_SA_INPUT=""
RULELAB_FORCE_DEMO=0
RULELAB_USE_ELASTIC=0
RULELAB_BIND_PORT=8000
while [ "$#" -gt 0 ]; do
  case "$1" in
    --sa) [ "$#" -ge 2 ] || { echo 'Gunakan --sa /path/service-account.json'; exit 2; }; RULELAB_SA_INPUT="$2"; shift 2 ;;
    --elastic) RULELAB_USE_ELASTIC=1; shift ;;
    --demo) RULELAB_FORCE_DEMO=1; shift ;;
    --port) [ "$#" -ge 2 ] || { echo 'Gunakan --port 8000'; exit 2; }; RULELAB_BIND_PORT="$2"; shift 2 ;;
    --help) echo './start.sh [--sa /path/service-account.json] [--demo] [--elastic] [--port 8000]'; exit 0 ;;
    *) echo "Opsi tidak dikenali: $1"; exit 2 ;;
  esac
done
if [ -n "$RULELAB_SA_INPUT" ] && [ "$RULELAB_FORCE_DEMO" -eq 1 ]; then echo 'Pilih --sa atau --demo.'; exit 2; fi
case "$RULELAB_BIND_PORT" in ''|*[!0-9]*) echo 'Port harus berupa angka.'; exit 2;; esac
if [ "$RULELAB_BIND_PORT" -lt 1024 ] || [ "$RULELAB_BIND_PORT" -gt 65535 ]; then echo 'Port harus 1024–65535.'; exit 2; fi
python3 -c 'import sys; assert sys.version_info >= (3, 11), "Gunakan Python 3.11 atau lebih baru (3.12 disarankan)."'
if [ ! -d .venv ]; then python3 -m venv .venv; fi
RULELAB_REQUIREMENTS_HASH="$(.venv/bin/python -c 'import hashlib; print(hashlib.sha256(open("requirements.lock","rb").read()).hexdigest())')"
RULELAB_INSTALLED_HASH="$(cat .venv/.rulelab-dependencies 2>/dev/null || true)"
if [ "$RULELAB_REQUIREMENTS_HASH" != "$RULELAB_INSTALLED_HASH" ]; then
  .venv/bin/python -m pip install -r requirements.lock
  echo "$RULELAB_REQUIREMENTS_HASH" > .venv/.rulelab-dependencies
fi
if [ -n "$RULELAB_SA_INPUT" ]; then
  .venv/bin/python scripts/setup_vertex.py --credentials "$RULELAB_SA_INPUT"
  unset AI_PROVIDER GOOGLE_APPLICATION_CREDENTIALS GOOGLE_CLOUD_PROJECT GOOGLE_CLOUD_LOCATION GEMINI_MODEL
elif [ ! -f .env ] && [ -f credentials/service-account.json ] && [ "$RULELAB_FORCE_DEMO" -eq 0 ]; then
  .venv/bin/python scripts/setup_vertex.py --credentials credentials/service-account.json
elif [ ! -f .env ]; then
  cp .env.example .env
fi
if [ "$RULELAB_FORCE_DEMO" -eq 1 ]; then export AI_PROVIDER=demo; fi
if [ "$RULELAB_USE_ELASTIC" -eq 1 ]; then
  if [ "$RULELAB_FORCE_DEMO" -eq 1 ]; then echo '--elastic memerlukan provider Gemini/Vertex.'; exit 2; fi
  .venv/bin/python -c 'from app.config import settings; assert settings.provider != "demo", "Konfigurasi SA/Gemini sebelum memakai --elastic."; assert settings.elastic_url.rstrip("/") in {"http://localhost:9200","http://127.0.0.1:9200"} and not (settings.elastic_key or settings.elastic_user), "Konfigurasi Elasticsearch kustom sudah ada. Gunakan scripts/index_elasticsearch.py untuk server tersebut."'
  command -v docker >/dev/null || { echo 'Docker diperlukan untuk --elastic. Gunakan tanpa flag ini untuk RAG SQLite.'; exit 2; }
  docker compose --profile elastic up -d elasticsearch
  .venv/bin/python scripts/enable_elasticsearch.py
  unset SEARCH_BACKEND ELASTICSEARCH_URL
fi
.venv/bin/python scripts/doctor.py
# Cloud requests happen only when users run AI features or explicitly test integration.
echo "RuleLab: http://127.0.0.1:$RULELAB_BIND_PORT/workspace"
exec .venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port "$RULELAB_BIND_PORT"
