# Brief: Generate the RuleLab Submission Deck as Slide Images

You are a presentation designer. Please generate **14 slide images**, one at a time, in the order given, for the hackathon submission deck of **RuleLab**. Every slide must look like part of the same deck: same grid, same header and footer, same colors, same typography, same illustration style.

**Attached files:**
- `style-board.png`: six frames from RuleLab's demo video. This is the visual language to match. Ignore the dark subtitle pills at the bottom of each frame; they are video captions, not part of the design.
- `rulelab-logo.png`, `rulelab-icon.png`: the official logo. **Do not draw, redraw or imitate the logo.** Leave the logo areas empty (see "Logo rule"); the original logo file will be placed there afterwards.

---

## 1. About RuleLab (context)

RuleLab is an AI workspace, built on Google Gemini, that helps Indonesian lawmakers **draft** a regulation, **verify** every clause against official legal sources, and **test its impact** on citizens before it is signed. The demo story follows one draft rule, *"applications may only be submitted through a digital app,"* which would lock out elderly citizens, people with disabilities and villages without signal. RuleLab catches the conflict with existing law, proposes an inclusive fix, and shows that the fix serves 94% of applicants instead of 70%.

Competition: **AI Builder Cup**. Judging: Technical Merit & Gen AI 40% · Problem Alignment & Impact 25% · Innovation & Creativity 25% · User Experience & Solution Design 10%.

---

## 2. Design system (apply to every slide)

### Canvas
- Generate each slide **landscape, 1536×1024**.
- The deck is 16:9, so keep **all content inside the central 1536×864 band**. Leave the **top 80 px and bottom 80 px as plain background**; they will be cropped off.
- All positions below are relative to that 1536×864 safe area.

### Colors (use only these)
| Token | Hex | Use |
| :--- | :--- | :--- |
| Background | `#F2F2F3` | Slide background, flat, no gradient |
| Card | `#FFFFFF` | Content cards, radius 24 px, very soft shadow |
| Ink | `#111214` | Headlines and body text |
| Muted | `#6E7279` | Secondary text, captions |
| Line | `#E4E6EA` | Dividers, card borders |
| Crimson | `#C8102E` | Primary accent: kicker labels, numbers, key lines, the period at the end of headlines |
| Green | `#1E8E4F` | Only for "verified / served / pass" |
| Amber | `#B7791F` | Only for "warning / medium" |
| Blue | `#2F5BD3` | Only for source/citation chips |

### Typography
- **Headlines:** heavy geometric sans-serif (like Manrope ExtraBold), tight letter spacing, 2 lines max, always **ending with a crimson period**, for example "Draft. Verify. Test impact**.**"
- **Kicker** above each headline: small crimson UPPERCASE label with wide letter spacing.
- **Body:** same sans-serif, regular/semibold, dark ink, generous line height. Minimum readable size; never cram text.
- **Legal text samples** (Indonesian law quotes) only: elegant serif (like Cormorant Garamond).
- **Spell every word exactly as written in this brief.** Do not invent extra text. Proofread before showing the image.

### Recurring frame (identical on slides 2–13)
- **Top-left:** logo area (empty, see Logo rule).
- **Top-right:** slide number in muted text, for example `02 / 14`.
- **Below the header:** kicker + big headline on the left.
- **Footer** (bottom of safe area): a thin `#E4E6EA` line, then left `RuleLab · AI Builder Cup 2026` and right `Team RuleLab`, both small and muted.
- Margins: 64 px left/right; consistent 24 px gaps between cards.

### Signature details (from the video)
- A **single small crimson dot** used as a visual motif (bullet, timeline node, accent).
- **White rounded cards** floating on the grey background with soft shadows.
- **Chips/pills:** rounded labels (green "Verified", blue source chips like `UU 25/2009 · Pasal 29`, amber/crimson severity tags).
- **Spot illustrations:** soft 3D clay style, matte, rounded, Indonesian people, same look as the people in `style-board.png`. Use them sparingly (slides 1, 2, 3, 14).
- Diagrams: clean flat boxes and arrows, thin lines, crimson numbered step badges (①②③…), no 3D, no clip-art, no stock icons with text.

### Logo rule (very important)
- **Never draw the RuleLab logo or any "R" mark.**
- On slides 2–13 reserve an **empty area of 240×64 px at the top-left (x 64, y 40)** filled only with the plain background. Write nothing in it.
- On slides 1 and 14 reserve a larger **empty area of 520×140 px** where specified.
- The original logo will be placed into these areas after generation.

### Never
Stock-photo look, gradients, dark backgrounds (except where stated), neon, glassmorphism, emojis, fake logos (Google, Gemini, Elasticsearch, React, etc.; write technology names as plain text), lorem ipsum, misspellings, text in the top/bottom 80 px bands.

---

## 3. Slides

### Slide 01: Team Details (cover)
- **Layout:** left 55% text, right 45% a white card with the problem statement. Large empty logo area (520×140) at top-left.
- **Under the logo area:** tagline in large bold ink: `Laws that fit together, and fit the people they serve.` (crimson final period)
- **Team block** (label in muted small caps, value in bold ink):
  - `TEAM NAME` → `RuleLab`
  - `TEAM LEADER` → `Moch Aril Indra Permana`
  - `TEAM MEMBERS` → `Fahadh Ilyas · Salfarisa Fitria`
  - `THEME` → `Sustainability & Social Impact`
- **Right card:** kicker `PROBLEM STATEMENT`, then:
  `Indonesian regulations are drafted against thousands of overlapping laws and checked by hand for weeks. Generic AI chatbots invent legal articles that do not exist. And the real impact on citizens (the elderly, people with disabilities, remote villages) only shows up after a rule is signed.`
  Below it, a small 3D clay illustration of an elderly Indonesian woman in a beige hijab looking puzzled at a smartphone (same character as in `style-board.png`).
- No slide number on this slide.

### Slide 02: Brief About the Idea
- Kicker `BRIEF ABOUT THE IDEA`. Headline `Draft. Verify. Test impact. Before it’s signed.`
- Sub-line: `RuleLab is an AI workspace, built on Gemini, for drafting Indonesian regulations that are grounded in official law and tested on people.`
- **Three equal cards** in a row, each with a crimson step number, a simple line icon and text:
  1. `01 · Draft`: `Gemini turns a plain-language policy brief into a draft in the official legal structure: 15 regulation types, considerations, legal basis and numbered articles.`
  2. `02 · Verify`: `Agents check every article against 12,000+ official regulations from JDIH. Each finding cites the exact article, page and document fingerprint (SHA-256). Unverifiable citations are rejected.`
  3. `03 · Test impact`: `A deterministic A/B model projects who is served and at what cost, while 8–32 AI personas debate both drafts over up to 5 rounds.`
- **Bottom strip** (thin card): `Human reviewer stays in charge · every change is a new version · exports to Word with a full audit trail`

### Slide 03: Opportunities
- Kicker `OPPORTUNITIES`. Headline `Not another legal chatbot.`
- **Three columns** of white cards, each with a crimson heading:
  1. `How is it different?`
     - `Generic chatbots answer questions; RuleLab produces and reviews the regulation itself.`
     - `Every citation is checked against the official source text; hallucinated articles are rejected.`
     - `Static JDIH portals store PDFs; RuleLab turns them into a searchable, versioned knowledge base.`
     - `Impact is tested before enactment, not discovered after.`
  2. `How does it solve the problem?`
     - `Cuts weeks of manual harmonization to minutes of guided review.`
     - `Flags conflicts with higher laws (e.g. UU 25/2009 Public Services, UU 8/2016 Disabilities).`
     - `Quantifies who is left out (70% vs 94% served) and the cost of including them.`
     - `Surfaces citizen concerns early through a synthetic public forum.`
  3. `Unique selling points`
     - `Source-verified Gen AI: SHA-256 provenance on every quote`
     - `Native to Indonesian law-making: 15 forms, UU 12/2011 drafting rules`
     - `Multi-agent pipeline: research, legal review, impact, quality check`
     - `People-first: A/B projection + 32-persona public forum`
- Small 3D clay illustration in the lower right corner: a tired Indonesian civil servant at a desk piled with law books (same character as the drafter in `style-board.png`), scaled small.

### Slide 04: Features
- Kicker `FEATURES`. Headline `One workspace, end to end.`
- **Grid of 8 feature cards (4 × 2)**, each with a simple line icon in a crimson-tinted rounded square, a bold title and one line:
  1. `Guided drafting`: `15 official regulation types, brief-to-draft with Gemini`
  2. `Source-backed review`: `Findings with evidence, counter-arguments and proposed text`
  3. `Citation guard`: `Quotes matched to source text, page and SHA-256`
  4. `A/B impact projection`: `Served, left out, cost and staff workload, ±10 pt sensitivity`
  5. `AI public forum`: `8–32 personas × 2–5 rounds, network of reactions by issue`
  6. `Legal library assistant`: `Plain-language answers with clickable citations`
  7. `Regulation data dashboard`: `Map of 38 provinces, filters by type, year and region`
  8. `Versions, audit & export`: `Immutable versions, reviewer notes, DOCX and JSON export`

### Slide 05: Process Flow / Use Case
- Kicker `PROCESS FLOW`. Headline `From brief to reviewed draft.`
- **Swimlane diagram, 3 horizontal lanes** labelled on the left: `Policy drafter`, `RuleLab AI (Gemini + agents)`, `Legal reviewer`.
- Steps connected by arrows with crimson numbered badges:
  1. Drafter: `Write policy brief`
  2. AI: `Generate draft v1 (official structure)`
  3. Drafter: `Edit articles → v2`
  4. AI: `Retrieve sources · analyze · verify citations`
  5. AI: `Findings + evidence + proposed fix`
  6. Reviewer: `Review, add notes, apply fix → v3`
  7. AI: `A/B projection + public forum simulation`
  8. Reviewer: `Unified review: decide`
  9. Drafter: `Export draft + review report (DOCX)`
- Small note under the diagram: `Every step is versioned and written to the audit log.`

### Slide 06: Wireframes
- Kicker `WIREFRAMES`. Headline `Five menus. One studio.`
- **Left (40%):** an information-architecture tree of light boxes:
  - `Overview`
  - `Policy Studio` → `Draft` · `Verify sources` · `Test impact`
  - `Data Dashboard`
  - `Legal Library` → `Documents` · `Article search` · `Assistant`
  - `Activity` → `Results & review` · `Agent runs`
- **Right (60%):** a low-fidelity grey wireframe of the Policy Studio screen: left sidebar with 5 menu bars, top bar, a row of 3 stage tabs (`Draft`, `Verify sources`, `Test impact`), a large document panel with article blocks, and a right assistant panel. Use grey boxes and lines only, with one crimson highlight on the active tab. Annotate 4 parts with small crimson numbered callouts: `① Stage tabs`, `② Draft document`, `③ AI assistant panel`, `④ Version & save state`.

### Slide 07: Architecture (most detailed slide)
- Kicker `ARCHITECTURE`. Headline `From official PDFs to verified answers.`
- **One unified diagram** using the full width, organized in **four horizontal lanes from top to bottom**, each lane in a light rounded container with a lane label on the left. Numbered crimson badges show the data flow in order. Use small but readable text. Arrows flow left → right inside lanes and down between lanes.

**Lane A: Data pipeline (batch)**
1. `Sources`: `JDIH peraturan.go.id · official PDF/HTML · user uploads & JDIH link queue`
2. `Scraper`: `Python · BeautifulSoup · download raw files · SHA-256 checksum · de-duplicate`
3. `Extract`: `PyMuPDF / HTML parser · page-aware text · OCR-needed flags`
4. `Enrich with Gemini`: `Vertex AI · structured JSON schema → type, number, year, issuer, region, topics, articles & clauses, amendment relations`
5. `Load`: two outputs →
   - `SQLite (canonical): regulations · articles · FTS5 BM25`
   - `Elasticsearch: BM25 text + 768-d vectors (gemini-embedding-001, cosine) · embedding cache`

**Lane B: Knowledge & retrieval (RAG)**
6. `Hybrid retrieval`: `BM25 + kNN vector search → Reciprocal Rank Fusion`
7. `Evidence expander`: `neighbor clauses · Article 1 definitions · versions & amendments`
8. `Evidence pack`: `source IDs · pages · SHA-256 · as-of date`
   - Side box: `Legal rulebook: 28 drafting & conflict rules (UU 12/2011 Annex II)`

**Lane C: AI & backend services (FastAPI on Google Cloud Run)**
9. `Gemini on Vertex AI`: `service-account auth · JSON response schema · retries, timeouts, bounded concurrency`
10. `Agent orchestrator`: a small chain of 6 boxes: `Coordinator (plans workflow)` → `Research agent` → `Legal reviewer` → `Impact analyst` → `Public forum (8–32 personas)` → `Quality reviewer`
11. `Citation guard`: `unknown source IDs rejected · quotes must match source text · rule IDs validated`
12. `Services`: chips `Brief → draft` · `Conflict analysis` · `A/B simulation (deterministic)` · `Library assistant` · `DOCX export`
13. `State`: `drafts & immutable versions (optimistic locking) · analysis runs · agent jobs & events · audit log`

**Lane D: Frontend (workspace UI)**
14. `Web app`: `React 19 islands · TypeScript · Tailwind 4 · Radix UI · Motion · D3 network · 38-province map`
15. `Menus`: `Overview · Policy Studio (Draft / Verify / Test impact) · Data Dashboard · Legal Library · Activity`
16. `REST API` (between lanes C and D, as a thin bar): `/generate · /drafts/{id}/analyze · /simulate · /agent-jobs · /apply-revision · /search · /library-chat · /export`
- **Users** at the far right of lane D: three small person icons labelled `Drafter · Reviewer · Analyst`.
- **Bottom note:** `Gen AI is used in 5 places: enrichment, embeddings, drafting, analysis agents and persona simulation. Every AI output is schema-validated and source-checked.`

### Slide 08: Technologies
- Kicker `TECHNOLOGIES`. Headline `Built on Google Cloud and Gemini.`
- **Table-like layout of 5 rows** (white card, thin dividers), columns `Layer` | `Technologies` | `Role`:
  1. `Gen AI` | `Gemini (Vertex AI) · gemini-embedding-001 (768-d)` | `Enrichment, drafting, legal analysis, agents, personas, embeddings`
  2. `Backend` | `Python 3.12 · FastAPI · Pydantic v2 · Uvicorn` | `REST API, schema validation, agent jobs, optimistic locking`
  3. `Data & search` | `SQLite FTS5 · Elasticsearch (BM25 + kNN) · RRF` | `Canonical store, hybrid RAG retrieval`
  4. `Ingestion` | `BeautifulSoup · PyMuPDF · python-docx` | `Scraping, extraction, DOCX import/export`
  5. `Frontend` | `React 19 · TypeScript · Tailwind 4 · Radix UI · Motion · D3` | `Responsive workspace, network graph, map`
- **Bottom chip row:** `Docker` · `Google Cloud Run` · `Vertex AI` · `Playwright` · `Pytest` · `Vitest`

### Slide 09: Estimated Implementation Cost
- Kicker `ESTIMATED COST`. Headline `Cheap to run. Cheap to scale.`
- **Two large cards side by side:**
  - `Infrastructure`
    - `Cloud Run (scale to zero)`: `≈ $15–35 / month`
    - `Elasticsearch (optional; SQLite fallback)`: `≈ $0–60 / month`
    - `Local / on-premise mode`: `$0`
  - `Gen AI usage (estimated)`
    - `Corpus embedding (one-time, 12,000+ regulations)`: `≈ $20–40`
    - `One draft analysis`: `≈ $0.01–0.05`
    - `One 32-persona × 5-round forum`: `≈ $0.30–0.80`
    - `Replay of a past forum`: `$0 (no AI calls)`
- Footnote in muted small text: `Estimates based on Flash-tier Vertex AI pricing; verify against current Google Cloud price list.`

### Slide 10: Snapshots of the Prototype
- Kicker `PROTOTYPE`. Headline `What it looks like.`
- **Four empty screenshot frames** in a 2 × 2 grid: white rounded rectangles with a thin border and a tiny 3-dot window bar at the top, **interior left completely blank (plain white)**. Real screenshots will be inserted later.
- Caption under each frame (bold ink + muted line):
  1. `Draft with Gemini`: `Brief → official-structure draft`
  2. `Source-verified findings`: `Evidence with page and SHA-256`
  3. `A/B impact projection`: `70% → 94% of applicants served`
  4. `AI public forum`: `32 personas · 5 rounds · 6 issue clusters`

### Slide 11: Prototype Performance / Benchmarking
- Kicker `PERFORMANCE`. Headline `Tested, measured, grounded.`
- **Grid of 8 metric tiles (4 × 2):** big crimson or ink number, label below:
  1. `12,000+` · `regulations in the corpus`
  2. `15` · `official regulation forms`
  3. `28` · `legal drafting & conflict rules`
  4. `160` · `backend tests passing`
  5. `~32 s` · `brief → full draft (live Gemini)`
  6. `~10 s` · `live model + retrieval health check`
  7. `320` · `persona responses per forum (max)`
  8. `5` · `screen sizes tested (360–1440 px)`
- **Bottom card:** `Quality gates: JSON-schema validation on every AI response · citation guard on every quote · optimistic locking on every save · Playwright end-to-end journeys`

### Slide 12: Additional Details / Future Development
- Kicker `ROADMAP`. Headline `What comes next.`
- **Horizontal timeline** with crimson dot nodes and three phases, each a card:
  1. `Now (prototype)`: `Draft · Verify · Test impact · 12,000+ regulations · Gemini on Vertex AI`
  2. `Next 3 months`: `Deploy on Cloud Run for pilot agencies · regional regulations (Perda) from 38 provinces · OCR for scanned annexes · bilingual UI (Bahasa Indonesia / English)`
  3. `Next 12 months`: `Temporal legal graph (effective dates, amendments, Constitutional Court rulings) · multi-tenant PostgreSQL with roles & SSO · calibrate impact model with real service data`
- **Bottom line:** `Goal: every new regulation in Indonesia checked against the law and tested on people before it is signed.`

### Slide 13: Links
- Kicker `LINKS`. Headline `Try it yourself.`
- **Three large link cards**, stacked, each with a line icon, a label and a value box:
  1. `GitHub Public Repository` → value text `github.com/mocharil/RuleLab`
  2. `Demo Video (3 minutes)` → **value box left empty** (plain white)
  3. `Final Product` → **value box left empty** (plain white)
- The empty value boxes will be filled in later; do not write placeholder text in them.

### Slide 14: Closing
- **Dark exception:** background `#0B0B0C` (like the logo frame in `style-board.png`).
- Center: a large **empty logo area 520×140 px** (fill with the same dark background; draw nothing).
- Below it, in white: `Thank you.` (crimson period) and in light grey: `Laws that fit together, and fit the people they serve.`
- Below: `Team RuleLab · Moch Aril Indra Permana · Fahadh Ilyas · Salfarisa Fitria`
- A single small crimson dot near the bottom center.

---

## 4. How to work

1. Generate **Slide 01 first**. Treat it as the master; every later slide must match its margins, header, footer, fonts and colors.
2. Generate one slide per reply. Under each image write `Slide NN – file name: slide-NN.png`. If you can only produce one image per reply, continue with the next slide when I reply `next`.
3. Before showing each slide, check it:
   - [ ] Text is spelled exactly as in this brief, with no extra words
   - [ ] Nothing in the top/bottom 80 px bands
   - [ ] Logo area is empty (no logo, no "R" mark drawn)
   - [ ] Only palette colors; flat `#F2F2F3` background (except slide 14)
   - [ ] Header, footer and slide number are consistent with Slide 01
   If any check fails, regenerate the slide before showing it.
4. If I ask for a revision, change only what I mention and keep everything else identical.
