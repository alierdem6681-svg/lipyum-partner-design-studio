# Deep Link Readiness

Lipyum Partner currently runs as a backend-free clickable mobile UI prototype. Native Universal Links/App Links are not activated yet because the real Apple Team ID, bundle ID, Android package name and signing fingerprints are not available.

## Supported UI Mappings

| External shape | App route |
| --- | --- |
| `/partner/home` | `#/home` |
| `/partner/wallet` | `#/wallet` |
| `/partner/reviews` | `#/reviews` |
| `/partner/support` | `#/support` |
| `/partner/support/new` | `#/support/new` |
| `/partner/support/live` | `#/support/live` |
| `/partner/referral` | `#/referral` |
| `/partner/job-referral` | `#/job-referral` |
| `/partner/packages` | `#/packages` |
| `/partner/satisfaction` | `#/satisfaction` |
| `/partner/card` | `#/partner-card-preview` |
| `?route=/wallet` | `#/wallet` |
| `?deeplink=support-new` | `#/support/new` |
| `?deeplink=support-live` | `#/support/live` |
| `?deeplink=partner-card` | `#/partner-card-preview` |

Unknown routes fall back to `#/home`.

## Implementation Notes

- `src/utils/deepLinks.js` resolves query and path based deep links before the hash router initializes.
- `vercel.json` rewrites `/partner/:path*` to `index.html` so direct path links can boot the SPA shell.
- Placeholder files live under `public/.well-known/` for future native-link setup.

## Production TODO

- Replace placeholder Apple and Android association files with real app identifiers.
- Add verified store IDs/package names once the native shells exist.
- Connect push notification payload route mapping to the same resolver.

## V11 Verification

V11 keeps `test:deeplinks` in the quality gate. `/support/live`, `/partner-card-preview`, `/support/new`, `/wallet`, `/reviews`, `/packages` and unknown fallback behavior must stay green before release-candidate handoff.
