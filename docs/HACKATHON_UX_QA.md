# Hackathon UI and interaction fixes

The workspace keeps its red/white identity and existing FastAPI, React-island and native JavaScript architecture. The demo now uses consistent dropdowns, responsive menu layouts and source-backed result states.

## Bugs fixed

- The delegated click handler previously matched `body[data-view]`. Clicking an input, native select, source disclosure, or other ordinary control could navigate and rebuild the current page. Only actual navigation buttons/links and action controls are now matched.
- `#modal` had `display: flex !important` even when closed. Long dialogs could continue covering controls after closing. The flex layout now applies only to `#modal[open]`.
- The synthesis subtab attempted to read assumptions and alternative fields that did not exist in that subtab. Simulation can now use the scenario state from any subtab.
- Synthesis displayed hardcoded access/cost figures, unsupported legal conclusions and assumed positive persona sentiment before any run. It now displays empty states until results exist and renders actual saved runs, mitigations and snapshot versions.
- Changing gallery chat scope now updates the scope badge. Article picker changes restore focus after the new controls have mounted.
- Draft selection loads the draft, runs and jobs before committing the new selection, rolls the control back on failure, and preserves the selected draft in the URL. Reload and browser Back/Forward follow that state.
- Adding an article handles nonnumeric article labels without producing `NaN`. Assumption validation now identifies and focuses the invalid field. Review report export is unavailable until an analysis exists.
- Agent launch controls stay disabled while an existing job is active. A form switch no longer accidentally bypasses that state when its action completes.

## Interaction and visual changes

Every workspace menu uses a shared layer for controls, spacing, focus, buttons, dialogs and reading sizes. Sidebar navigation becomes a scrollable horizontal menu at mobile/tablet widths; the header avoids overflowing on narrow screens. Simulation tabs keep the selected tab in view and support arrow/Home/End navigation.

The dropdown enhancement preserves original select values and input/change events. It provides top-layer popovers, search for long option lists, keyboard selection, Escape, outside-click dismissal, disabled/validation state synchronization and correct positioning inside native dialogs. Browsers without popover support use the original native selects. Regulation types include explanatory labels; document context options show full titles. Dynamic dependent article selectors update without losing their event bindings.

Ctrl/Cmd+S saves through the existing guarded action. Ctrl/Cmd+K opens menu search. Reduced motion is respected. No external fonts, new runtime CDN, or AI credential is needed for these changes; the rebuilt React bundle is included.

## Validation

| Check | Result |
| --- | --- |
| TypeScript and production build | Passed |
| React components | 11 passed |
| DOM workflow regression | 56 checks passed |
| Chromium hackathon journey | Passed, 16 journey groups |
| Chromium existing regression | Passed, 33 journey groups |
| Responsive layout | All eight workspace destinations at 360, 390, 768, 1024 and 1440px; populated projection/forum/synthesis at 360, 390 and 768px |
| Browser runtime errors in hackathon journey | None |
| Backend suite | 104 passed; one pre-existing source-integrity failure |
| Diff whitespace and JavaScript syntax | Passed |

Browser suites run in demo mode against a fresh temporary SQLite database. Coverage includes simulation from each subtab; dropdown keyboard/search/selection/focus; inline analysis; review notes and DOCX; corpus pagination/filter/search/source comparison; gallery reader/chat/citations; forum and agent execution; integration demo probe; legal guide and audit dialogs; new/switch/reload draft; Back/Forward; generation/import/export; article add/remove; command menu; and reduced motion. Browser automation uses Playwright's CSP bypass for evaluation helpers; application CSP is unchanged.

### Known baseline issue

`tests/test_data_ai.py::test_corpus_integrity` fails for the stored UU 25/2009 raw source. The raw file and metadata are identical to base commit `91c5877`; this change does not rebind provenance or modify legal sources.

- Metadata SHA256: `60e640cd8305768c7ea81c50a84eb6b79d16e8e7575ceaf0e265fce0b9b23931`
- Raw file SHA256: `244cbe9a0ae056d21e71b7ac83f43cb11a89de6ebda0f613f8e95778dc992100`

Live Gemini/Vertex access was not exercised because no service account/API credentials were supplied. Backend adapter tests remain covered by the existing suite.

## Run locally

```bash
npm ci
npm ci --prefix frontend
npm run frontend:build
npm run frontend:test
npx playwright install chromium
RULELAB_PYTHON=.venv/bin/python npm run test:demo
RULELAB_PYTHON=.venv/bin/python npm run test:browser
RULELAB_PYTHON=.venv/bin/python npm run test:dom
.venv/bin/python -m pytest tests -q
```

Use `./start.sh` to install Python dependencies and start the application for a manual demo. If using a different Python environment, set `RULELAB_PYTHON` to its executable for browser/DOM tests. The existing root-level `test_modal.py` is a separate manual Playwright script and is not part of the `tests/` backend suite.

Screenshots from the actual Chromium run are under `screenshots/hackathon-ux/`. Full browser QA output is generated locally under ignored `artifacts/demo-qa/`.
