# Validation report

## Current version 1.3: TasteSkill refinement

- 104 backend tests passed; no legal/model workflow rewrite.
- 57 DOM integration checks passed with actual entry modules, real demo API and rebuilt production React bundle. Added cases verify the live draft preview is escaped, persistent field errors use aria-invalid/describedby, editing clears the right field error, and landing serves the real source-page asset rather than the handcrafted product preview.
- 11 React component tests passed; production TypeScript/Vite build passed. Bundle: 666.14KB, 165.78KB gzip.
- JavaScript/Python syntax and CSS parsing passed. CSS was formatted for review; retired preview/loader selectors were removed.
- Main contrast tokens passed AA text ratios: body 14.67:1, secondary 6.00:1, primary button 6.49:1, placeholder 4.81:1, field error 7.24:1. This is not a full accessibility assessment.
- The new landing asset is a rendered first page from the bundled original UU 12/2011 PDF. Its text/title were visually inspected as an asset; this is not a browser screenshot.

Browser verification was attempted: default Playwright launch lacked the headless-shell executable; the installed full Chromium also failed startup. No current rendered UI screenshots, responsive overflow, real-browser focus trapping or Lighthouse/Core Web Vitals claims are made. Capture runner targets screenshots/v1.3 for local use. Existing live cloud/Docker/Windows limits remain unchanged.


## Historical version 1.2: educational gallery and source-bound chat

- 104 backend tests passed, including 20 new gallery/guide cases (parameterized): exact legal identity, unavailable documents without model invocation, document scope, explicit article lookup, absent articles, input/history bounds, read-only learning access, no draft mutations, fabricated source/quote rejection, empty answer rejection and no live-to-demo fallback.
- Vertex chat structured output/auth and injection of the shared legal guide were exercised through fake HTTP/OAuth fixtures. The full provider workflow runner now includes source-bound gallery chat and continues to pass against fixtures.
- 53 DOM checks passed with actual entry modules, rebuilt React bundle and demo API. Gallery checks cover search/type filtering, reader/article selection, prompt focus, response/citation context, missing regulation, provider failure preserving input and retry, clear history, escaped questions and preservation across menu navigation. The gallery's contextual guide is included.
- 11 React component tests passed; labelled gallery navigation is included. TypeScript/Vite production build passed.
- CSS parser, JavaScript syntax and Python compilation passed. HTML user guide and downloadable Markdown endpoints passed.

Live Google calls and current visual browser screenshots were not tested. DOM verification does not establish CSS rendering or responsive overflow. The local capture script now targets screenshots/v1.2 and includes all nine menus plus the gallery reader/bot. Historical visual evidence does not represent the current gallery.

Answers are explanations from limited retrieved source excerpts, not certified legal judgments. Verified quotations constrain evidence IDs/text, not semantic correctness. Unknown regulations are reported as unavailable in this corpus, not declared nonexistent. History is session memory; live question/context use follows provider billing.


## Historical version 1.1: SA setup and live adapter readiness

Validated with Python 3.12 on 12 October 2026:

- 84 backend tests passed, including the full Vertex workflow with fake REST/auth fixtures: connection probe, draft generation/import/edit, legal review, comparison, source search, A/B stakeholder simulation, full agent job, 30 social reactions, reviewer notes/history and draft/report DOCX export/import.
- 38 DOM integration checks passed using actual entry modules, production React bundle and temporary FastAPI demo API. Includes safe integration status, explicit demo probe, and field-level validation preserving input and restoring focus.
- 11 React component tests passed. The prebuilt UI bundle from 1.0 remains included; no React source changes in 1.1.
- Python/JavaScript syntax, Bash syntax/help, pinned dependency consistency and pip dependency checks passed.
- Actual macOS/Linux Bash launcher started Uvicorn successfully from a temporary path containing spaces, created configuration, and served readiness/workspace in demo mode. It reused a virtualenv with the existing pinned runtime dependencies; fresh pip download/installation was not repeated.

New contract tests verify offline SA key validation and project inference, preservation of unrelated .env keys, OAuth token caching, Vertex-compatible structured schemas, regional embedding endpoints, long-text embedding chunks, concurrency caps, cancellation of sibling tasks, redacted provider diagnostics, no cloud request during local readiness, admin-only probe, invalidation after credential change, embedding-cache invalidation after text changes, and refusal of stale Elasticsearch index metadata.

Real Google credentials, IAM, billing, model quality/availability, real Elasticsearch, Docker startup and native Windows execution have **not** been tested. The live REST fixture validates code contracts, not cloud access. Use Settings → Uji koneksi Gemini or scripts/doctor.py --live after setup; scripts/verify_live.py --full performs an opt-in billable full workflow in a temporary DB.

Browser rendering and current screenshots remain unverified because Chromium cannot start in this environment. DOM checks do not establish responsive CSS layout or real-browser focus trapping. A local capture script and browser regressions are included. Historical screenshots retain their version labels and are not evidence of the current UI.

The legal/source corpus and pending amendment limitations remain as documented below; no certified current-law consolidation or empirical public-opinion prediction is claimed.


## Historical version 1.0: full UI remake

- TypeScript/Vite production build passed.
- 11 React component tests passed.
- 35 DOM integration checks passed with actual entry modules, production React bundle and a temporary FastAPI demo database.
- 60 backend tests passed.
- Lightning CSS parser and JavaScript/Python syntax checks passed.
- Primary text/accent tokens were checked against white: 4.63–14.98:1 for neutral text, 6.49:1 for the primary button. This is not a complete accessibility audit.

New interaction checks cover focus mode and unchanged unsaved input, live dirty context, saving, backend-sourced persona metadata, search/provenance, comparison, evidence rendering, invalid assumptions, inline simulation snapshotting, stale alternative guards, preserved editor text across assistant tabs, completed demo social jobs, exact comment/source selection, separate A/B transcripts, round filtering, reviewer notes and escaped draft titles in the React dashboard.

Actual browser verification is unavailable: the installed Chromium fails at process-singleton socket startup. No new rendered screenshots or CSS layout claims are made. The alternative browser install could not complete in this environment. `scripts/capture_ui.cjs` and the updated regression browser scripts are supplied for local execution; they have passed syntax checks, not browser execution in this run.

Gemini/Vertex live calls were not tested without credentials. Persona responses used the explicit local demo provider. Legal corpora/rulebook logic were retained.


## Historical version 0.9

- TypeScript and Vite production build passed.
- 9 React component tests passed.
- 17 DOM integration checks passed using the actual entry module, production React bundle and demo API.
- 60 backend tests passed.
- Browser visual validation remains unavailable due to the existing browser startup restriction. No new browser screenshots are claimed.

Component tests cover live-state counts, active jobs, preserved action bindings, accessible sidebar, command navigation/search/empty state, keyboard focus/Escape, and no command overlay above a native workflow dialog. Production dependencies audit reported no advisories; this is not a security assessment of the deployment.

## Historical version 0.8

- 60 backend tests passed.
- 17 DOM interaction checks passed using the actual application modules and FastAPI demo endpoints.
- JavaScript syntax checks and Python compilation passed.
- Browser visual tests were attempted but could not run: the installed Chromium fails during process-singleton socket startup (Operation not permitted). No new visual screenshots are claimed for 0.8.
- scripts/browser_workspace_ux.cjs contains desktop/mobile, reduced-motion and keyboard checks for local execution.

DOM checks cover collapse/expand, storage, accessible icon labels, unchanged draft input, highlighted guide steps, next/previous/close/focus restoration, and completion of guides for all eight menus. DOM checks do not verify CSS rendering, real browser focus trapping, or mobile layout.

# Historical validation: 0.7.1

Validated on 12 October 2026 with Python 3.12, FastAPI, SQLite FTS5 and Chromium 134 through Playwright 1.51.1.

## Passed

- **60 backend/data/adapter/legal/social tests**, all passing.
- **56 browser workflow checks (33 regression + 23 social simulation)**, all passing.
- JavaScript syntax check and Python compilation.
- Visual inspection of actual desktop and mobile UI screenshots.

Backend tests cover a complete draft → analysis → simulation → revision → reanalysis → DOCX flow; immutable revision history; stale and cross-draft revision rejection; optimistic saves; live-provider error without demo fallback; input validation; source provenance and SHA256; extraction sequence and no appendix sample articles in the original UU 12/2011 body; search and side-by-side comparison; DOCX export/import round trip; bearer token/origin checks; Gemini structured output contract; Vertex ADC/SA endpoint authentication contract; rejected invalid/truncated AI output; Elasticsearch BM25/vector rank fusion and filter contracts; simulation boundaries; enabled CSP headers.

Additional legal tests verify rule/source hashes, the actual 2022 partial-ayat instruction, unchanged adjacent ayat, insert/delete numbering, pending/unknown-date/wrong-target/lower-rank rejection, effective-date boundary, duplicate/out-of-order event rejection, no cross-regulation repeal cascade, retrieval of UU 13/2022 Pasal 96 and Pasal II, Article 8 uncertainty, fabricated quotes/rule IDs, incomplete judgment downgrade, source publication timing, provider rulebook injection and date API validation.

Browser checks also cover the legal guide with 35 pending instructions and changing the analysis date to 2000 and back.

Browser checks cover:

1. Edit/save draft.
2. Analyze draft.
3. Expand source text.
4. Apply revision and reject stale results.
5. Reanalyze and compare impact scenarios.
6. Apply simulated alternative after review.
7. Download a valid DOCX.
8. Save human review notes and inspect draft versions.
9. Search official source clauses.
10. Compare two regulatory clauses.
11. Generate a new draft in demo mode.
12. Import a text draft.
13. Escape user-supplied HTML without execution.
14. Mobile layout without page-level horizontal overflow.

Browser automation bypasses CSP only in the test browser because its injected evaluator needs it; the application serves CSP normally, which is checked separately. User content escaping is tested with CSP bypassed so it does not rely solely on CSP to prevent execution.

## Not verified with real external services

- Actual Gemini/Vertex model access, credentials, IAM, quota, response quality and billing.
- A real Elasticsearch node and actual embedding model access.
- Docker startup or Cloud Run deployment.
- Expert legal correctness and complete extraction across every letter/paragraph.
- OCR on scan-only annex pages, particularly UU 13/2022.
- Current-law consolidation, complete amendment/repeal graph, and court decisions.
- Empirical validity of impact scenarios.

Gemini, Vertex and Elasticsearch adapter tests use mocks and validate contracts, not live integration. `scripts/verify_live.py` performs real provider and retrieval checks when credentials and services are configured.

This package is a runnable development MVP with a tested demo flow, not a production certification or a legal validity opinion.


## Version 0.3 design verification

Local Manrope and Cormorant Garamond fonts loaded successfully in Chromium. The primary action resolves to crimson RGB(185, 28, 50). All 17 workflow checks pass with the redesigned UI. Responsive checks cover 360px, 390px, 768px and desktop widths, fixed mobile navigation, active navigation semantics, and page-level horizontal overflow. Desktop and mobile screenshots were inspected.


## Version 0.4 visual and loading verification

The public landing and workspace are separate routes. All five menu SVG illustrations decode successfully. Home navigation exposes its own current-page state; the five menu tabs do not claim to be active on the home screen. Home and landing layouts were checked on mobile and desktop, with home overflow checks at 360, 390 and 768px.

Browser automation holds bootstrap and analysis requests open to verify skeletons, the progress dialog, `aria-busy`, Escape handling, and duplicate-click prevention. A failed search response verifies dialog closure, restored interactivity, preserved query text and successful retry. Reduced-motion mode disables the loading orbit animation. Desktop home/editor/loading and responsive workflow screenshots were inspected. All 23 browser checks pass. Existing 39 backend tests remain passing; live external-service limitations above still apply.


## Version 0.5 integrated editor and menu UX verification

All **39 backend tests and 29 browser workflow checks pass**. The six additional browser checks exercise simulation within the editor, inline legal review and keyboard tabs, validation/persistence of scenario assumptions, dirty-draft result invalidation, failed simulation/retry, and filters/historical result details.

The browser edits an unsaved draft, rejects zero staff capacity, runs a 2,000-applicant scenario with digital access of 60%, and verifies 92% versus 60% modeled access while staying in the editor. It switches Review/Sources/Simulation tabs with the keyboard, verifies alternative/assumption persistence, changes assumptions without marking the document dirty, edits the document to disable old-result application, forces a 502 simulation error, and successfully retries with 2,500 applicants. Menu tests verify PP filtering and historical simulation details. Existing stale revision, source, DOCX, import/export and escaping checks continue to pass.

The tab focus regression found during development was fixed by restoring focus after the loading wrapper clears inert. Shared controls use backend numeric bounds. Scenario inputs are kept separate from document edits, and the stored simulation assumptions remain visible alongside historical output. Desktop and mobile previews in screenshots/v0.5 were taken from the running demo app. They contain generated demo results, not live Gemini responses. Existing live-service limitations above still apply.


## Version 0.6 enterprise controls and agent operations

52 backend tests and 33 browser checks pass. The thirteen added backend checks cover named-role authorization, audit metadata redaction, production fail-closed configuration, job snapshots/idempotency/restart recovery, complete source-bound execution, failure persistence without fake outputs, ownership and queued cancellation, planner scope rejection, malformed content length, running tool cancellation, timeout recording, partial results after impact failure, actual request-body cap and online-backup record integrity.

Four additional browser checks exercise agent execution from the editor with real backend traces in demo mode, duplicate submission/reload persistence, output review and responsive agent workspace, plus audit UI. Existing editing, simulation, quote inspection, legal date, stale guards, imports, exports, source comparison, keyboard tabs, escaping, errors and responsive layout checks remain passing.

Development role is explicitly local-admin when no credentials are configured. Production authorization is tested with mock named keys; no real organization identity provider is connected. No live Gemini/Vertex/Elasticsearch, Docker deployment, multi-process orchestration, operational backup recovery, load or penetration testing is claimed. Architecture and operational limits are recorded in ENTERPRISE_OPERATIONS.md.

## Version 0.7 social simulation

Eight backend cases validate 30 responses, previous-round context, isolated A/B transcripts, snapshot persistence, real reply IDs, source allowlist, no live error fallback, sibling cancellation, per-call timeout, latest-opinion aggregation and social DOCX report exports. Live provider calls are mocked.

Twenty-one browser checks validate the control room, six actual retrieved source nodes and provenance inspector, five personas, actual reply edges, zoom/reset, round filtering, recorded gathering states, replay/pause/speed, issue-to-comment links, reload, editor input preservation, revision freshness, mobile/reduced-motion, social history and exports, and no JS errors. Automation bypasses CSP only for Playwright evaluation; existing backend tests verify enabled CSP headers. Screenshots use the real local app in explicit demo mode. The gathering screenshot is recorded replay, not a live Gemini call.

## Version 0.7.1 red/white node explorer

Restored the red/white brand. Added real opinion satellite nodes per round, a clickable central draft snapshot and an explicit opinion quote in the persona inspector. Twenty-three social browser checks now include exact satellite opinion selection and central snapshot access; 33 existing regression workflows remain applicable. The backend is unchanged from 0.7 (60 passing tests). Screenshots live in screenshots/v0.7.1.
