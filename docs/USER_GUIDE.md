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
| Activity | Results & review tab for results/versions/notes; Agent runs tab for briefs and execution traces. |

**Policy Studio** combines the Editor, Conflict check and Simulation. Choose a stage on the three cards above the work area. Document changes are saved before switching; if saving fails you stay on the Draft stage with the same input. Stage labels show the document version and saved results, including older results after the document changed. Use the Test impact stage for the A/B projection, persona forum or unified review.

The main URL is `http://127.0.0.1:8000/workspace?view=studio`. The stage is saved in the `stage` parameter; old Editor/Analysis/Simulation links still open the matching stage. The Studio sidebar returns to the last stage you opened. The quick menu also recognizes the words “editor”, “analysis”, “simulation” and “public”.

**Activity** combines History & review and Agent operations. Choose the Results & review or Agent runs tab; summary cards show saved results, review needs, notes and active runs. Numbers follow the selected draft and update when an agent run finishes. Task scope, alternative B, assumptions and filters stay available when switching tabs in a session. The URLs `view=activity&tab=results` and `tab=agents` can be reopened; old links still work. The sidebar returns to the last tab.

Collapse the sidebar with the icon at the top left. **Quick menu** or Ctrl+K / Cmd+K helps navigation. The **?** button in the header opens the interactive guide for the active menu. **User guide** opens this document in a new tab. Switching menus saves draft changes; the Save button records a version explicitly.

## 3. Data dashboard and collection map

Open **Data dashboard** in the sidebar or via the map on the landing page. Choose the type, year and distribution meaning: issuing region, regulated coverage or mentioned region. National regulations are shown separately; regions without data still show zero. Choose a province on the map or dropdown, then a regency/city from the list when metadata is available. Click a document to open it in the Legal library.

**Upload source** stores PDF/DOCX/TXT/JSON for review, shows extraction excerpts and provides file downloads. **Add JDIH link** records a government URL in the retrieval queue; links are not downloaded automatically. Choose the **Source queue** layer to see the spread. The queue is not part of the analysis corpus and does not appear in public statistics. **Import my draft** opens the editor flow. Coverage details: `docs/DATA_DASHBOARD.md`.

## 4. Legal library and learning assistant

Use the **Document collection** tab to search titles/numbers/years and read documents. The **Search articles** tab looks for phrases across all sources. Article results have **Read in document** and **Ask about this article** buttons. **Compare articles** is available in the header of both tabs. Documents, questions and conversations stay when switching tabs.

Old `view=gallery` and `view=corpus` links still open the Legal library; the active URL uses `view=library`. The selected document/article is kept in the URL so it can be reopened after a reload.

1. Open **Legal library** in the sidebar, or http://127.0.0.1:8000/workspace?view=library.
2. Search a title or number/year such as `UU 25 tahun 2009`, or choose a UU/PP type.
3. Click a document card. The reader shows the title, promulgation date, source version, extracted articles/blocks and OCR needs. The selected document becomes the assistant's context.
4. Choose **Read article / block**, for example Pasal 4, and read the extracted quote. **Original text** downloads the source; **Enriched JSON** downloads metadata, articles and provenance; **Source page** opens the original site.
5. Click **Ask about this article** to fill in a question, then **Ask**. Suggested questions also fill the input first, so you can adjust them before the model is called.
6. The live assistant explains in plain English. Every part of the answer has a quote. Open **Quote → Open article context** to read the full text, page number and SHA256, and check the official source link.
7. Choose **Entire collection** for general topic questions. An explicitly mentioned regulation number/year takes priority over the selected document.
8. Use a follow-up question or write your own. After a successful answer about one regulation, the assistant's context moves to that regulation to help follow-ups.

Example questions:

- `What is UU 25/2009 about? Explain it for a beginner.`
- `What does Article 4 of UU 25/2009 mean?`
- `Explain Article 19 of UU 8/2016 in plain language.`
- `What does public service mean in this document?`
- `Which rights or obligations are mentioned in this quote?`
- `What is UU 10/2018 about?`

The last example tests the corpus limits: if a regulation is not in the collection, the assistant says the document is not available yet and never invents content or claims the regulation does not exist. Add verified sources through the ingestion pipeline to grow the collection.

In demo mode the assistant only shows source excerpts labelled **Demo · excerpt**. Dynamic explanations and analogies need Gemini live. The model uses the same Indonesian legal guidelines as the review feature; every source ID and quote text is checked by the server. The quote check ensures the text matches; it does not certify the legal interpretation.

Conversation history lives in the page session memory: it stays when switching menus, disappears on reload/close, and can be cleared with **Clear conversation**. Up to 20 turns are shown; at most three previous turns are sent to the model as context. Retrieved articles remain the legal source. Questions and source excerpts are sent to the provider in live mode; do not include unnecessary sensitive information.

If the model fails, the question stays in the input; **Try again** returns it for editing, then press **Ask**. There is no automatic fallback from live to demo results. Questions are limited to 3–2,500 characters. Reading or filtering documents does not call the model; live questions use provider quota/billing, and Elasticsearch adds embedding queries.

## 5. Draft in the editor

1. From Overview choose **New draft**. Choose one of 15 regulation types, a new regulation or an amendment, fill in the identity and basis, and click **Preview document**. Review its form, then **Create draft**. **Generate** accepts a policy brief for an AI-assisted first draft.
2. Fill in the title, type, scope and considerations. Write each provision as a separate article; article numbers must be unique.
3. Use the article list to navigate and edit chapters/articles. Amendments keep Pasal I/II; edit the replacement norms inside Pasal I. Open **Identity, closing, explanation & annexes** to complete the format, then **Save**. This section is included in the DOCX export.
4. Open the **Review**, **Sources**, **Simulation**, **Public** or **Agents** assistant tabs without leaving the editor.
5. **Focus mode** hides the assistant temporarily. Input is kept when the sidebar is collapsed or the assistant tab changes.

Import accepts TXT, JSON DraftInput, DOCX or text PDF up to 10 MB. In TXT/DOCX, each `Pasal 1` heading must be on its own line. Scanned PDFs need OCR before import. User drafts are separate from the source corpus: importing a draft does not add documents to the Legal library.

## 6. Review potential conflicts

Open **Policy Studio → Verify sources**, or use the Review tab in the draft assistant. Adjust the analysis date to check source time limits.

Review the finding's reasoning, draft text, proposed change, quotes, hierarchy, legal checks and alternative interpretations. Open the source before deciding. **Apply proposal** creates a new version; results from an older version cannot be applied until a re-check is done. Use reviewer notes to record verification and follow-up. Findings whose citations cannot be verified against the source text are dropped automatically and counted in the limitations.

An empty result does not prove the draft is conflict-free. The UU/PP relation is a starting point; authority, delegation, scope, exceptions, amendments and effective dates must still be considered. RuleLab never declares a regulation void.

## 7. A/B impact simulation

A uses the saved draft. Write alternative B and fill in applicants, digital access, assisted success, service cost and staff capacity. Click **Run simulation** in the draft assistant or **Policy Studio → Test impact**.

Access and cost numbers are computed from the input assumptions; the stakeholder narrative comes from the active provider. Check sensitivity and saved assumptions before comparing results. Starting inputs are examples, not Indonesian survey data. If the draft changes, run the simulation again so results match the latest version.

## 8. Public forum and network

Prepare alternative B and run **Collect agent opinions** in the Public tab of the editor or the AI public forum.

Choose 8, 16, 24 or 32 agents and 2–5 rounds before running the two A/B scenarios. The default 24 agents × 4 rounds gives 192 responses; the maximum 32 × 5 gives 320. Synthetic profiles follow the document's sector. Personas can reply to comments from earlier rounds in the same scenario. Use name/role search, issue/layer filters, zoom, fullscreen and replay to explore the network.

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

**Legal library:** open the Search articles tab to look for phrases, open the text/JSON, then choose two articles in **Compare articles**. Live mode adds AI analysis; demo only shows the source comparison and the initial hierarchy relation.

**Activity → Agent runs:** choose the scope you need, fill in the comparison/assumptions, start the job and open the tool trace. Queued/running/completed/failed/cancelled status is saved in the workspace. Cancelling is available to the owner or an admin. Agents compose review results; they never apply draft revisions automatically.

**Activity → Results & review:** results are bound to the version they ran on. Filter by run type, open details, add reviewer notes and view document versions. An older-version label means the draft has changed.

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
| Conversation | Switch menus and come back | The conversation stays; Clear conversation empties it. |
| Draft | Edit one article, save | Saved versions increase and history can be opened. |
| Review | Check, edit the draft, try an older proposal | Older proposals are disabled until re-checked. |
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
