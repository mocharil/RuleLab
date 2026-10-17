# RuleLab 1.3 user guide

RuleLab helps you read Indonesian legal sources, draft regulations, check potential conflicts and explore their impact. This guide covers the five main menus and the test scenarios to run before a demo.

## 1. Run the app

Extract the package, open a terminal in the `rulelab` folder, use Python 3.11+ (3.12 recommended), then run:

Windows:

```bat
start.bat "C:\credentials\service-account.json"
```

macOS/Linux:

```bash
chmod +x start.sh
./start.sh --sa "/path/to/service-account.json"
```

Open http://127.0.0.1:8000/workspace. The project ID is read from the JSON. Choose **Integration settings → Test Gemini connection**. Local checks alone do not confirm cloud access: the service account needs Vertex permissions, an enabled API, billing, quota and model access. Troubleshooting: `docs/SA_SETUP.md`.

Without a service account, `./start.sh --demo` runs the local demo. On Windows set `AI_PROVIDER=demo` in `.env`, then run `start.bat` without arguments. Demo mode never calls an LLM and is always labelled. After setup, later launches only need `start.bat` or `./start.sh`.

Starting data is included: regulations with their articles/blocks, original texts, extraction results, enriched JSON and legal guidelines. The corpus is a sample, not all of Indonesian law. SQLite RAG works immediately; optional Elasticsearch hybrid search is described in `QUICKSTART.md`.

## 2. Workspace orientation

| Menu | Purpose |
| --- | --- |
| Overview | Choose a draft, create or generate one, and see the review queue and sources. |
| Policy Studio | One flow: Draft → Verify sources → Test impact, including the persona forum and unified review. |
| Data dashboard | Collection size, regional map, type/year filters and the upload/JDIH queue. |
| Legal library | Search documents or article text, read sources, ask the assistant and compare two articles. |
| Activity | One decision trail per draft: versions, agent runs, their results and review decisions. |

**Policy Studio** combines drafting, source checks and impact tests in one flow: **Draft → Verify sources → Test impact**. A document bar stays at the top of every stage: click the draft title to switch drafts, read its type, article count and save state, use the stage's main action (**Save version**, **Check sources** / **Re-check**, **Compare A/B**) and open **More** for Import, Export DOCX, the review report, draft versions, a new draft from a brief, Focus mode and the legal guidelines. The steps under the bar switch stages; each one shows its version and whether its result is older than the draft. Document changes are saved before switching; if saving fails you stay on the Draft stage with the same input.

The main URL is `http://127.0.0.1:8000/workspace?view=studio`. The stage is saved in the `stage` parameter; old Editor/Analysis/Simulation links still open the matching stage. The Studio sidebar returns to the last stage you opened. The quick menu also recognizes the words “editor”, “analysis”, “simulation” and “public”.

**Activity** is one decision trail for the selected draft (switch drafts from the selector under the title). The timeline on the left is grouped by draft version, newest first; each agent run holds the results it produced, and results from Policy Studio stand on their own. Every row says what it found (for example "3 findings · 2 high", "Access 70% → 94%" or "B: 8 support · 16 conditional · 0 concern"). The chips filter by **Needs review**, **Reviewed**, **Outdated** (the draft changed after the result was made) or **All**; **Type** narrows the list to source checks, simulations or forums. Selecting a row opens it on the right without a dialog. Filters and the selected item are kept in the URL (`view=activity&status=all&item=run:…`); the old `view=history`, `view=agents` and `tab=agents` links still work, the latter opening the latest agent run.

Collapse the sidebar with the icon at the top left. **Quick menu** or Ctrl+K / Cmd+K helps navigation. The **?** button in the header opens the interactive guide for the active menu. **User guide** opens this document in a new tab. Switching menus saves draft changes; the Save button records a version explicitly.

## 3. Data dashboard and collection map

Open **Data dashboard** in the sidebar or via the map on the landing page. The header says when the collection was last updated. Four tabs organise the page:

- **Overview**: five counts (regulations, articles/blocks, provinces, national documents, documents needing OCR), the province map and a ranked list beside it. Choose the distribution meaning (issuing region, regulated coverage or mentioned region), type and years. National regulations have their own row and are never split across provinces; the list also names the provinces without documents. Click a province on the map or in the list for its regencies/cities and latest documents, then **See all in Explore**. Click a year bar, a type or a topic to filter.
- **Explore documents**: every document, with search (title, number, year or regency), status, sorting and pages of 25. Active filters appear as chips you can remove. Click a row to open the document in the Legal library.
- **Data quality**: text available, OCR needs, human review, amendments, checksum issues and documents without a region, plus retrieval by day and source sites. Every number opens its documents.
- **Source queue**: uploads and JDIH links waiting for review.

**Add source** (header) uploads a PDF/DOCX/TXT/JSON for review or records a JDIH link; links are not downloaded automatically. Set **Map shows** to *Source queue* on the Overview tab to see where queued sources come from. The queue is not part of the analysis corpus and does not appear in public statistics. Coverage details: `docs/DATA_DASHBOARD.md`.

## 4. Legal library and learning assistant

The library is one screen: results on the left, the reader in the middle and the legal assistant on the right. One search box serves both **Documents** (title, number, year or regency, e.g. `UU 25 2009`; words like *nomor* and *tahun* are ignored) and **Articles** (the text of every article). Document results come from the server 20 at a time with **Load more**, a type filter and sorting (newest, best match, title). Article results show the regulation title and the matching passage with your words highlighted. **Compare articles** is in the header.

Old `view=gallery` and `view=corpus` links still open the Legal library; the active URL uses `view=library`. The search mode, query, document and article are kept in the URL so the page can be reopened after a reload.

1. Open **Legal library** in the sidebar, or http://127.0.0.1:8000/workspace?view=library.
2. Search a title or number/year such as `UU 25 tahun 2009`, or choose a type.
3. Click a result. The reader opens beside the list (on a phone it replaces the list; **Results** goes back) and shows the title, promulgation date, version, article count and OCR needs. The opened document becomes the assistant's context, shown as a chip such as **UU 25/2009 ×**.
4. Move between articles with the arrows, the **←/→** keys or **Contents**, which also finds text inside the document. **Formatted**, **Side by side** and **Original PDF/HTML** switch the view; **Original file** and **Structured JSON** download the source; **Official source page** opens the original site; **Status, source & extraction trail** shows the SHA256 and limits.
5. **Copy citation** copies a reference such as *Pasal 4 Undang-Undang Nomor 25 Tahun 2009 tentang Pelayanan Publik*. **Compare with…** opens Compare with this article as source A.
6. Click **Ask about this article** to fill in a question, then send it. Suggested questions also fill the input first, so you can adjust them before the model is called.
7. The live assistant explains in plain English. Every part of the answer has a quote. **Quote → Open in reader** opens that article in the reader with its page number and SHA256; check the official source link.
8. Remove the context chip (×) to ask about the entire collection, or use **Use UU …** to go back to the open document. An explicitly mentioned regulation number/year takes priority over the context.
9. Use a follow-up question or write your own. After a successful answer about one regulation, the assistant's context moves to that regulation to help follow-ups.

Example questions:

- `What is UU 25/2009 about? Explain it for a beginner.`
- `What does Article 4 of UU 25/2009 mean?`
- `Explain Article 19 of UU 8/2016 in plain language.`
- `What does public service mean in this document?`
- `Which rights or obligations are mentioned in this quote?`
- `What is UU 10/2018 about?`

The last example tests the corpus limits: if a regulation is not in the collection, the assistant says the document is not available yet and never invents content or claims the regulation does not exist. Add verified sources through the ingestion pipeline to grow the collection.

In demo mode the assistant only shows source excerpts labelled **Demo · excerpt**. Dynamic explanations and analogies need Gemini live. The model uses the same Indonesian legal guidelines as the review feature; every source ID and quote text is checked by the server. The quote check ensures the text matches; it does not certify the legal interpretation.

Conversation history lives in the page session memory: it stays when switching menus, disappears on reload/close, and can be cleared with **Clear**. Up to 20 turns are shown; at most three previous turns are sent to the model as context. Retrieved articles remain the legal source. Questions and source excerpts are sent to the provider in live mode; do not include unnecessary sensitive information.

If the model fails, the question stays in the input; **Try again** returns it for editing, then press **Ask**. There is no automatic fallback from live to demo results. Questions are limited to 3–2,500 characters. Reading or filtering documents does not call the model; live questions use provider quota/billing, and Elasticsearch adds embedding queries.

## 5. Draft in the editor

1. From Overview choose **New draft**. Choose one of 15 regulation types, a new regulation or an amendment, fill in the identity and basis, and click **Preview document**. Review its form, then **Create draft**. **Generate** accepts a policy brief for an AI-assisted first draft.
2. Fill in the title, type, scope and considerations. Write each provision as a separate article; article numbers must be unique.
3. The **outline** on the left lists the opening, every article with its number of findings, and the closing; click an item to jump to it. **Add article** is at the bottom of the outline. Amendments keep Pasal I/II; edit the replacement norms inside Pasal I. Open **Opening** and **Closing & annexes** to complete the format, then **Save version** (or Ctrl+S). The closing fields are included in the DOCX export.
4. The **Insights** rail on the right follows the article you are editing: its findings, the proposed wording as a diff, related sources, **Apply proposal**, **Open in Verify** and **Ask the library** about that article. Before the first check it offers **Check sources**; when the check is older than the draft, it says so and offers **Re-check**. On a phone, open it with the **Insights** button.
5. **Focus mode** (in **More**) hides the outline and insights. While it is on, the bar shows **Focus mode · Exit**. Input is kept when the sidebar is collapsed or focus mode changes.

Import accepts TXT, JSON DraftInput, DOCX or text PDF up to 10 MB. In TXT/DOCX, each `Pasal 1` heading must be on its own line. Scanned PDFs need OCR before import. User drafts are separate from the source corpus: importing a draft does not add documents to the Legal library.

## 6. Review potential conflicts

Open **Policy Studio → Verify sources**, or use **Check sources** in the Insights rail. The summary line shows the checked version, the analysis date (change it to check source time limits), the number of sources and findings, and the review status with **Reviewer notes**.

Findings are listed on the left by severity and article; the selected finding opens on the right. Use the filters, the arrows or the **J** / **K** keys to move between findings. Each finding shows its reasoning, a diff of the draft text against the proposed wording, the source quotes, legal checks and an alternative reading. Open the source before deciding. **Apply to draft** creates a new version. After that, the other proposals belong to an older version: a banner says the draft is now newer and each **Apply** button explains that a re-check is needed first. Findings whose citations cannot be verified against the source text are dropped automatically and counted under **Review limits & legal context**.

An empty result does not prove the draft is conflict-free. The UU/PP relation is a starting point; authority, delegation, scope, exceptions, amendments and effective dates must still be considered. RuleLab never declares a regulation void.

## 7. A/B impact simulation

Open **Policy Studio → Test impact**. A uses the saved draft. Step 1 is **Alternative B**: edit it directly, or click **Start from Verify proposals** to build B from the proposals of the latest check (one per article); the diff beside it shows how B differs from A. **Compare A/B** stays disabled while B is identical to the draft. Step 2 holds the six assumptions (applicants, digital access, assisted success, digital and assisted cost, staff capacity). Step 3 shows the results: both scenarios, the change, and collapsible **Stakeholder benefits & risks** and **Sensitivity ±10 points & formula**. **Review & apply B** replaces the draft articles with B as a new version.

Access and cost numbers are computed from the input assumptions; the stakeholder narrative comes from the active provider. Check sensitivity and saved assumptions before comparing results. Starting inputs are examples, not Indonesian survey data. If the draft changes, run the simulation again so results match the latest version.

## 8. Public forum and network

Prepare alternative B and run **Collect public opinions** in **Policy Studio → Test impact → AI Persona Public Forum**.

Choose 8, 16, 24 or 32 agents, 2–5 rounds and the crowd size in the forum bar before running the two A/B scenarios. The default 24 agents × 4 rounds gives 192 responses; the maximum 32 × 5 gives 320. Synthetic profiles follow the document's sector. Personas can reply to comments from earlier rounds in the same scenario.

Results open in one network panel with three views:

- **Knowledge graph** (shown first once a run finishes): the draft, its articles, the retrieved legal sources, issues and stakeholders, plus institutions, groups and instruments that the AI model found in the text (live mode). Colours mark entity types; a ring around a stakeholder shows its latest stance in the selected scenario. Drag, zoom and pan the graph, search for an entity, hide types in the legend, or turn on relation labels. Click a node to read its description and relations; a stakeholder opens its persona opinions, an article opens that Pasal in Draft.
- **Crowd network**: how opinions spread through the simulated follow network (below).
- **Persona network**: who replied to whom, round by round. Use name/role search, issue/layer filters, zoom, fullscreen and replay.

The conversation feed and the issues & mitigation proposals sit below the panel. The Draft stage shows a small **Stakeholder map** of the focused article in the Insights rail, and **Activity** shows the same knowledge graph in the forum result.

- Click a persona node for its latest opinion.
- Click a round 1/2/3 opinion node for the comment from exactly that round.
- Click a legal source node for its quote and provenance.
- Click the centre node for the draft snapshot.
- Choose A/B, filter rounds, pan/zoom or reset the view.
- Replay re-enacts the recorded order without calling the LLM again. Pausing a replay does not cancel the server job.

### Crowd network (spread of opinion)

Below the policy network, the **Crowd network** panel shows what happens after the AI personas speak. Before the first round the run builds a stakeholder knowledge graph (articles, sources, issues, stakeholders and, in live mode, institutions and instruments extracted by Gemini). Then it spawns 0, 50, 100, 200 or 500 lightweight **crowd agents** (Crowd selector, default 100) around the AI core personas and wires a follow network (same-group ties, a few bridges to other groups).

Each round, active crowd agents read a feed (accounts they follow, trending accounts and an occasional recommended stranger), move toward views within their openness range, may push back on views that are too far, and may follow or unfollow accounts. Node colour is stance, size is influence, and AI core personas are outlined. Use **Replay rounds** or the round slider, click a node for its stance journey, or click a community to isolate it. The side panel lists top influencers (PageRank), communities, bridge accounts, polarization, an echo-chamber index and the A→B shift.

Crowd agents follow transparent rules and do not call the AI provider, so a large crowd adds no cost. Their starting stances come from what the core personas actually said; they are not survey data.

These opinions are synthetic, not real public comments or a statistical forecast of public opinion. Demo uses templates; live uses Gemini. A social run makes agents × rounds × two scenarios persona calls, plus the planner, so it takes longer than a single review.

## 9. Activity and export

**Legal library:** switch the search to Articles to look for phrases, open the text/JSON, then choose two articles in **Compare articles** (or **Compare with…** from the reader). Live mode adds AI analysis; demo only shows the source comparison and the initial hierarchy relation.

**Activity → Run agent team:** the button opens a side sheet. Choose the scope (legal review, impact simulation, both, or public forum). Alternative B and the assumptions come from Test impact and can be edited in the sheet; edits carry back to Test impact. An alternative B identical to the draft is refused. The run starts on a snapshot of the current version, appears at the top of the timeline and stays selected while its trace updates. The trace folds repeated calls into one step with a count (for example, every persona response is one "Persona response × n" line); **All events** shows the raw log. Queued/running/completed/failed/cancelled status is saved in the workspace. Cancelling is available to the owner or an admin. Agents compose review results; they never apply draft revisions automatically.

**Activity → review decisions:** open a result, read it, then choose **Still needs review** or **Reviewed with notes**, write what you verified and **Save decision**. Each decision is stored with the reviewer, role and time; earlier decisions stay in **Decision history** instead of being overwritten. The **Review in Activity** buttons in Verify sources and Test impact open that result here. Viewers can read results but cannot record decisions or start runs. A result made on an older version shows an Outdated warning; run it again in Policy Studio before relying on it. **Open in Verify sources / Test impact / the forum** appears on the latest result of each kind for the current version.

**Activity → versions:** select a version header to see the word-level changes from the previous version and the runs and results made on it. **Draft versions** in the Policy Studio menu opens the current version here.

**Review report:** the header button downloads the report DOCX once a source check exists.

**DOCX export:** the draft DOCX contains the saved draft. The report DOCX contains the available review/simulation results and their limits. Check exported documents before use. Export is not official publication of a law.

## 10. Your test checklist

Use demo mode first to check the flow, then repeat with Gemini live after the connection test succeeds.

| Test | Steps | Expected result |
| --- | --- | --- |
| Collection | Open the Legal library | The document collection and its article/block count are shown. |
| Filter | Choose PP | Only PP documents are listed. |
| Reader | Choose UU 25/2009, Article 4 | The article text and access to the original text/JSON are shown. |
| Known document | Ask what UU 25/2009 is about | Demo: excerpts; live: explanation with quotes. |
| Follow-up | Ask what Article 4 means | Sources point to the article in the selected context. |
| Corpus limit | Ask about a regulation outside the collection | Document not available, no invented quotes. |
| Missing article | Ask about Article 999 of UU 25/2009 | Context insufficient; no other article is substituted. |
| Source trail | Open quote context | Full text, page and SHA256 are available. |
| Conversation | Switch menus and come back | The conversation stays; Clear empties it. |
| Draft | Edit one article, save | Saved versions increase and history can be opened. |
| Review | Check, edit the draft, try an older proposal | Older proposals are disabled until re-checked. |
| Review decision | Open a result in Activity and save two decisions | Both appear in Decision history with reviewer, role and time; the newest is the status. |
| Agent run | Activity → Run agent team → Legal review | The run is selected, its trace updates and its result appears under it. |
| A/B | Change assumptions and run the simulation | Numbers follow the saved assumptions; labels do not claim empirical data. |
| Public forum | Run the social job, choose A/B | Agents × rounds of responses per scenario; opinion nodes are clickable. |
| Export | Export the draft and DOCX report | Files open; the draft can be re-imported. |

Validation errors appear next to the field that needs fixing. The message stays until that input changes; the value you typed is kept.

If you find a problem, note the menu, the steps, demo/live mode, the error message and the app version. Include a screenshot without keys or credentials if needed. Never share the service account JSON.

## 11. Optional technical verification

```bash
python3 -m pytest -q tests
npm --prefix frontend install
npm --prefix frontend test
npm run test:dom
```

Frontend tests need Node.js/npm; running the app itself does not. For local screenshots, install the root dependencies and browser first:

```bash
npm install
npx playwright install chromium
npm run screenshots
```

The scripts use a separate demo database, need no service account and do not replace the cloud test.

Optional, paid live test:

```bash
.venv/bin/python scripts/doctor.py --live
.venv/bin/python scripts/verify_live.py --full
```

On Windows, replace `.venv/bin/python` with `.venv\Scripts\python`. `--full` uses a public sample/temporary database and about 45 generation calls, including the library assistant, plus embeddings if Elasticsearch is active. Results are written to `artifacts/live-verification.json`.
