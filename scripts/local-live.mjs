import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localDir = path.join(root, ".local");
const pidPath = path.join(localDir, "lipyum-live.pid");
const metaPath = path.join(localDir, "lipyum-live.json");
const logPath = path.join(localDir, "lipyum-live.log");
const port = Number(process.env.LIPYUM_LOCAL_PORT || 5173);
const host = process.env.LIPYUM_LOCAL_HOST || "0.0.0.0";
const nodeBin = process.platform === "win32"
  ? path.join(root, "node_modules", "node", "bin", "node.exe")
  : path.join(root, "node_modules", "node", "bin", "node");
const runtimeNode = existsSync(nodeBin) ? nodeBin : process.execPath;
const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");
const command = process.argv[2] || "status";

function ensureLocalDir() {
  mkdirSync(localDir, { recursive: true });
}

function readMeta() {
  if (!existsSync(pidPath) || !existsSync(metaPath)) return null;
  try {
    const pid = Number(readFileSync(pidPath, "utf8").trim());
    const meta = JSON.parse(readFileSync(metaPath, "utf8"));
    return Number.isInteger(pid) && meta.cwd === root ? { ...meta, pid } : null;
  } catch {
    return null;
  }
}

function isAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function cleanupStale() {
  const meta = readMeta();
  if (!meta || isAlive(meta.pid)) return meta;
  rmSync(pidPath, { force: true });
  rmSync(metaPath, { force: true });
  return null;
}

function request(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      res.on("end", () => resolve(res.statusCode || 0));
    });
    req.on("error", () => resolve(0));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(0);
    });
  });
}

async function waitUntilReady() {
  const rootUrl = `http://127.0.0.1:${port}/`;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if ((await request(rootUrl)) === 200) return true;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}

async function status() {
  const meta = cleanupStale();
  const running = Boolean(meta && isAlive(meta.pid));
  const httpStatus = running ? await request(`http://127.0.0.1:${port}/health.txt`) : 0;
  console.log(JSON.stringify({
    running,
    pid: meta?.pid || null,
    cwd: meta?.cwd || root,
    port,
    url: `http://127.0.0.1:${port}/`,
    health: httpStatus,
    logPath,
  }, null, 2));
}

async function up() {
  ensureLocalDir();
  const existing = cleanupStale();
  if (existing && isAlive(existing.pid)) {
    console.log(`[local-live] already running pid=${existing.pid}`);
    await status();
    return;
  }

  const out = await import("node:fs").then((fs) => fs.openSync(logPath, "a"));
  const child = spawn(runtimeNode, [viteBin, "--host", host, "--port", String(port), "--strictPort"], {
    cwd: root,
    detached: true,
    stdio: ["ignore", out, out],
    env: { ...process.env, LIPYUM_GIT_BRANCH: "main" },
    windowsHide: true,
  });
  child.unref();
  writeFileSync(pidPath, `${child.pid}\n`, "utf8");
  writeFileSync(metaPath, JSON.stringify({ cwd: root, pid: child.pid, port, startedAt: new Date().toISOString() }, null, 2), "utf8");

  if (!(await waitUntilReady())) {
    console.error("[local-live] server did not become ready");
    process.exit(1);
  }
  console.log(`[local-live] started pid=${child.pid} url=http://127.0.0.1:${port}/`);
}

function down() {
  const meta = readMeta();
  if (!meta || !isAlive(meta.pid)) {
    cleanupStale();
    console.log("[local-live] not running");
    return;
  }
  process.kill(meta.pid);
  rmSync(pidPath, { force: true });
  rmSync(metaPath, { force: true });
  console.log(`[local-live] stopped pid=${meta.pid}`);
}

async function restart() {
  down();
  await up();
}

async function syncMain() {
  const { execFileSync } = await import("node:child_process");
  execFileSync("git", ["fetch", "origin", "main"], { cwd: root, stdio: "inherit" });
  execFileSync("git", ["switch", "main"], { cwd: root, stdio: "inherit" });
  execFileSync("git", ["pull", "--ff-only", "origin", "main"], { cwd: root, stdio: "inherit" });
  execFileSync(process.platform === "win32" ? "npm.cmd" : "npm", ["ci"], { cwd: root, stdio: "inherit" });
  execFileSync(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build"], { cwd: root, stdio: "inherit" });
  await restart();
}

if (command === "status") await status();
else if (command === "up" || command === "ensure") await up();
else if (command === "down") down();
else if (command === "restart") await restart();
else if (command === "sync-main") await syncMain();
else {
  console.error(`[local-live] unknown command: ${command}`);
  process.exit(1);
}
