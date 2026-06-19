# V12-K Stable Design Visual Review

Date: 2026-06-19
Branch: `feature/v12-golden-vue-cutover`

## Scope

Reviewed the current stable legacy classes and the Vue preview shell for these surfaces:

- Header: home and profile subpage.
- Bottom bar: home CTA and subpage CTA.
- Drawer: partner menu shell, profile/status cards and menu list.
- Profile: partner card, strength card and 4x2 profile shortcut grid.

Vue preview component/style implementation was adjusted in V12-K to recover stable profile, drawer, bottom bar and ticker contracts. No screenshot baseline set was generated.

## Measurement Method

Used local Windows Vite + Playwright/Chromium at 393x852, DPR 3, mobile touch mode. The contract is based on DOM structure, computed CSS and bounding boxes from the current local repo.

Primary source CSS:

- `src/styles/tokens.css`
- `src/styles/components.css`
- `src/styles/pages.css`
- `src/vue/styles/vue.css`

## Findings

Bottom bar parity is stable. Legacy and Vue preview use the same `bottom-nav`, `bottom-item`, `featured`, `cta-fab` and `cta-lightning-wrap` surface. The five item centers are symmetric and the CTA center is exactly the viewport center at 393px.

Drawer parity is stable after the 180ms open animation completes. Both runtimes use `.partner-menu`, `.drawer-profile-card`, `.drawer-work-status-card`, `.drawer-menu-card` and `.drawer-menu-item`; `.v-drawer-menu__item` is absent.

Profile visual geometry is stable. Vue preview renders the legacy `.partner-profile-card`, `.profile-strength-card` and `.profile-menu-grid` classes instead of generic `.v-profile-*` cards. Card widths, heights, avatar, score ring, checklist rows and 4x2 menu grid match the legacy measurements.

Header parity is layout-compatible. Home header action x positions and grid columns match; current measured shell height is 70px in legacy and 68px in Vue. Profile subpage action centers match, while legacy keeps the header inside the padded content width and Vue owns a full-width shell header.

## Known Non-Geometry Deltas

- Header background serialization may differ because Vue shell header is transparent over the shell background while legacy profile header computes to the page background.

The Vue profile shortcut labels were reconciled to full stable labels in V12-K. The V12-K tests focus on stable design contract geometry, class usage, touch targets, labels and overflow.

## Coverage Added

- `tests/e2e/stable-vue-shell-parity.spec.js`
- `tests/e2e/stable-design-default.spec.js`

The tests avoid image diff baselines and assert deterministic DOM/CSS geometry instead.
