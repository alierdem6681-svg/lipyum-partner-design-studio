# V12-K2 Navigation Report

Status: PASS

## Fixed

- Added Vue runtime `window.navigateToPage`, `window.goBack` and `window.lipyumRouter` bridge.
- Added route-source aware navigation sync for app navigation, UI back and browser history.
- Added child-route fallback so direct referral partner detail back goes to `/referral/partners`.
- Added header action outcomes for notification settings, wallet info, info, status, credit, work plan, support and activate dispatch.
- Route changes now close active sheets.

## Validation

- `tests/e2e/v12-k2-shell-actions.spec.js`: PASS.
