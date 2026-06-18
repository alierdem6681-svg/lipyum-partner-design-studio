# User Requirements Traceability

Date: 2026-06-18

Scope: V12 Full Vue/Tailwind Cutover, Product Completion, Exhaustive Visual QA and Final Release Candidate.

This file is intentionally strict. A passing smoke or audit test is not treated as V12 completion when the underlying architecture still carries legacy runtime debt.

## Phase 0 Baseline

| Item | Status | Evidence |
| --- | --- | --- |
| Repository | verified | `alierdem6681-svg/lipyum-partner-design-studio` |
| Branch | verified | `main` |
| Starting local SHA before updating from origin | verified | `345adaa18f9e3ae7decf58166f729ca6748c745b` |
| Updated main SHA | verified | `945495a90f8318a7ccd3cd32ca57930cf98a86da` |
| Worktree state | in-progress | Dirty worktree exists; pre-existing changes were preserved and not reverted. |
| Pre-pull dirty backup | verified | `stash@{0}` named `v12-phase0-pre-pull-dirty-worktree`; older `autostash` also exists. |
| Baseline quality gate | verified | `npm run test:quality-gate` completed with `[quality-gate] all checks passed` before the origin fast-forward. |
| Build output in baseline gate | verified | `dist/index.html`, CSS `277.08 kB`, JS `329.98 kB`; Vite build passed. |
| Diff whitespace check in baseline gate | verified | `git diff --check` passed. |

## V12 Completion Blockers

| Blocker | Status | Evidence | Required resolution |
| --- | --- | --- | --- |
| Single Vue root app | pending | `src/app.js:1` still imports `./legacyApp.js`. | Replace legacy boot with one Vue `createApp(App)` root. |
| Vue Router owns active routes | pending | `src/vue/main.js` mounts Vue islands through `resolveVuePage`, not a complete root router shell. | Add Vue Router with `createWebHashHistory()` as the active app router. |
| Every active route is a Vue SFC | pending | `MIGRATION_STATUS.md` lists many routes as `Hayır` or `Kısmi/modüler JS`. | Convert all active routes to `.vue` pages. |
| No user route rendered by `legacyApp.js` | pending | `V11_ARCHITECTURE_AUDIT.md` says `App still boots legacy shell: yes` and `Active high-value legacy render functions present: yes`. | Remove user-visible route rendering responsibility from `legacyApp.js`. |
| Active routes independent from legacy CSS | pending | Current active UI still depends on `src/styles/components.css` and `src/styles/pages.css`. | Move active components to Tailwind/token/UI Kit; keep only reset/tokens/globals. |
| Real pixel visual regression | pending | Existing `visual-regression.spec.js` is a framed/nonblank smoke check, not baseline screenshot comparison with thresholds. | Add controlled screenshot baseline comparison and failure thresholds. |
| Clickable inventory verifies outcomes | in-progress | `CLICKABLE_INVENTORY_REPORT.md` counts visible clickables and unlabeled controls; dedicated flow tests cover many actions. | Expand inventory to click each critical control and assert expected state/route/result. |
| V12 gate passes twice unchanged | pending | Only one baseline quality gate was run in this turn. | Run the final V12 quality gate twice without code changes between runs. |
| No P0/P1 open issues | pending | `MIGRATION_STATUS.md` documents remaining P0/P1 migration debt. | Close or explicitly downgrade with proof; V12 completion cannot keep P0/P1. |

## User Requirement Matrix

Legend:

- `pending`: not implemented or not yet proven to V12 standard.
- `in-progress`: partially implemented or smoke-tested, but not V12-complete.
- `verified`: implemented with linked test and acceptable evidence.

| ID | Requirement | Status | Files / areas | Tests / visual proof | Acceptance evidence |
| --- | --- | --- | --- | --- | --- |
| UR-001 | Navbar sticky and standardized | in-progress | `src/components/Header.js`, `src/vue/components/ui/AppHeader.vue`, `src/styles/components.css` | `tests/e2e/header-consistency.spec.js`, screenshots | Header tests pass, but full Vue root cutover is pending. |
| UR-002 | Notifications header spacing/icon issue | verified | `src/pages/NotificationsPage.js`, header actions | `tests/e2e/notification-header.spec.js` | Baseline gate passed notification header test. |
| UR-003 | Wallet header right action | in-progress | `src/pages/WalletPage.js`, route metadata/header actions | `tests/e2e/routes.spec.js`, `tests/e2e/forms-and-filters.spec.js` | Works in smoke, but route is not Vue SFC. |
| UR-004 | Partner Davet title overflow | in-progress | Referral page/header styles | `tests/e2e/text-overflow.spec.js`, screenshots | Critical labels single-line test passes; referral remains legacy/modular debt. |
| UR-005 | Referral back stack issue | verified | `src/utils/navigation.js` | `tests/e2e/back-stack-stress.spec.js` | Baseline gate passed deeper back-stack stress. |
| UR-006 | Referral active filter top border issue | in-progress | Referral filter styles | screenshots in `tests/screenshots/` | Needs manual/pixel visual comparison before V12 verified. |
| UR-007 | MyJobs filter label clipping | in-progress | MyJobs filter/tab styles | `tests/e2e/text-overflow.spec.js`, mobile screenshots | Critical label test passes; page is not Vue SFC. |
| UR-008 | Profile `+2` badge one-way expansion | verified | Profile card/badge logic | `tests/e2e/profile-badges.spec.js` | Baseline gate passed route-local one-way expansion. |
| UR-009 | Sidebar `+2` behavior | pending | Sidebar profile/banner area | none specific | Needs explicit requirement clarification/test if still relevant. |
| UR-010 | Sidebar bottom spacing | in-progress | Sidebar drawer styles | `tests/e2e/sidebar.spec.js`, screenshots | Duplicate sticky support card test passes; full visual proof still smoke-level. |
| UR-011 | Sidebar support structure | verified | Sidebar menu data/routes | `tests/e2e/sidebar.spec.js`, `tests/e2e/support-ticket.spec.js` | Support entries and route opening tests passed. |
| UR-012 | Live support starts chat after 5 seconds | in-progress | Support live page | `tests/e2e/support-ticket.spec.js` | Route covered; exact 5-second chat timing needs dedicated assertion. |
| UR-013 | Home activity slider | in-progress | Home activity/market cards | `tests/e2e/home-flow.spec.js`, screenshots | Home actions pass; Home remains legacy-rendered. |
| UR-014 | CTA mist animation | verified | CTA FAB styles | `tests/e2e/cta-mist.spec.js` | Delayed, clipped, reduced-motion tests passed. |
| UR-015 | Profile grid width and geometry | verified | Profile grid styles | `tests/e2e/profile-grid-geometry.spec.js` | 320/360/390/430 geometry tests passed. |
| UR-016 | Shared Partner Profile Card | in-progress | Partner profile/card preview components | `tests/e2e/routes.spec.js`, screenshots | Preview route exists; reusable Vue SFC/UI Kit completion pending. |
| UR-017 | Public card / share / embed system | in-progress | Partner card preview/share panel | `tests/e2e/modal-sheet-drawer.spec.js`, screenshots | Panel opens/closes; real public/embed readiness needs stronger coverage. |
| UR-018 | Visual QA Automation | in-progress | `VISUAL_QA_REPORT.md`, visual specs | `tests/e2e/visual-qa-report.spec.js`, `tests/e2e/visual-regression.spec.js` | Smoke checks pass; true pixel regression pending. |
| UR-019 | Full Vue migration | pending | `src/app.js`, `src/vue/*`, pages | `tests/v11-audit.mjs` | Explicit P0 blocker: legacy shell still boots. |
| UR-020 | Full Tailwind migration | pending | `tailwind.config.cjs`, active CSS/pages | none final | Active UI still uses legacy CSS and JS renderers. |
| UR-021 | Full component/UI Kit migration | pending | `src/vue/components/ui/*`, legacy components | `tests/e2e/v10-quality-automation.spec.js` | UI Kit exists, but active app is not fully cut over. |
| UR-022 | Deep link readiness | verified | `src/utils/deepLinks.js`, docs | `tests/e2e/deeplinks.spec.js` | Baseline gate passed deeplink tests. |
| UR-023 | Satisfaction flow | verified | Satisfaction page/flow docs | `tests/e2e/satisfaction.spec.js` | 5-star and low-rating flows passed. |
| UR-024 | Talep Oluştur | verified | Support ticket page/routes | `tests/e2e/support-ticket.spec.js` | Sidebar route and mock ticket flow tests passed. |
| UR-025 | Packages/subscription flows | in-progress | Packages/subscription/builder/checkout pages | `tests/e2e/packages-flow.spec.js` | Mock flow is clickable; pages still not Vue SFC per migration status. |
| UR-026 | Jobs/MyJobs/Calendar | in-progress | Jobs/MyJobs/Calendar pages | route/mobile/bottom-bar tests | Routes work; migration status says Vue page = `Hayır`. |
| UR-027 | HomePage | in-progress | Home route/page | `tests/e2e/home-flow.spec.js`, screenshots | Home flow passes; migration status says Vue page = `Hayır`. |
| UR-028 | Cüzdan action/card behavior | in-progress | Wallet summary/actions | `tests/e2e/forms-and-filters.spec.js`, route tests | Load-more and route smoke pass; full Vue/UI Kit pending. |
| UR-029 | Leaderboard encouragement/visual polish | in-progress | Leaderboard components/styles | `tests/e2e/forms-and-filters.spec.js`, screenshots | Recent visual updates are present in dirty worktree; need final screenshot review. |
| UR-030 | Reviews card layout and report button | in-progress | Reviews page/cards | `tests/e2e/forms-and-filters.spec.js`, screenshots | Filters/reply controls pass; current requested CTA removal was already on origin. |
| UR-031 | V12-C core Golden parity for Home/Jobs/MyJobs/Calendar | in-progress | Vue preview core route pages and parity scripts | `npm run test:parity:core`, `npm run test:parity:core:strict` | Content/action contract PASS; strict visual parity still FAIL, so V12-C is not complete. |
| UR-032 | MyJobs filter label must show `Tamamlananlar` fully | verified | `src/vue/pages/MyJobsPage.vue`, `src/vue/styles/vue.css` | `npm run test:parity:core` | Latest user requirement overrides old Golden `Tamamlanan`; chip fits in 393px viewport. |

## Quality Gate Evidence From Baseline Run

The following groups were observed passing in the `npm run test:quality-gate` baseline run:

- `check`
- `lint`
- `test`
- `test:routes`
- `test:e2e`
- `test:e2e:mobile` with 336 mobile route checks
- `test:accessibility`
- `test:interactions`
- `test:sidebar`
- `test:bottom-bar`
- `test:navigation-contract`
- `test:forms`
- `test:device-matrix`
- `test:performance`
- `test:visual-alignment`
- `test:deeplinks`
- `test:satisfaction`
- `test:home-flow`
- `test:packages-flow`
- `test:referral-flow`
- `test:support-ticket`
- `test:profile-badges`
- `test:clickable-inventory`
- `test:visual-regression`
- `test:visual-qa-report`
- `test:text-overflow`
- `test:touch-targets`
- `test:header-consistency`
- `test:back-stack-stress`
- `test:modal-sheet-drawer`
- `test:all-routes-interactions`
- `test:v10-quality-automation`
- `test:cta-mist`
- `test:notification-header`
- `test:profile-grid-geometry`
- `test:v11-audit`
- `test:screenshots`
- `build`
- `git diff --check`

## V12 Next Required Work

1. Replace legacy boot with a single Vue root app and Vue Router hash history.
2. Convert active routes in `MIGRATION_STATUS.md` from `Hayır`/`Kısmi` to real Vue SFC pages.
3. Remove user-visible route rendering from `legacyApp.js`.
4. Move active UI from legacy CSS/page-specific CSS to Tailwind + tokens + Vue UI Kit.
5. Upgrade visual regression from nonblank/framing smoke to baseline screenshot comparison.
6. Upgrade clickable inventory from count/report to click-and-assert outcome coverage.
7. Run the final V12 quality gate twice with no code changes between runs.

## V12-C Traceability Note

Core route contract work improved `/home`, `/jobs`, `/my-jobs`, and `/calendar` to content/action PASS in Vue preview. Visual parity remains open and blocks completion.

## Completion Statement

V12 is not complete at this checkpoint. Phase 0 baseline, origin synchronization and traceability have been started, but the core V12 cutover blockers remain open.
