# Lipyum Partner Design System

The active UI is managed through Vue components, shared tokens, Tailwind entrypoints, and the Vue UI Kit.

## Sources

- Tokens: `src/styles/tokens.css`
- Tailwind entry: `src/styles/tailwind.css`
- Platform rules: `src/styles/base.css` and `src/styles/layout.css`
- Shared UI components: `src/vue/components/ui/`
- Shared shell: `src/vue/layouts/AppShell.vue`

## Rules

- Do not add random hex colors in Vue templates.
- Do not add inline style bindings in Vue templates.
- Do not create route-specific header or bottom-bar hacks.
- Fix shared shell issues in shared components first.
- Keep bottom bar labels and order fixed by `BOTTOM_TABS`.
- Keep package routes retired.
- Keep `/jobs`, `/my-jobs`, `/calendar`, and `/wallet` blank.

## Visual Priority

1. Approved premium Lipyum product design.
2. Final release contract.
3. Shared token and UI Kit consistency.
4. Route-specific content needs.

P0/P1 visual issues block release. P2 visual differences are tracked after release.
