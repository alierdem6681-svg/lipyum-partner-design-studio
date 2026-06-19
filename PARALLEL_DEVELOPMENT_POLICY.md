# Parallel Development Policy

- Every Codex task uses its own branch.
- Every Codex task uses its own worktree.
- Every Codex task uses its own Vite port.
- `main` is reserved for stable preview only.
- Feature tasks do not push or merge directly to `main`.
- The stable Cloudflare tunnel must point only to a clean `origin/main` worktree.
- Feature previews must use separate ports and, when needed, separate tunnels.
- `package.json`, lock file, router, `App.vue`, stores, tokens, and Quality Gate files are integration-sensitive and must not be changed by parallel sessions without coordination.
- Two Codex sessions must not work in the same physical worktree.
