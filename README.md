# RuleLab

**Draft. Verify. Test impact. Before it's signed.**

RuleLab is an AI workspace, built on Google Gemini, for drafting Indonesian regulations that are grounded in official law and tested on people before enactment. Team **RuleLab** · AI Builder Cup 2026.

> Indonesian version of the previous README: [README.id.md](README.id.md)

## The problem

Indonesian regulations are drafted against thousands of overlapping laws and checked by hand for weeks. Generic AI chatbots invent legal articles that do not exist. And the real impact on citizens (the elderly, people with disabilities, remote villages) only shows up after a rule is signed.

## What RuleLab does

| Stage | What happens | Gen AI |
| --- | --- | --- |
| **1. Draft** | Choose one of 15 official regulation forms or describe a policy in plain language; RuleLab builds a draft in the official legal structure (opening, considerations, legal basis, chapters/articles, closing). Every save is an immutable version. | Gemini turns a policy brief into a structured draft grounded in retrieved laws. |
| **2. Verify sources** | Specialist agents check every article against the corpus with hybrid retrieval. Each finding shows the draft text, a proposed fix, counter-arguments, review questions and the exact source article with page and SHA-256 fingerprint. A reviewer applies a fix as a new version. | Gemini analysis under a JSON schema; a citation guard drops any finding whose quotes or source IDs cannot be verified against the source text. |
| **3. Test impact** | A deterministic A/B model projects who is served, who is left out, cost and staff workload (±10 pt sensitivity). A synthetic public forum of 8–32 AI personas debates both drafts over 2–5 rounds, clustered by issue. A MiroFish/OASIS-inspired crowd layer then spawns 0–500 rule-based agents on a follow network to show how opinions spread (influencers, communities, echo chambers). | Gemini plays each persona and extracts the stakeholder knowledge graph; replies must reference earlier comments and verified evidence. Crowd agents use transparent diffusion rules (no extra AI calls). |

Around the studio: a **Legal library** with a source-cited learning assistant, a **Data dashboard** with a 38-province map and a JDIH/upload intake queue, an **Activity** log of results, reviews and agent runs, and **DOCX export** of the draft and the review report.

## Architecture

```
JDIH / official PDF & HTML ─► scraper (SHA-256, de-dup) ─► extraction (PyMuPDF/HTML)
   ─► enrichment with Gemini (Vertex AI, JSON schema) ─► SQLite (FTS5 BM25)  +  Elasticsearch (BM25 + 768-d gemini-embedding-001)
        │
        ▼
Hybrid retrieval (RRF) ─► evidence expander (neighbours, Article 1 definitions, versions) ─► evidence pack (IDs, pages, SHA-256)
        │                                                         + legal rulebook (28 drafting & conflict rules)
        ▼
FastAPI backend ─ Gemini on Vertex AI (service account / ADC, JSON schema, retries, bounded concurrency)
   ├─ agent orchestrator: coordinator → research → legal reviewer → impact analyst → public forum → quality reviewer
   ├─ citation guard · deterministic A/B simulation · library assistant · DOCX export
   └─ SQLite state: drafts & immutable versions (optimistic locking), analysis runs, agent jobs/events, audit log
        │
        ▼
Web app ─ React 19 islands · TypeScript · Tailwind 4 · Radix UI · Motion · D3 network · 38-province map
```

Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Run locally

Requirements: Python 3.11+ (3.12 recommended).

```bash
# macOS / Linux
./start.sh --sa "/path/to/service-account.json"     # live Gemini on Vertex AI
./start.sh --demo                                   # local demo, no LLM calls

# Windows
start.bat "C:\path\to\service-account.json"
```

Open http://127.0.0.1:8000/workspace, then **Integration settings → Test Gemini connection**. Configuration lives in `.env` (see `.env.example`); explicitly set `RULELAB_*` variables always take precedence over `.env`.

Live mode settings:

```dotenv
AI_PROVIDER=vertex
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json   # or ADC
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=global
GEMINI_MODEL=gemini-3.8-flash
SEARCH_BACKEND=sqlite            # or elasticsearch
```

## Deploy to Google Cloud Run

See [docs/DEPLOY_CLOUD_RUN.md](docs/DEPLOY_CLOUD_RUN.md). The image builds the SQLite corpus at build time and uses the Cloud Run service account through Application Default Credentials; `--no-cpu-throttling` keeps background agent runs alive.

## Tests

```bash
python -m pytest -q tests                  # backend
npm --prefix frontend test                 # React components
npm run test:dom                           # DOM interaction checks
npm run test:studio                        # browser journeys (also: test:activity, test:library, test:collection, test:demo, test:forms-network)
```

Browser journeys run against a temporary demo database. `scripts/verify_live.py --full` runs a paid end-to-end check against Gemini.

## Documentation

- [User guide](docs/USER_GUIDE.md) (also served at `/guide`)
- [Architecture](docs/ARCHITECTURE.md) · [Deploy to Cloud Run](docs/DEPLOY_CLOUD_RUN.md) · [Service account setup](docs/SA_SETUP.md)
- [Public forum simulation](docs/SOCIAL_SIMULATION.md) · [Data dashboard](docs/DATA_DASHBOARD.md) · [Legal guide](docs/LEGAL_GUIDE.md)

## Limits

RuleLab supports review; it does not certify legal validity. Source texts are snapshots, not consolidated law in force, and amendments or court rulings may not be reflected. The A/B numbers come from user assumptions, and persona opinions are synthetic explorations, not a survey or a substitute for public consultation.

## License notes

Icons: Lucide (ISC). Province geometry: Badan Informasi Geospasial. Legal texts: official Indonesian government sources (JDIH / peraturan.go.id).
