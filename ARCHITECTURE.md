# Lipyum Partner Architecture

## Current Shell

The current production app still boots through `src/app.js`, which imports `src/legacyApp.js`. The legacy shell owns:

- device simulator markup,
- SVG sprite definitions,
- hash navigation controller bootstrap,
- bottom bar mount point,
- sheet/toast layer,
- several high-value legacy render functions.

This is a known V11 P0 migration debt. It is tracked by `V11_ARCHITECTURE_AUDIT.md` and `MIGRATION_STATUS.md`.

## Modular JS Layer

Many screens are no longer inline in `index.html`; they are modular page/component functions under:

- `src/pages/`
- `src/components/`
- `src/data/mockData.js`
- `src/utils/`

These pages still commonly return HTML strings. They are production-prototype compatible but are not final Vue SFC pages.

## Vue Foundation

Vue 3, Vite, Tailwind and the Vue UI Kit foundation exist under:

- `src/vue/`
- `src/vue/components/ui/`
- `src/vue/layouts/MobileLayout.vue`
- `src/vue/pages/`

At V11 hardening time, Vue remains island/preview/pilot level rather than the sole app runtime.

## Route Metadata

`src/utils/routeMeta.js` is the V11 route metadata registry. It centralizes:

- title,
- compact title,
- subtitle,
- header variant,
- leading/trailing action intent,
- bottom bar visibility,
- active bottom tab,
- CTA variant,
- parent route.

This registry is a stepping stone for the future single Vue Router app shell.

## Target Architecture

The final architecture should be:

- one Vue root app,
- Vue Router with `createWebHashHistory()`,
- Pinia or equivalent minimal UI state store,
- `App.vue` as app shell,
- `MobileLayout.vue` for simulator/safe-area/layout,
- `AppHeader`, `AppBottomBar`, `AppDrawer`, `AppSheet`, `AppModal`, `AppToast` as shared primitives,
- route pages as Vue SFC files,
- no active user route rendered by `legacyApp.js`,
- no active user route relying on large HTML string renderers.

## Quality Gate

V11 adds a hardening layer rather than claiming full migration. Use:

```bash
npm run test:quality-gate:v11
```

The audit intentionally passes only when the remaining full Vue migration debt is explicitly documented.
