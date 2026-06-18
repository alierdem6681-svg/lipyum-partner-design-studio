# V12-C Core Visual Review

Generated: 2026-06-18T19:56:30.327Z

Feature URL: `http://127.0.0.1:56389/?engine=vue`
Viewport: `393x852`
Max diff ratio: `0.015`

| Route | Status | Severity | Diff ratio | Diff pixels | Golden | Feature | Diff |
|---|---|---|---:|---:|---|---|---|
| /calendar | PASS | OK | 0.010982 | 15676 | tests/golden-master/v11-stable/vercel/393x852/calendar.png | tests/golden-master/v12-feature-preview/core-diff/393x852/calendar.png | tests/golden-master/v12-feature-preview/core-diff/393x852/calendar.diff.png |
| /my-jobs | PASS | OK | 0.014621 | 20869 | tests/golden-master/v11-stable/vercel/393x852/my-jobs.png | tests/golden-master/v12-feature-preview/core-diff/393x852/my-jobs.png | tests/golden-master/v12-feature-preview/core-diff/393x852/my-jobs.diff.png |
| /jobs | FAIL | P1 | 0.016964 | 24214 | tests/golden-master/v11-stable/vercel/393x852/jobs.png | tests/golden-master/v12-feature-preview/core-diff/393x852/jobs.png | tests/golden-master/v12-feature-preview/core-diff/393x852/jobs.diff.png |

## Review Notes

- /calendar: P0/P1 visual issue yok.
- /my-jobs: P0/P1 visual issue yok.
- /jobs: P1 visual fark var; Golden parity tamamlanmadan V12-C tamamlanamaz.
