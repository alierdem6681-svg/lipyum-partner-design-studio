# Lipyum Partner Quality Gate

## Daily Development Line

Daily development runs a scoped local gate and never performs production deployment:

```bash
npm run dev:gate
```

The scoped gate detects committed, uncommitted and untracked file changes, selects a free Playwright port automatically, keeps the local preview line separate, and writes autonomous daemon reports under `.local/autonomous-dev/`. Reports include total duration, step durations, the selected scope set and the failure category when a gate fails.

For a broader local check before user review:

```bash
npm run dev:wave
```

## Production Release Line

Production release is isolated from daily development. It runs the full release gate only:

```bash
npm run release:gate
```

The nightly autonomous release runner is:

```bash
npm run automation:release -- run
```

For a safe release-line readiness check without backup tag, PR or deployment:

```bash
npm run automation:release -- check
```

It does not skip blockers. If the full release gate fails, it writes a failed report and does not deploy. The production line has three triggers:

- Windows Task Scheduler: `Lipyum Nightly Production Release`
- Development daemon fallback: `npm run automation:dev -- start`
- Codex app cron: `Lipyum Partner nightly production release`

The release runner uses a daily state file and lock under `.local/autonomous-release/`, so duplicate triggers do not create duplicate releases. Release reports include full gate timing details under `qualityGate.steps`.
After PR merge, the runner waits for GitHub Pages `release.json` to match the merge SHA and then runs production smoke against the live URL.

## Gate Levels

Fast component gate:

```bash
npm run dev:gate
```

Wave gate:

```bash
npm run dev:wave
```

Release gate:

```bash
npm run release:gate
```

## Release Blockers

P0 and P1 issues block release.

P2 issues do not block release and are tracked in `POST_RELEASE_BACKLOG.md`.

## Release Gate Coverage

The V13 release gate covers:

- dependency lock
- syntax
- UTF-8 integrity
- static design contract
- Vue style debt
- unit and route smoke
- final Vue runtime architecture
- critical route smoke
- blank bottom route contract
- retired package redirects
- profile and drawer actions
- navigation and live support smoke
- build
- `git diff --check`

## Production Rule

GitHub Pages is the only canonical production platform for this repository.
Vercel and Cloudflare are not release gates and must not be used for V13 release validation.
