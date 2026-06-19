# Preview Parity Report

Date: 2026-06-18 14:40 UTC

## Compared Targets

| Target | URL | Source |
| --- | --- | --- |
| Cloudflare local preview | `https://vehicles-movies-ministry-presenting.trycloudflare.com` | `/home/alierdem6681/lipyum-stable-preview`, Vite dev server on port `56387` |
| Vercel stable | `https://lipyum-partner-design-studio.vercel.app` | production deployment from `origin/main` |

Stable SHA:

```text
ef4a21545cd7112a4fef5d41c58fae4c0bac4f70
```

## Screenshot Set

Screenshots were captured with Playwright Chromium at viewport `393x852`, device scale factor `2`.

```text
/home/alierdem6681/preview-screenshots/2026-06-18T14-35-46-127Z/
```

Captured routes:

```text
/
/#/home
/#/profile
/#/wallet
/#/notifications
/#/leaderboard
/#/reviews
```

Full machine-readable result:

```text
/home/alierdem6681/preview-screenshots/2026-06-18T14-35-46-127Z/parity.json
```

## Route Results

| Route | Tunnel status | Vercel status | Console errors | Page errors | Horizontal overflow | Header visible | Bottom bar visible | Text length match |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| `/` | 200 | 200 | 0 / 0 | 0 / 0 | no / no | yes / yes | yes / yes | yes |
| `/#/home` | 200 | 200 | 0 / 0 | 0 / 0 | no / no | yes / yes | yes / yes | yes |
| `/#/profile` | 200 | 200 | 0 / 0 | 0 / 0 | no / no | yes / yes | yes / yes | yes |
| `/#/wallet` | 200 | 200 | 0 / 0 | 0 / 0 | no / no | yes / yes | yes / yes | yes |
| `/#/notifications` | 200 | 200 | 0 / 0 | 0 / 0 | no / no | yes / yes | yes / yes | yes |
| `/#/leaderboard` | 200 | 200 | 0 / 0 | 0 / 0 | no / no | yes / yes | yes / yes | yes |
| `/#/reviews` | 200 | 200 | 0 / 0 | 0 / 0 | no / no | yes / yes | yes / yes | yes |

## Pixel Hash Note

PNG hashes are not byte-identical between Cloudflare and Vercel. This is expected because Cloudflare is serving the Vite development runtime (`/@vite/client`) while Vercel serves production-built assets (`/assets/...`). Functional parity checks passed: status, route hash, document title, text length, console/page errors, horizontal overflow, header visibility, and bottom bar visibility.

## Health Checks

```text
Cloudflare /health.txt -> OK Lipyum Partner
Vercel /health.txt     -> OK Lipyum Partner
Local /health.txt      -> OK Lipyum Partner
```

## Conclusion

The Cloudflare tunnel now serves stable `origin/main` from the clean stable worktree and is functionally aligned with Vercel for the checked routes. V12-A work is no longer being served by the stable Cloudflare URL.

