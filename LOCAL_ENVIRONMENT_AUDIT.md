# Local Environment Audit

Date: 2026-06-18 14:40 UTC

## Goal

Recover the local preview without losing the dirty V12-A worktree. The stable Cloudflare tunnel must serve the same stable code as Vercel (`origin/main`), while V12-A work remains preserved for later development.

## Repositories And Worktrees

| Purpose | Path | Branch/State | SHA |
| --- | --- | --- | --- |
| V12-A development worktree | `/home/alierdem6681/lipyum-partner-design-studio` | `feature/v12-a-vue-root-cutover` | `ef4a21545cd7112a4fef5d41c58fae4c0bac4f70` |
| Stable preview worktree | `/home/alierdem6681/lipyum-stable-preview` | detached `origin/main` | `ef4a21545cd7112a4fef5d41c58fae4c0bac4f70` |

Remote:

```text
origin https://github.com/alierdem6681-svg/lipyum-partner-design-studio.git
```

## Backups Created

Dirty V12-A state was backed up before preview changes:

```text
/tmp/lipyum-v12a-working-tree.diff
/tmp/lipyum-v12a-staged.diff
/tmp/lipyum-v12a-untracked-files.txt
/tmp/lipyum-v12a-status.txt
/tmp/lipyum-v12a-stashes.txt
/home/alierdem6681/lipyum-backups/v12-a-local-before-preview-recovery-20260618-142840.tar.gz
```

Existing stashes were preserved:

```text
stash@{0}: On main: v12-phase0-pre-pull-dirty-worktree
stash@{1}: autostash
```

No stash was popped, dropped, or modified.

## Process Audit

### Cloudflare Tunnel

Kept alive:

```text
PID 2331770
cwd: /home/alierdem6681
cmd: /tmp/lipyum-cloudflare/cloudflared tunnel --url http://127.0.0.1:56387 --no-autoupdate
local management listener: 127.0.0.1:20241
public URL: https://vehicles-movies-ministry-presenting.trycloudflare.com
```

### Stable Preview Vite

Current stable preview server:

```text
PID 2918696
port: 56387
cwd: /home/alierdem6681/lipyum-stable-preview
cmd: node_modules/node/bin/node node_modules/vite/bin/vite.js --host 0.0.0.0 --port 56387 --strictPort
```

This is the only process bound to the Cloudflare tunnel target port `56387`.

### Other Local Dev Servers

An unrelated Vite server was observed on port `5173` from the V12-A development worktree. It was not connected to the Cloudflare tunnel and was not terminated.

### V12-A Isolated Preview

V12-A development preview is isolated from the stable Cloudflare tunnel:

```text
PID 2924419
port: 56388
cwd: /home/alierdem6681/lipyum-partner-design-studio
cmd: node_modules/node/bin/node node_modules/vite/bin/vite.js --host 0.0.0.0 --port 56388 --strictPort
local URL: http://127.0.0.1:56388
```

This port is not used by the stable Cloudflare tunnel.

## Actions Taken

1. Audited git status, worktrees, remotes, stashes, processes, ports, and tunnel target.
2. Created backups for the dirty V12-A state.
3. Fetched `origin/main`.
4. Created clean stable worktree at `/home/alierdem6681/lipyum-stable-preview`.
5. Ran `npm ci` and `npm run build` in the stable worktree.
6. Kept Cloudflare PID `2331770` alive.
7. Confirmed port `56387` is now served from `/home/alierdem6681/lipyum-stable-preview`.
8. Verified local, Cloudflare, and Vercel health endpoints.
9. Started an isolated V12-A preview on port `56388`.

## Verification

Local stable preview:

```text
http://127.0.0.1:56387/health.txt
OK Lipyum Partner
```

V12-A isolated preview:

```text
http://127.0.0.1:56388/health.txt
OK Lipyum Partner
```

Cloudflare stable preview:

```text
https://vehicles-movies-ministry-presenting.trycloudflare.com/health.txt
OK Lipyum Partner
```

Vercel stable:

```text
https://lipyum-partner-design-studio.vercel.app/health.txt
OK Lipyum Partner
```

Root `/` still returns `index.html`, and `/#/home` routing remains intact.

## Safety Notes

- No `git reset --hard` was run.
- No `git clean -fd` was run.
- No stash was popped or dropped.
- No feature branch was deleted.
- No merge to `main` was performed.
- No push was performed.
- The Cloudflare tunnel process was not killed.
- The stable preview is isolated from the dirty V12-A worktree.
