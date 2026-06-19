# Lipyum Partner Final Release Contract

This document is the single product-scope source for the V13 fast-finish release.

## Runtime

- The active product runs on one Vue runtime.
- Vue Router owns navigation.
- Pinia owns shared UI state.
- Legacy runtime rollback is provided by Git tags and archive branches, not by an in-app engine switch.

## Active Product Routes

- `/home`
- `/profile`
- `/notifications`
- `/support`
- `/support/new`
- `/support/live`
- `/support/customer-service`
- `/messages`
- `/satisfaction`
- `/reviews`
- `/leaderboard`
- `/subscription`
- `/referral`
- `/referral/tasks`
- `/referral/partners`
- `/referral/partner/:id`
- `/referral-earnings`
- `/job-referral`
- `/partner-card-preview`
- `/photo-gallery`
- `/about`
- `/services`
- `/regions`
- `/working-hours`
- `/team`
- `/capacity`
- `/strategy`
- `/account-settings`
- `/notification-settings`
- `/contact-settings`
- `/bonus`
- `/performance-score`
- `/customers`
- `/invoices`
- `/income-expense`
- `/appointment-link`

## Blank Bottom Routes

These routes intentionally keep only the global header and bottom bar:

- `/jobs` - İş Al
- `/my-jobs` - İşler
- `/calendar` - Randevu
- `/wallet` - Cüzdan

No cards, filters, explanatory text, empty-state copy, or primary buttons are allowed on these routes.

## Retired Routes

Package routes are not active product routes:

- `/packages`
- `/package-builder`
- `/package-checkout`
- `/partner/packages`

All retired package URLs redirect to `/subscription`.

## Bottom Bar

Order and labels are fixed:

1. Ana Sayfa
2. İşler
3. İş Al
4. Randevu
5. Cüzdan

The center CTA must remain centered and symmetric across supported mobile widths.

## Release Blockers

P0 and P1 issues block release. P2 issues are tracked after release in `POST_RELEASE_BACKLOG.md`.
