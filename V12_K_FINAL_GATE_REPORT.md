# V12-K Final Gate Report

Status: FAIL

## Passing Checks

- `npm run check`: PASS
- `npm test`: PASS
- `npm run test:dependency-lock`: PASS
- `npm run test:no-vue-style-debt`: PASS
- `npm run test:design-contract`: PASS
- `npm run test:quality-gate:stable-default`: PASS
- `npm run test:quality-gate:vue-preview`: PASS

## Failing / Blocked Checks

- `npm run test:design-review`: BLOCKED
  - Reason: PR #3 has no current-head approval by `alierdem6681-svg`.
- `npm run test:visual-regression:v12-k`: FAIL
  - Reason: strict pixel threshold `0.015` is exceeded on multiple header, bottom bar and drawer surfaces.
- `npm run test:quality-gate:v12-k`: BLOCKED/FAIL
  - Reason: it now includes trusted design review and strict visual regression.

## Gate Run 1 / Run 2

Two consecutive full V12-K gate runs were not executed because the first full gate cannot pass without current GitHub review and visual regression closure.
