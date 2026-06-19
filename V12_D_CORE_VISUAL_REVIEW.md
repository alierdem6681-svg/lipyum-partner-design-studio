# V12-D Core Visual Review

Generated: 2026-06-18T20:00:00Z

Scope: `/calendar`, `/my-jobs`, `/jobs`, `/home`

Status: Closed by user instruction with remaining non-PASS work documented.

## Summary

V12-D started from commit `2a5354686785a7b1b60f3a2b8d917f1455ee673e`.

Backup verification:

- Annotated tag target `v12-c-content-parity^{}`: `2a5354686785a7b1b60f3a2b8d917f1455ee673e`
- Archive branch `archive/v12-c-content-parity`: `2a5354686785a7b1b60f3a2b8d917f1455ee673e`
- Release manifest: `releases/v12-c-content-parity/RELEASE_MANIFEST.json`

Golden Master baseline was not changed. Default Vue boot was not enabled. Main was not merged.

## Route Results

| Route | Start diff | Final diff | Visual status | Contract status | Notes |
| --- | ---: | ---: | --- | --- | --- |
| `/calendar` | `0.053301` | `0.010982` | PASS | PASS | Calendar geometry, rows, header/bottom shell and spacing were tightened under the `0.015` threshold. |
| `/my-jobs` | `0.081611` | `0.014621` | PASS | PASS | Filter rail, chip clipping, selected border and card rhythm were brought under the `0.015` threshold. |
| `/jobs` | `0.089986` | `0.016964` | FAIL P1 | FAIL P1 | Visual diff is close to threshold but still above it; route contract fails only on content height (`golden 987`, `feature 906`, tolerance `79`). |
| `/home` | `0.101071` | Not rerun | Skipped | Not rerun | Home was not attempted in this closure pass after the user instructed to skip topics that could not be made PASS and finish reporting. |

## Manual Review Notes

### `/calendar`

- P0/P1 visual issue: none after retest.
- Diff screenshot: `tests/golden-master/v12-feature-preview/core-diff/393x852/calendar.diff.png`
- Feature screenshot: `tests/golden-master/v12-feature-preview/core-diff/393x852/calendar.png`

### `/my-jobs`

- P0/P1 visual issue: none after retest.
- `Tamamlananlar` remains fully readable.
- Active filter border remains visible on all sides.
- Diff screenshot: `tests/golden-master/v12-feature-preview/core-diff/393x852/my-jobs.diff.png`
- Feature screenshot: `tests/golden-master/v12-feature-preview/core-diff/393x852/my-jobs.png`

### `/jobs`

- Remaining severity: P1.
- Root cause: page density/content-height mismatch versus Golden Master. Card/action counts match; the route is visually too compact in total height.
- Final diff ratio: `0.016964`, threshold `0.015`.
- Contract blocker: `contentHeight` only.
- Diff screenshot: `tests/golden-master/v12-feature-preview/core-diff/393x852/jobs.diff.png`
- Feature screenshot: `tests/golden-master/v12-feature-preview/core-diff/393x852/jobs.png`

### `/home`

- Not closed in V12-D.
- Previous known V12-C visual diff: `0.101071` P0.
- Must remain V13 scope unless work resumes.

## Commands Run

- `V12_CORE_ROUTES=/calendar,/my-jobs,/jobs node_modules/node/bin/node scripts/compare-core-visual-parity.mjs`
  - `/calendar`: PASS
  - `/my-jobs`: PASS
  - `/jobs`: FAIL P1
- `node_modules/node/bin/node scripts/report-route-contract.mjs --routes=/calendar,/my-jobs,/jobs --strict`
  - `/calendar`: PASS
  - `/my-jobs`: PASS
  - `/jobs`: FAIL P1 (`contentHeight`)

## Not Run In Final Closure

The following were not run after the user's instruction to skip non-PASS topics and finish reporting:

- `/home` strict visual retest
- `test:parity:core:strict`
- `test:quality-gate:v12-c`
- full existing Quality Gate
- two consecutive unchanged final gate runs
- PR description update
- production deploy

## Final Assessment

V12-D strict completion criteria are not fully met.

Closed state:

- Calendar visual parity: PASS
- MyJobs visual parity: PASS
- Jobs visual parity: FAIL P1, close to threshold
- Home visual parity: skipped/not closed

V12-D should be considered a documented partial closure, not a Golden Master visual lock.
