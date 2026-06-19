# V12-K2 Automated Gate Report

Status: FAIL

## Command

`npm run test:quality-gate:v12-k-automated`

## Passing Steps

- Dependency lock
- UTF-8 integrity
- Static design contract
- Vue style debt
- Runtime source contract
- Stable default runtime/design
- Vue preview explicit flag
- Vue preview shell parity
- Header actions and navigation back stack

## Failing Step

- Stable-to-Vue visual regression

## Latest Remaining Visual Failures

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

## Human Approval

Human design approval is no longer part of this automated gate.
