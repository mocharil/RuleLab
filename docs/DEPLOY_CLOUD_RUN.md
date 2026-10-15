# Deploying RuleLab to Google Cloud Run

This guide deploys the workspace as one Cloud Run service that uses Gemini on Vertex AI through the service's own identity (no key file in the image).

## 1. One-time project setup

```bash
PROJECT=your-project-id
REGION=asia-southeast2          # Jakarta; any Cloud Run region works
gcloud config set project $PROJECT

gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
  artifactregistry.googleapis.com aiplatform.googleapis.com

# Runtime identity for the service, allowed to call Vertex AI
gcloud iam service-accounts create rulelab-run --display-name "RuleLab Cloud Run"
gcloud projects add-iam-policy-binding $PROJECT \
  --member "serviceAccount:rulelab-run@$PROJECT.iam.gserviceaccount.com" \
  --role roles/aiplatform.user
```

Check that the Gemini model you plan to use (`GEMINI_MODEL`) is available in your project for `GOOGLE_CLOUD_LOCATION` (the app defaults to `global`).

## 2. Deploy

Run from the repository root. The `Dockerfile` builds the SQLite corpus from `data/corpus.json` during the image build, so redeploy after the JDIH scraping run finishes to ship the full collection.

```bash
gcloud run deploy rulelab \
  --source . \
  --region $REGION \
  --service-account rulelab-run@$PROJECT.iam.gserviceaccount.com \
  --allow-unauthenticated \
  --memory 4Gi --cpu 2 \
  --no-cpu-throttling \
  --min-instances 1 --max-instances 1 \
  --timeout 900 \
  --set-env-vars AI_PROVIDER=vertex,GEMINI_MODEL=gemini-3.8-flash,GOOGLE_CLOUD_PROJECT=$PROJECT,GOOGLE_CLOUD_LOCATION=global,SEARCH_BACKEND=sqlite,RULELAB_AI_TIMEOUT=120,RULELAB_AGENT_STEP_TIMEOUT=600,RULELAB_AI_CONCURRENCY=6
```

Why these flags:

| Flag | Reason |
| --- | --- |
| `--no-cpu-throttling` | Agent runs (legal review, public forum) continue in the background after the HTTP request returns. With default CPU throttling they would stall. |
| `--min-instances 1` | No cold start while judges open the app. |
| `--max-instances 1` | Drafts, results and agent jobs live in the instance's SQLite file; one instance keeps them consistent. |
| `--memory 4Gi` | The corpus and its article cache are held in memory; raise it if the collection grows far beyond 12,000 regulations. |
| `--timeout 900` | Long live analyses and DOCX exports finish within one request. |

Do not upload or set `GOOGLE_APPLICATION_CREDENTIALS`: on Cloud Run the attached service account is used through Application Default Credentials. `.gcloudignore` keeps `.env`, `gemini_sa.json`, the video and screenshots out of the upload.

## 3. Verify

```bash
URL=$(gcloud run services describe rulelab --region $REGION --format 'value(status.url)')
curl -s $URL/api/health
curl -s $URL/api/status | head -c 300
```

Then open `$URL/workspace`, go to **Integration settings → Test Gemini connection**, and run one draft through Draft → Verify sources → Test impact.

## 4. Notes and limits

- **Storage is per instance and not durable.** New revisions or instance restarts reset user drafts to the seeded sample; the legal corpus is rebuilt from the image. This is fine for a demo. For durable multi-user storage, move `app/store.py` to Cloud SQL (PostgreSQL) as described in `docs/ARCHITECTURE.md`; do not put the SQLite file on a Cloud Storage FUSE mount.
- **Access.** `RULELAB_DEPLOYMENT_MODE=development` (the default) needs no login and gives every visitor full access, which suits a public judging demo. For a restricted deployment set `RULELAB_DEPLOYMENT_MODE=production`, `RULELAB_ACCESS_KEYS` (named keys with an admin) and `RULELAB_ALLOWED_ORIGINS=https://<your-run-url>`.
- **Cost.** Cloud Run with one always-on instance is roughly $15–35/month at this size; Gemini calls are billed per use by Vertex AI.
- **Elasticsearch** is optional. To use hybrid BM25 + vector search, point `SEARCH_BACKEND=elasticsearch` and `ELASTICSEARCH_*` at a managed cluster and run `scripts/index_elasticsearch.py` against it.
