# V12-K2 Visual Parity Report

Status: FAIL

## Latest Automated Visual Regression

- Command: `npm run test:visual-regression:v12-k`
- Result: FAIL
- Surfaces checked: 34
- Contact sheet: `artifacts/v12-k-final/visual-regression/V12_K_DESIGN_APPROVAL_CONTACT_SHEET.png`

## Current Key Ratios

- Home header: PASS
- Home bottom bar: PASS
- Profile header: PASS
- Profile bottom bar: PASS
- Profile card: `0.004743` PASS
- Profile strength: `0.000646` PASS
- Profile grid: `0.021783`
- Notifications header: `0.083859`
- Leaderboard header: `0.056724`
- Subscription header: `0.069738`
- Subscription bottom bar: `0.044785`
- Referral header: `0.095220`
- Jobs header: `0.023678`
- My Jobs header: `0.023748`
- Calendar header: `0.039506`
- Wallet header: `0.035698`
- Drawer: `0.025661`

## Remaining

Strict visual parity is not closed. Shared home/profile shell improved, but special route headers, drawer, subscription bottom bar and profile grid remain above the `0.015` threshold. P0/P1 visual issue count is not zero.
