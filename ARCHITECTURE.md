# Lipyum Partner Architecture

Date: 2026-06-19

## Runtime

The active application is a single Vue runtime:

- `index.html` loads `src/app.js`.
- `src/app.js` resolves deep links, marks `data-runtime="vue"`, and mounts `src/vue/main.js`.
- `src/vue/main.js` creates `createApp(App)`, installs Pinia, installs Vue Router, and mounts `AppShell`.
- Rollback is handled with Git tags and archive branches, not with `?engine` query switches.

## Navigation

- Vue Router with `createWebHashHistory()` owns route navigation.
- `AppShell.vue` is the shared mobile shell and renders `RouterView`.
- Global navigation compatibility is kept as a thin bridge for existing interactions, but active route ownership remains Vue Router.

## Product Scope

The final product scope is frozen in `FINAL_RELEASE_CONTRACT.md`.

Retired package routes redirect to `/subscription`.
Blank bottom routes remain empty:

- `/jobs`
- `/my-jobs`
- `/calendar`
- `/wallet`

## Production

GitHub Pages is the canonical production platform:

https://alierdem6681-svg.github.io/lipyum-partner-design-studio/

Vercel and Cloudflare are not part of the active release process.
