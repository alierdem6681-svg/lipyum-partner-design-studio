# Lipyum Partner Quality Gate

## Gate Levels

Fast component gate:

```bash
npm run test:fast -- --scope=<scope>
```

Wave gate:

```bash
npm run test:wave -- --wave=<wave>
```

Release gate:

```bash
npm run test:quality-gate:release
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
