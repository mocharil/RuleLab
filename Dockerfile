FROM python:3.12-slim
WORKDIR /app
COPY requirements.lock .
RUN pip install --no-cache-dir -r requirements.lock
COPY app ./app
COPY data ./data
COPY scripts ./scripts
RUN useradd --create-home rulelab && mkdir -p /app/var && chown -R rulelab:rulelab /app
USER rulelab
ENV RULELAB_DB=/app/var/rulelab.sqlite3
EXPOSE 8080
CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
