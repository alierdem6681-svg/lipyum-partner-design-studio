# Parallel Development Policy

## Purpose

Prevent unstable local development work from accidentally replacing the stable public preview.

## Stable Preview Rule

The public Cloudflare preview URL must serve only the stable worktree:

```text
/home/alierdem6681/lipyum-stable-preview
```

Stable preview port:

```text
56387
```

Cloudflare tunnel:

```text
https://vehicles-movies-ministry-presenting.trycloudflare.com
```

Only a clean `origin/main` worktree should be served on this port.

## Development Preview Rule

Feature work such as V12-A must run on a separate port and must not reuse the stable Cloudflare port.

Recommended V12-A port:

```text
56388
```

Development worktree:

```text
/home/alierdem6681/lipyum-partner-design-studio
```

If a separate Cloudflare URL is needed for feature review, start a separate tunnel for the development port. Do not repoint the stable tunnel.

## Required Checks Before Restarting Preview

Before changing any preview process:

```bash
ps -ef | grep -E 'vite|cloudflared|node'
lsof -i -P -n | grep LISTEN
pwdx <pid>
tr '\0' ' ' < /proc/<pid>/cmdline
git -C <served-path> rev-parse --abbrev-ref HEAD
git -C <served-path> rev-parse HEAD
```

## Forbidden Operations

Do not run these commands unless the user explicitly asks for them and a backup exists:

```text
git reset --hard
git clean -fd
git stash pop
git stash drop
git branch -D
git checkout -- .
```

Do not kill `cloudflared` unless the user explicitly asks. If a Vite server must be replaced, identify the exact PID by port, cwd, and command line first.

## Backup Rule

Before local preview recovery or branch switching with dirty work:

```bash
git diff > /tmp/lipyum-v12a-working-tree.diff
git diff --staged > /tmp/lipyum-v12a-staged.diff
git status --short > /tmp/lipyum-v12a-status.txt
git stash list > /tmp/lipyum-v12a-stashes.txt
```

Untracked files must be listed and, when needed, archived.

## Completion Rule

A preview recovery is complete only when all of these are recorded:

- Stable port
- Stable Vite PID
- Stable Vite cwd
- Stable SHA
- Cloudflare PID and target port
- Vercel health result
- Cloudflare health result
- V12-A backup paths
- Screenshot/parity report paths

