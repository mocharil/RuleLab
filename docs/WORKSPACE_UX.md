# Workspace UX 1.0

## Navigation

Desktop sidebar: 246px normally, 72px folded. Folding preference remains in `rulelab.sidebarFolded`. Navigation never replaces unsaved editor fields. Mobile uses a scrollable horizontal navigation with all seven destination buttons; the home button is separate.

Ctrl/Cmd+K opens the Radix command menu. Search, Arrow/Enter/Escape, labelled options and focus restoration are supported. Existing workflow dialogs and busy actions prevent opening the command menu.

## Editor

`rulelab.editorFocus` stores focus mode. It hides the assistant through layout classes, leaving document input nodes intact. The button can restore the assistant. Draft title/clauses still use existing save-aware handlers and optimistic revisions. Editing updates the document context to unsaved. Selected article navigation is marked when its textarea receives focus.

Assistant tabs remain simulation, review, sources, netizen and agents. Arrow/Home/End navigate the tabs through the existing handler, which collects unsaved editor text before rerendering the page. Agent polling refreshes agent outputs without replacing the editor.

## Help

All eight destinations have a contextual guide. The header help control starts a native dialog tour with actual target highlighting, Next/Previous/Close/Escape and focus restoration. The quick guide lives at the end of the page to preserve task space. The legal rulebook is a separate action on the application footer and in the source assistant.

## Loading and errors

The existing loading coordinator delays the progress dialog by 180ms, preserves focus, marks content busy/inert, prevents duplicate submissions and restores state on error. Visual treatment is a document indicator, spinner, skeleton and indeterminate bar. No fake percent or fabricated AI results. Reduced motion disables animation.

## Verification

35 DOM integration checks and 11 React component tests pass. These verify state/action contracts, not CSS layout or browser focus trapping. The new browser capture runner covers landing, eight menus, mobile overflow, folded/focus editor, command, guide, social inspector and loading when run locally with Playwright.
