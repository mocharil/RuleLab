FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY requirements.lock .
RUN pip install --no-cache-dir -r requirements.lock
COPY app ./app
COPY scripts ./scripts
COPY docs ./docs
# Only the legal rulebook ships in the image. The corpus lives in Cloud SQL and the original documents in
# Cloud Storage (RULELAB_SOURCES_BUCKET); locally, mount or copy a data/ folder and leave DATABASE_URL empty.
COPY data/legal ./data/legal
ENV RULELAB_DB=/app/var/rulelab.sqlite3
RUN useradd --create-home rulelab && mkdir -p /app/var && chown -R rulelab:rulelab /app
USER rulelab
EXPOSE 8080
CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
