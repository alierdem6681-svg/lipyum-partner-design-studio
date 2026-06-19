# Rollback Guide

## Current Stable Baseline

- Version: `v11-stable`
- SHA: `ef4a21545cd7112a4fef5d41c58fae4c0bac4f70`
- Tag: `v11-stable`
- Archive branch: `archive/v11-stable`

## Safe Rollback Flow

Do not rollback directly on `main`. Create a restore branch:

```bash
git fetch origin --prune
git switch -c restore/v11-stable-$(date +%Y%m%d-%H%M%S) v11-stable
npm ci
npm run build
npm run test:quality-gate:v11
```

After visual and test approval, open a PR from the restore branch.

## Verification

- `/health.txt` must return `OK Lipyum Partner`.
- Root `/` must return `index.html`.
- `/#/home` must route correctly.
- Golden Master screenshots must match `tests/golden-master/v11-stable/`.
