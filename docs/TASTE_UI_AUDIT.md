# TasteSkill UI pass, RuleLab 1.3

Direction: preserve the red/white legal workspace and its information architecture; improve reading, hierarchy and task feedback with the existing React/Radix/Motion/Tailwind and native CSS stack.

Reference applied: TasteSkill's redesign-existing-projects skill, fetched on 12 October 2026 from https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/skills/redesign-skill/SKILL.md. The landing-oriented design-taste-frontend reference was also reviewed; landing-specific rules are not imposed on dense legal source readers.

## Baseline code audit

- Brand: #B42338 crimson, white panels, cool neutral canvas. Local Manrope UI and Cormorant Garamond document headings; logo retained.
- Routes and nine menu identities remain stable. Corpus evidence, input bindings, optimistic saves, inline simulation, opinion/source node selection and chat scope are functional patterns to retain.
- UI text is often 9–11px, including button labels, source metadata and navigation. Increase reading sizes and distinguish secondary text through spacing and weight.
- Sidebar uses one scrolling flex column, including footer, with layout-width transitions. Separate nav scrolling from footer and make collapsed touch targets at least 44px.
- Dashboard repeats equal boxed metrics and three equivalent workflow cards. Replace with a quiet statistics band and one principal document continuation alongside real review context.
- Landing hero contains a handcrafted illustrative product preview, mixed font-family emphasis and repeated identical feature cards. Use existing real source imagery; compose functions as unequal reading/editor/social sections with consistent CTA labels.
- Generic circular loading icon is superimposed on a document. Replace with a document-shaped skeleton and native indeterminate progress; retain actual pending state and focus/inert recovery.
- Gallery reader and bot are useful but metadata and citations are small; align their tools and increase reading contrast.
- Form failures rely mainly on transient toasts. Add persistent contextual field messages with aria-invalid and describedby; keep errors visible until that field changes.
- Existing reduced-motion handling is retained. No perpetual decorative animation, fake statistics, invented public sentiment or blanket consumer-style parallax.

## Intended changes

Typography tokens, restrained borders, documented radii (controls 8px, containers 14px), tabular numeric figures, clearer button hierarchy, pressed feedback, calm enter/dialog transitions, larger graph controls and conversation text. Light theme remains explicit to honor the requested red/white brand. Cormorant is reserved for legal document titles.

## Verification scope

Functional regression, CSS parsing and contrast calculations are run. Browser startup/rendering is attempted separately and its actual result is recorded in TEST_REPORT.md. Do not interpret DOM checks as visual layout verification or Lighthouse measurements.

## Applied outcome

Red/white brand, logo, nine destinations and workflow IDs were preserved. Main UI sizes were increased; navigation scroll is isolated from the footer and rail targets are 44px. Dashboard now shows the actual draft article/title, a flat statistics band and task rows. Legal reading and opinion text were enlarged. Field validation is persistent and accessible; input updates clear the matching field error. The circular loader was retired in favor of a document-shaped pending indicator.

The landing's source image is a rendered original UU 12/2011 page, not generated UI. The older manufactured product-preview markup/CSS was removed. All native icons are copied from the installed Lucide v0.468.0 data with ISC license; no new framework migration. `node scripts/build_icons.mjs` regenerates those assets after dependency installation.

104 backend tests, 57 DOM checks and 11 React component tests passed; browser render and Lighthouse were not available. Main contrast tokens passed 4.81–14.67:1. See TEST_REPORT.md for the actual bounds of validation.
