# Deploying RuleLab to Google Cloud (production layout)

```
Browser ──► Cloud Run  (FastAPI + React UI, Gemini via Vertex AI, service account rulelab-run)
              ├─► Cloud SQL for PostgreSQL 16 ── drafts, revisions, runs, agent jobs/events, audit log,
              │                                  regulations/articles + full-text index, source checksums
              ├─► Cloud Storage bucket ───────── original PDF/HTML documents, corpus.json, data lake
              └─► Elasticsearch 8 (GCE VM, private IP, HTTPS) ── BM25 + 768-d vector hybrid retrieval
```

| Component | Resource | Notes |
| --- | --- | --- |
| Application | Cloud Run service `rulelab`, `asia-southeast2` | 2 vCPU / 4 GiB, always-on CPU, 1 instance |
| Database | Cloud SQL `rulelab-db` (PostgreSQL 16, db-custom-1-3840, 20 GB SSD, daily backups) | database `rulelab`, user `rulelab_app`; Cloud Run connects through the built-in Unix socket (no public access needed) |
| Documents | Bucket `<project>-rulelab-data` | `data/raw/*` originals, `data/corpus.json`, `data/extracted`, `data/enriched` |
| Search | VM `rulelab-es` (e2-standard-2, 60 GB), fixed internal IP `10.184.0.2` | HTTPS with a private CA, `elastic` user; reachable only inside the VPC |
| Secrets | Secret Manager | `rulelab-db-password`, `rulelab-es-password`, `rulelab-es-ca` |

The container image contains only code and `data/legal/` (the rulebook). The corpus and the documents are never baked into the image.

## 1. How the app chooses its backends

| Setting | Effect |
| --- | --- |
| `DATABASE_URL` (+ `DATABASE_PASSWORD`) | PostgreSQL. Empty → local SQLite file (`RULELAB_DB`), used for development and the test suite. |
| `RULELAB_SOURCES_BUCKET` (+ `RULELAB_SOURCES_PREFIX`, default `data/`) | Original documents and `corpus.json` are read from Cloud Storage with the service account. Empty → local `data/` folder. |
| `RULELAB_LLM_CREDENTIALS` | Optional service-account JSON used only for Gemini and embeddings, for example a key from another project mounted from Secret Manager (`--set-secrets /etc/rulelab-sa/gemini_sa.json=<secret>:latest`). With `GOOGLE_CLOUD_PROJECT` unset, the project comes from that file. Cloud Storage and the rest keep using the Cloud Run service account; do not set `GOOGLE_APPLICATION_CREDENTIALS` for this, because it would also redirect Storage. The key's project needs the Vertex AI API enabled and `roles/aiplatform.user`. |
| `SEARCH_BACKEND=elasticsearch` + `ELASTICSEARCH_*` | Hybrid BM25 + vector retrieval. `sqlite` (the default value, also used with PostgreSQL) → built-in full-text search (FTS5 / PostgreSQL `tsvector`). |

## 2. One-time setup (already applied to this project)

```bash
PROJECT=project-69afeb6a-03b9-46b5-b9d; REGION=asia-southeast2
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com \
  aiplatform.googleapis.com sqladmin.googleapis.com compute.googleapis.com secretmanager.googleapis.com storage.googleapis.com

# runtime identity
gcloud iam service-accounts create rulelab-run --display-name "RuleLab Cloud Run"
gcloud projects add-iam-policy-binding $PROJECT --member serviceAccount:rulelab-run@$PROJECT.iam.gserviceaccount.com --role roles/aiplatform.user

# build permissions for `--source` deploys on a new project
N=$(gcloud projects describe $PROJECT --format='value(projectNumber)')
for r in roles/cloudbuild.builds.builder roles/storage.objectViewer roles/artifactregistry.writer roles/logging.logWriter; do
  gcloud projects add-iam-policy-binding $PROJECT --member serviceAccount:$N-compute@developer.gserviceaccount.com --role $r; done

# documents
gcloud storage buckets create gs://$PROJECT-rulelab-data --location $REGION --uniform-bucket-level-access
gcloud storage buckets add-iam-policy-binding gs://$PROJECT-rulelab-data --member serviceAccount:rulelab-run@$PROJECT.iam.gserviceaccount.com --role roles/storage.objectAdmin
gcloud storage rsync data gs://$PROJECT-rulelab-data/data --recursive --exclude=".*\.sqlite3.*"

# database
gcloud sql instances create rulelab-db --database-version POSTGRES_16 --edition ENTERPRISE --tier db-custom-1-3840 \
  --region $REGION --storage-size 20GB --storage-auto-increase --backup-start-time 18:00
gcloud sql databases create rulelab --instance rulelab-db
gcloud sql users create rulelab_app --instance rulelab-db --password "$(gcloud secrets versions access latest --secret rulelab-db-password)"

# Elasticsearch VM with a fixed internal IP; its startup script creates a private CA + server certificate
# (SAN = the internal IP), runs Elasticsearch 8 with TLS and a generated password, and publishes the CA to Secret Manager.
gcloud compute addresses create rulelab-es-ip --region $REGION --subnet default
gcloud compute instances create rulelab-es --zone ${REGION}-a --machine-type e2-standard-2 --image-family ubuntu-2204-lts \
  --image-project ubuntu-os-cloud --boot-disk-size 60GB --private-network-ip rulelab-es-ip --subnet default \
  --scopes cloud-platform --metadata-from-file startup-script=deploy/es-startup.sh
```

The startup script is kept in `deploy/es-startup.sh`. The three secrets must exist before the VM boots (`rulelab-es-password` with the password, `rulelab-es-ca` empty, both writable by the VM's service account for the CA).

## 3. Deploy the service

```bash
CONN=$PROJECT:$REGION:rulelab-db
gcloud run deploy rulelab --source . --region $REGION \
  --service-account rulelab-run@$PROJECT.iam.gserviceaccount.com \
  --memory 4Gi --cpu 2 --cpu-boost --no-cpu-throttling --min-instances 1 --max-instances 1 --timeout 900 \
  --add-cloudsql-instances $CONN \
  --network default --subnet default --vpc-egress private-ranges-only \
  --set-secrets "DATABASE_PASSWORD=rulelab-db-password:latest,ELASTICSEARCH_PASSWORD=rulelab-es-password:latest,/etc/rulelab/es-ca.crt=rulelab-es-ca:latest" \
  --set-env-vars "^@^AI_PROVIDER=vertex@GEMINI_MODEL=gemini-3.8-flash@GOOGLE_CLOUD_PROJECT=$PROJECT@GOOGLE_CLOUD_LOCATION=global@SEARCH_BACKEND=elasticsearch@DATABASE_URL=host=/cloudsql/$CONN dbname=rulelab user=rulelab_app@RULELAB_SOURCES_BUCKET=$PROJECT-rulelab-data@ELASTICSEARCH_URL=https://10.184.0.2:9200@ELASTICSEARCH_USERNAME=elastic@ELASTICSEARCH_INDEX=rulelab-clauses@ELASTICSEARCH_CA_CERT=/etc/rulelab/es-ca.crt@EMBEDDING_LOCATION=us-central1@RULELAB_AI_TIMEOUT=120@RULELAB_AGENT_STEP_TIMEOUT=600@RULELAB_AI_CONCURRENCY=6"
```

Add `--allow-unauthenticated` only when the app should be public (see "Access" below). Keep `--max-instances 1`: agent jobs run inside the instance and a starting instance marks unfinished jobs as interrupted.

## 4. Load data and build the search index

Both steps run as a Cloud Run **job** that uses the same image, VPC, Cloud SQL connection and service account:

```bash
IMAGE=$(gcloud run services describe rulelab --region $REGION --format 'value(spec.template.spec.containers[0].image)')
gcloud run jobs deploy rulelab-ops --image $IMAGE --region $REGION --service-account rulelab-run@$PROJECT.iam.gserviceaccount.com \
  --command python --memory 4Gi --cpu 2 --task-timeout 3600 --max-retries 0 --add-cloudsql-instances $CONN \
  --network default --subnet default --vpc-egress private-ranges-only \
  --set-secrets "..same as the service.." --set-env-vars "..same as the service.."

gcloud run jobs execute rulelab-ops --region $REGION --wait --args=scripts/cloud_ingest.py        # corpus -> Cloud SQL, hash documents
gcloud run jobs execute rulelab-ops --region $REGION --wait --args=scripts/index_elasticsearch.py  # embeddings -> Elasticsearch
```

(`--command python` is set on the job; `--args` replaces the script.) `index_elasticsearch.py` is incremental: unchanged articles are not embedded again, removed ones are deleted, so re-running after a new scraping batch is cheap.

**After adding documents:** `gcloud storage rsync data gs://$PROJECT-rulelab-data/data --recursive --exclude=".*\.sqlite3.*"`, run the two jobs, then restart the service (`gcloud run services update rulelab --region $REGION --update-env-vars RESTARTED=$(date +%s)`) so it reloads the corpus cache.

## 5. Verify

```bash
URL=$(gcloud run services describe rulelab --region $REGION --format 'value(status.url)')
TOKEN=$(gcloud auth print-identity-token)          # private service
curl -s -H "Authorization: Bearer $TOKEN" $URL/api/health
curl -s -H "Authorization: Bearer $TOKEN" $URL/api/readiness
```

Then open `/workspace` → **Integration settings → Test Gemini connection**, and run Draft → Verify sources → Test impact.

## 6. Operations

- **Backups:** Cloud SQL automated daily backups (restore from the console or `gcloud sql backups restore`). The bucket holds the data lake; enable object versioning for extra safety.
- **Access:** `RULELAB_DEPLOYMENT_MODE=development` (default) has no login and gives every visitor full access, which suits a public judging demo with disposable data. For restricted use set `RULELAB_DEPLOYMENT_MODE=production`, `RULELAB_ACCESS_KEYS` and `RULELAB_ALLOWED_ORIGINS=https://<your-run-url>`, or keep the service private and put IAP in front.
- **Costs (approximate, USD/month):** Cloud Run always-on 2 vCPU/4 GiB ≈ 60–90, Cloud SQL ≈ 50–60, Elasticsearch VM + disk ≈ 60–70, storage ≈ 5, Gemini/Vertex usage per call.
- **Scaling the corpus:** the application caches the corpus in memory. Around 12,000 regulations the cache needs well over 4 GiB; raise `--memory` (8–16 GiB) before ingesting that much.
- **Local development** needs none of this: leave `DATABASE_URL`, `RULELAB_SOURCES_BUCKET` and `SEARCH_BACKEND` unset and the app uses `data/` plus a SQLite file. Set `RULELAB_TEST_DATABASE_URL` to run the test suite against PostgreSQL.
