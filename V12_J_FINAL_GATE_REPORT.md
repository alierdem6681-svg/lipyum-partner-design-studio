# V12-J Final Gate Report

Tarih: 19 Haziran 2026

## Gate

Komut:

```bash
npm run test:quality-gate:v12-j
```

## Debug Gate

- Durum: PASS
- Log: `artifacts/v12-j/debug-gate.log`

## Final Runs

| Run | Durum | Log | SHA256 |
| --- | --- | --- | --- |
| 1 | PASS | `artifacts/v12-j/final-gate-run-1.log` | `20BA450834198AC90A3F6B0E5F50B4D65F0269CC35A691F282C0BF6D44166D6C` |
| 2 | PASS | `artifacts/v12-j/final-gate-run-2.log` | `73BE838DAE567DEE0C1560453B393C13EAAA508CDE139B36C614ACB89F33A47F` |

## Home Product Golden

- URL: `/#/home`
- Baseline: `tests/golden-master/v12-product-final/home.png`
- Diff: `0.011193`
- Hedef: `<= 0.015`
- Durum: PASS

## Kapsam

- syntax
- lint/syntax
- architecture
- default Vue runtime
- explicit legacy rollback
- no legacy default boot
- Vue Router ownership
- route acceptance
- blank bottom routes
- retired redirects
- rich route outcomes
- Home Product Golden parity
- Home content/interaction contract
- accessibility
- clickable outcome coverage
- performance smoke
- build
- `git diff --check`
