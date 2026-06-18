# Version History

## v12-golden-preview

- Date: 2026-06-18
- Branch: `feature/v12-golden-vue-cutover`
- Default boot: V11 stable legacy runtime remains active.
- Feature preview: `?engine=vue`
- Core Vue preview routes: `/home`, `/jobs`, `/my-jobs`, `/calendar`
- Visual parity: FAIL for all four core routes; production cutover blocked.
- Reports: `V12_VISUAL_PARITY_REPORT.md`, `V12_RELEASE_REPORT.md`

## v11-stable

- Date: 2026-06-18
- SHA: `ef4a21545cd7112a4fef5d41c58fae4c0bac4f70`
- Tag: `v11-stable`
- Archive branch: `archive/v11-stable`
- Quality gate: passed (`npm run build && npm run test:quality-gate:v11`)
- Golden Master: `tests/golden-master/v11-stable/GOLDEN_MASTER_MANIFEST.json`
- Screenshot count: 256

This version is the immutable visual baseline for V12 Golden Master work.
