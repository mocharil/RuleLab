# Workspace UX 1.0

## Navigation

Desktop sidebar: 246px normally, 72px folded. Folding preference remains in `rulelab.sidebarFolded`. Navigation never replaces unsaved editor fields. Mobile uses a scrollable horizontal navigation with all seven destination buttons; the home button is separate.

Ctrl/Cmd+K opens the Radix command menu. Search, Arrow/Enter/Escape, labelled options and focus restoration are supported. Existing workflow dialogs and busy actions prevent opening the command menu.

## Editor

Policy Studio (see `docs/POLICY_STUDIO_REVAMP_STRATEGY.md`) keeps one sticky document bar on every stage: draft switcher, save state, the stage's primary action and a More menu (Arrow/Home/End/Escape). The stage stepper uses Arrow/Home/End like other tablists.

The Draft stage has an outline (articles with finding counts), the document, and an Insights rail that follows the focused article. The rail re-renders on its own, so editing never replaces document inputs; becoming dirty disables older proposals with a written reason. `rulelab.editorFocus` stores focus mode, which hides the outline and insights through a body class; a visible "Focus mode · Exit" chip in the bar turns it off. Draft title/clauses still use existing save-aware handlers and optimistic revisions.

Verify sources is master–detail (J/K or arrows move between findings); Test impact compares A/B only when B differs from the draft.

## Help

All eight destinations have a contextual guide. The header help control starts a native dialog tour with actual target highlighting, Next/Previous/Close/Escape and focus restoration. The quick guide lives at the end of the page to preserve task space; Overview and the Policy Studio stages show it only through the help control. The legal rulebook is a separate action on the application footer and in the source assistant.

## Loading and errors

The existing loading coordinator delays the progress dialog by 180ms, preserves focus, marks content busy/inert, prevents duplicate submissions and restores state on error. Visual treatment is a document indicator, spinner, skeleton and indeterminate bar. No fake percent or fabricated AI results. Reduced motion disables animation.

## Verification

35 DOM integration checks and 11 React component tests pass. These verify state/action contracts, not CSS layout or browser focus trapping. The new browser capture runner covers landing, eight menus, mobile overflow, folded/focus editor, command, guide, social inspector and loading when run locally with Playwright.
