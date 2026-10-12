# Component framework 1.0

React 19, TypeScript, Vite, Tailwind 4 without preflight, Radix Dialog/Tooltip, Motion and Lucide remain in use. Dependency versions are locked. The design is a product-specific composition; it does not copy a marketplace template.

## Active components

- Sidebar: grouped destinations, labelled icons, persistent folding, white surface.
- Dashboard: real workspace counts, draft collection, review queue, workflow entry points.
- Command menu: keyboard search, Arrow/Enter/Escape, save-aware navigation, guard against existing native dialogs or busy workflows.
- Document context: selected draft, revision and save state.
- Buttons/badges: compatible primitive conventions using CVA, clsx and tailwind-merge.

Editor inputs, graph, API action handlers and tours retain their established modules. React roots for page content are unmounted before page replacement. Persistent navigation roots are retained. Polling agent jobs does not replace editor inputs.

`app/static/design.css` owns appearance. React's utility stylesheet does not reset existing forms. Decorative beam, shimmer and hover-glow components have been retired in the remake.

## Reference history

21st.dev (https://21st.dev/), Magic UI (https://magicui.design/), shadcn (https://ui.shadcn.com/docs/installation/vite) informed the earlier component architecture. The policy dashboard reference (https://dribbble.com/shots/27388009-AI-Dashboard-Design-for-Control-AI-Policy-Platform) informs the network/inspector interaction, with RuleLab's red/white palette retained. No premium source, reference screenshot or third-party example data is embedded in the product.

Production dependency licenses are included in `app/static/framework/THIRD_PARTY_NOTICES.txt`.

## Build and check

Application runtime still needs only Python dependencies and `start.sh`. Prebuilt JS/CSS are included.

For component development, Node 22 or newer:

```sh
cd frontend
npm ci
npm run build
npm test -- --pool=forks --maxWorkers=1 --minWorkers=1
```

For DOM integration, after frontend dependencies are installed:

```sh
npm run test:dom
```

The DOM runner uses frontend/node_modules/jsdom by default. Set RULELAB_JSDOM to an absolute module path only when using a separate test environment.

For actual local browser screenshots:

```sh
npm install
npx playwright install chromium
npm run screenshots
```

`capture_ui.cjs` starts an isolated demo server and creates review, impact and social runs in a temporary SQLite database. It captures the landing and all eight menus on desktop/mobile, plus focus/folded editor, command menu, guide, opinion/source inspectors and loading. Output: `screenshots/v1.0/`. It checks mobile overflow and browser JavaScript errors. No live AI credentials are needed.

## Validation limit

Production build, 11 component tests, 35 DOM integration checks and 60 backend tests passed for the remake. CSS was parsed with Lightning CSS and JavaScript/Python syntax checked.

The current environment cannot start the installed Chromium. Actual browser layout, animation, focus trapping and screenshot verification are still pending. The screenshot runner is supplied for local execution; archived screenshots depict older versions, never 1.0.
