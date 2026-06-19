# V12 Visual Parity Report

Generated: 2026-06-18T17:27:21.419Z

Feature URL: `http://127.0.0.1:56389/?engine=vue`

| Route | Golden | Vue | Pixel fark | İçerik farkı | Interaction farkı | Durum |
|---|---|---|---:|---|---|---|
| /home | tests/golden-master/v11-stable/vercel/393x852/home.png | tests/golden-master/v12-feature-preview/393x852/home.png | diff | diff | diff | FAIL |
| /jobs | tests/golden-master/v11-stable/vercel/393x852/jobs.png | tests/golden-master/v12-feature-preview/393x852/jobs.png | diff | diff | diff | FAIL |
| /my-jobs | tests/golden-master/v11-stable/vercel/393x852/my-jobs.png | tests/golden-master/v12-feature-preview/393x852/my-jobs.png | diff | diff | diff | FAIL |
| /calendar | tests/golden-master/v11-stable/vercel/393x852/calendar.png | tests/golden-master/v12-feature-preview/393x852/calendar.png | diff | diff | diff | FAIL |

## Gate Decision

P0/P1 parity differences are present. The Vue core routes must not be activated as the default production route yet.

## Notes

- Pixel parity uses screenshot hashes from the frozen V11 Golden Master manifest.
- Content parity compares visible section lists and text length.
- Interaction parity compares visible button/action labels.
- A FAIL result is expected until each Vue SFC is visually matched to the Golden Master.

## V12-C Core Pixel Diff Update

`scripts/compare-core-visual-parity.mjs` now uses pixelmatch-based screenshot diff instead of exact hash equality. Latest result:

| Route | Content/action contract | Visual status | Diff ratio |
|---|---|---|---:|
| /home | PASS | FAIL P0 | 0.101071 |
| /jobs | PASS | FAIL P0 | 0.089986 |
| /my-jobs | PASS | FAIL P0 | 0.081611 |
| /calendar | PASS | FAIL P1 | 0.053301 |

V12-C remains incomplete until these visual differences reach the strict threshold.
