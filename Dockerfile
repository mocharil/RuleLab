FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY requirements.lock .
RUN pip install --no-cache-dir -r requirements.lock
COPY app ./app
COPY data ./data
COPY scripts ./scripts
COPY docs ./docs
ENV RULELAB_DB=/app/var/rulelab.sqlite3
# Build the SQLite corpus (regulations, articles, FTS index) at image build time,
# so Cloud Run cold starts do not re-ingest the whole corpus.
RUN useradd --create-home rulelab && mkdir -p /app/var \
 && AI_PROVIDER=demo python -c "from app import store; store.initialize()" \
 && chown -R rulelab:rulelab /app
USER rulelab
EXPOSE 8080
CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
