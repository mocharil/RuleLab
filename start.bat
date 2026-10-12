@echo off
cd /d "%~dp0"
if not exist .venv (py -3 -m venv .venv)
if errorlevel 1 exit /b 1
.venv\Scripts\python -m pip install -r requirements.lock
if errorlevel 1 exit /b 1
if not "%~1"=="" (
 .venv\Scripts\python scripts\setup_vertex.py --credentials "%~1"
 if errorlevel 1 exit /b 1
 set AI_PROVIDER=
 set GOOGLE_APPLICATION_CREDENTIALS=
 set GOOGLE_CLOUD_PROJECT=
 set GOOGLE_CLOUD_LOCATION=
 set GEMINI_MODEL=
) else (
 if not exist .env (
  if exist credentials\service-account.json (
   .venv\Scripts\python scripts\setup_vertex.py --credentials credentials\service-account.json
   if errorlevel 1 exit /b 1
  ) else (copy .env.example .env > nul)
 )
)
.venv\Scripts\python scripts\doctor.py
if errorlevel 1 exit /b 1
echo RuleLab: http://127.0.0.1:8000/workspace
.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
