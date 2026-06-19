# Versioning Policy

## Stable Version Requirements

Before a new major migration starts, the previous stable version must have:

1. Annotated tag.
2. Archive branch.
3. Release manifest.
4. Production build output recorded.
5. Golden Master screenshot baseline.
6. Quality Gate result.

## Rules

- Do not move an existing stable tag.
- Do not force an archive branch without explicit review.
- Do not use feature screenshots as Golden Master baselines.
- Do not merge feature work to `main` without user approval.
- Version restore work must happen on a `restore/*` branch first.
