# V12-C Core Interaction Report

Generated: 2026-06-18T18:20:00.000Z

## Summary

Core route content and extracted clickable contract now pass for:

- `/home`
- `/jobs`
- `/my-jobs`
- `/calendar`

The cleaned extractor only counts real actionable controls and ignores layout wrappers/offscreen decorative elements. Calendar appointment rows remain interactive in Vue but are marked out of the Golden first-viewport parity action count with `data-contract-ignore`.

## Outcome Registry

Outcome expectations are tracked in:

- `tests/contracts/V12_CORE_INTERACTIONS.json`

## Latest Contract Result

`npm run test:parity:core` passed for the four core routes.

## Remaining Blocker

V12-C is not complete because `test:parity:core:strict` still fails on visual regression:

- `/home`: P0 visual diff
- `/jobs`: P0 visual diff
- `/my-jobs`: P0 visual diff
- `/calendar`: P1 visual diff
