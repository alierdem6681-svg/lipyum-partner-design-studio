import { closeSync, existsSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localNode = process.platform === "win32"
  ? path.join(root, "node_modules", "node", "bin", "node.exe")
  : path.join(root, "node_modules", "node", "bin", "node");
const nodeBin = existsSync(localNode) ? localNode : process.execPath;
const playwrightCli = path.join(root, "node_modules", "@playwright", "test", "cli.js");
const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";
const cliArgs = process.argv.slice(2);
const allowedModes = new Set(["--fast", "--wave", "--release"]);
const mode = cliArgs.find((arg) => allowedModes.has(arg)) || "--release";
const requestedScopes = cliArgs
  .filter((arg) => arg.startsWith("--scope="))
  .flatMap((arg) => arg.slice("--scope=".length).split(","))
  .map((scope) => scope.trim())
  .filter(Boolean);
const gateStartedAt = new Date();
const gateTimingsPath = process.env.LIPYUM_GATE_TIMINGS_PATH || "";
const gateLockPath = path.join(root, ".local", "v13-release-gate.lock.json");
const gateLockWaitMs = Number(process.env.LIPYUM_GATE_LOCK_WAIT_MS || 120_000);
const stepResults = [];
let gateLockAcquired = false;

function e2e(file) {
  return `tests/e2e/${file}`;
}

function unit(file) {
  return `tests/unit/${file}`;
}

function arch(file) {
  return `tests/architecture/${file}`;
}

function commandOutput(command, args) {
  try {
    return execFileSync(command, args, { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function resolveScopes() {
  if (mode === "--release") return [];
  if (requestedScopes.length && !requestedScopes.includes("auto")) return [...new Set(requestedScopes)];
  const output = commandOutput(nodeBin, [path.join(root, "scripts", "detect-test-scope.mjs")]);
  const scopes = output.split(",").map((scope) => scope.trim()).filter(Boolean);
  return scopes.length ? [...new Set(scopes)] : ["smoke"];
}

const activeScopes = resolveScopes();

function hasScope(...scopes) {
  return activeScopes.includes("all") || scopes.some((scope) => activeScopes.includes(scope));
}

function v13GrepForScopes() {
  if (mode === "--release") return "";
  const patterns = new Set(["boots Vue"]);

  if (hasScope("navigation", "header", "bottom-bar", "shared-shell", "smoke")) {
    patterns.add("critical route opens in final Vue runtime");
    patterns.add("blank bottom route remains empty");
    patterns.add("retired package route redirects");
    patterns.add("home and bottom routes share");
  }
  if (hasScope("profile", "drawer")) patterns.add("profile badges|partner card");
  if (hasScope("support")) patterns.add("support|critical route opens in final Vue runtime: /support");
  if (hasScope("calendar", "appointment")) patterns.add("critical route opens in final Vue runtime: /calendar|home and bottom routes share");
  if (hasScope("jobs")) patterns.add("critical route opens in final Vue runtime: /jobs|blank bottom route remains empty: /my-jobs|home and bottom routes share");
  if (hasScope("wallet")) patterns.add("critical route opens in final Vue runtime: /wallet");
  if (hasScope("growth")) patterns.add("critical route opens in final Vue runtime: /reviews|/leaderboard|/subscription");
  if (hasScope("referral")) patterns.add("critical route opens in final Vue runtime: /referral");

  return [...patterns].join("|");
}

function classifyFailedStep(stepName) {
  const normalized = stepName.toLowerCase();
  if (normalized.includes("lock")) return "concurrency-lock";
  if (normalized.includes("dependency")) return "dependency-lock";
  if (normalized.includes("syntax")) return "syntax";
  if (normalized.includes("utf-8")) return "encoding";
  if (normalized.includes("design")) return "design-contract";
  if (normalized.includes("style")) return "style-debt";
  if (normalized.includes("route contract")) return "route-contract";
  if (normalized.includes("architecture")) return "architecture";
  if (normalized.includes("smoke") || normalized.includes("flow")) return "e2e-runtime";
  if (normalized.includes("build")) return "production-build";
  if (normalized.includes("diff")) return "git-diff";
  return "unknown";
}

function writeTimings(status, error) {
  if (!gateTimingsPath) return;
  const finishedAt = new Date();
  const failedStep = stepResults.find((step) => step.status === "fail");
  const errorMessage = error ? String(error instanceof Error ? error.message : error) : "";
  const report = {
    pipeline: "v13-release-gate",
    mode: mode.replace(/^--/, ""),
    scopes: mode === "--release" ? ["release"] : activeScopes,
    status,
    startedAt: gateStartedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - gateStartedAt.getTime(),
    failureCategory: failedStep ? classifyFailedStep(failedStep.name) : errorMessage.includes("gate lock") ? "concurrency-lock" : null,
    error: errorMessage || null,
    steps: stepResults,
  };
  mkdirSync(path.dirname(gateTimingsPath), { recursive: true });
  writeFileSync(gateTimingsPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readLock() {
  if (!existsSync(gateLockPath)) return null;
  try {
    return JSON.parse(readFileSync(gateLockPath, "utf8"));
  } catch {
    return null;
  }
}

function tryAcquireGateLock() {
  mkdirSync(path.dirname(gateLockPath), { recursive: true });
  try {
    const fd = openSync(gateLockPath, "wx");
    writeFileSync(fd, JSON.stringify({
      pid: process.pid,
      mode: mode.replace(/^--/, ""),
      scopes: mode === "--release" ? ["release"] : activeScopes,
      startedAt: gateStartedAt.toISOString(),
    }, null, 2));
    closeSync(fd);
    gateLockAcquired = true;
    return true;
  } catch {
    const lock = readLock();
    if (!lock?.pid || !isAlive(lock.pid)) rmSync(gateLockPath, { force: true });
    return false;
  }
}

async function acquireGateLock() {
  const deadline = Date.now() + gateLockWaitMs;
  while (Date.now() <= deadline) {
    if (tryAcquireGateLock()) return;
    const lock = readLock();
    console.log(`[v13-release-gate] waiting for existing gate lock pid=${lock?.pid || "unknown"}`);
    await sleep(2_000);
  }
  throw new Error(`Timed out waiting for v13-release-gate lock after ${gateLockWaitMs}ms`);
}

function releaseGateLock() {
  if (!gateLockAcquired) return;
  const lock = readLock();
  if (!lock || lock.pid === process.pid) rmSync(gateLockPath, { force: true });
  gateLockAcquired = false;
}

function canListen(port, host) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => server.close(() => resolve(true)));
    server.listen({ port, host, exclusive: true });
  });
}

async function configurePlaywrightPort() {
  const basePort = Number(process.env.PLAYWRIGHT_PORT || 5174);
  const startPort = Number.isInteger(basePort) && basePort > 0 ? basePort : 5174;
  for (let port = startPort; port < startPort + 80; port += 1) {
    if ((await canListen(port, "127.0.0.1")) && (await canListen(port, "0.0.0.0"))) {
      process.env.PLAYWRIGHT_PORT = String(port);
      console.log(`[v13-release-gate] PLAYWRIGHT_PORT=${port}`);
      return;
    }
  }
  throw new Error(`No available Playwright port found from ${startPort}`);
}

function cleanupPlaywrightPort() {
  if (process.platform !== "win32") return;
  const port = Number(process.env.PLAYWRIGHT_PORT || 0);
  if (!Number.isInteger(port) || port <= 0 || port === 5173) return;
  const escapedRoot = root.replace(/'/g, "''");
  const script = `
$repo = '${escapedRoot}'
Get-NetTCPConnection -State Listen -LocalPort ${port} -ErrorAction SilentlyContinue | ForEach-Object {
  $owner = $_.OwningProcess
  $process = Get-CimInstance Win32_Process -Filter "ProcessId = $owner" -ErrorAction SilentlyContinue
  if ($process -and $process.CommandLine -and $process.CommandLine.Contains($repo) -and $process.CommandLine.Contains("node_modules") -and $process.CommandLine.Contains("vite")) {
    Stop-Process -Id $owner -Force -ErrorAction SilentlyContinue
  }
}
`;
  spawnSync("powershell", ["-NoProfile", "-Command", script], {
    cwd: root,
    stdio: "ignore",
    windowsHide: true,
  });
}

async function runStep(step) {
  if (step.playwright) await configurePlaywrightPort();
  return new Promise((resolve, reject) => {
    console.log(`\n[v13-release-gate] ${step.name}`);
    const startedAt = new Date();
    let settled = false;
    const finish = (status, code, error) => {
      if (settled) return;
      settled = true;
      const finishedAt = new Date();
      stepResults.push({
        name: step.name,
        status,
        startedAt: startedAt.toISOString(),
        finishedAt: finishedAt.toISOString(),
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        exitCode: code,
        failureCategory: status === "fail" ? classifyFailedStep(step.name) : null,
        error: error ? String(error instanceof Error ? error.message : error) : null,
      });
    };
    const child = spawn(step.command, step.args, {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, ...(step.env || {}) },
      shell: process.platform === "win32" && step.command.endsWith(".cmd"),
    });
    child.on("error", (error) => {
      finish("fail", 1, error);
      reject(error);
    });
    child.on("exit", (code) => {
      if (step.playwright) cleanupPlaywrightPort();
      const exitCode = code ?? 1;
      if (exitCode === 0) {
        finish("pass", exitCode, null);
        resolve();
      } else {
        const error = new Error(`${step.name} failed with exit code ${exitCode}`);
        finish("fail", exitCode, error);
        reject(error);
      }
    });
  });
}

const architectureFiles = [
  unit("defaultRuntimeContract.test.js"),
  arch("default-vue-runtime.test.js"),
  arch("explicit-legacy-rollback.test.js"),
  arch("no-legacy-default-boot.test.js"),
  arch("no-legacy-boot.test.js"),
  arch("no-active-legacy-content-bridge.test.js"),
  arch("package-feature-removed.test.js"),
  arch("vue-root.test.js"),
  arch("vue-router-owns-navigation.test.js"),
];

function playwrightStep(name, files, extraArgs = ["--workers=1", "--trace=off"]) {
  return {
    name,
    command: nodeBin,
    args: [playwrightCli, "test", ...files.map(e2e), ...extraArgs],
    playwright: true,
  };
}

const v13SmokeArgs = [playwrightCli, "test", e2e("v13-release-smoke.spec.js"), "--workers=1", "--trace=off"];
const v13Grep = v13GrepForScopes();
if (v13Grep) v13SmokeArgs.push("--grep", v13Grep);

const fastSteps = [
  { name: "syntax", command: npmBin, args: ["run", "check"] },
  { name: "runtime and architecture", command: nodeBin, args: ["--test", ...architectureFiles] },
  { name: "route contract smoke", command: nodeBin, args: ["tests/routes.smoke.js"] },
  { name: "V13 scoped route smoke", command: nodeBin, args: v13SmokeArgs, playwright: true },
];

const waveScopeSteps = [];
if (hasScope("calendar", "appointment")) waveScopeSteps.push(playwrightStep("appointment route flow", ["v12-calendar.spec.js", "randevu-menu.spec.js"]));
if (hasScope("support")) waveScopeSteps.push(playwrightStep("support route flow", ["support-ticket.spec.js", "live-support.spec.js"]));
if (hasScope("profile", "drawer")) waveScopeSteps.push(playwrightStep("profile route flow", ["profile-badges.spec.js"]));
if (hasScope("jobs")) waveScopeSteps.push(playwrightStep("jobs route flow", ["v12-jobs.spec.js"]));

const waveSteps = [
  ...fastSteps,
  ...(waveScopeSteps.length
    ? waveScopeSteps
    : [{ name: "profile and navigation interactions", command: nodeBin, args: [playwrightCli, "test", e2e("v13-release-smoke.spec.js"), "--grep", "profile|navigation|support", "--workers=1", "--trace=off"], playwright: true }]),
];

const releaseSteps = [
  { name: "dependency lock", command: npmBin, args: ["run", "test:dependency-lock"] },
  { name: "syntax", command: npmBin, args: ["run", "check"] },
  { name: "UTF-8 integrity", command: npmBin, args: ["run", "test:utf8-integrity"] },
  { name: "static design contract", command: npmBin, args: ["run", "test:design-contract"] },
  { name: "Vue style debt", command: npmBin, args: ["run", "test:no-vue-style-debt"] },
  { name: "unit and route smoke", command: npmBin, args: ["test"] },
  { name: "runtime and architecture", command: nodeBin, args: ["--test", ...architectureFiles] },
  { name: "V13 release smoke", command: nodeBin, args: [playwrightCli, "test", e2e("v13-release-smoke.spec.js"), "--workers=1", "--trace=off"], playwright: true },
  { name: "performance improve flow", command: nodeBin, args: [playwrightCli, "test", e2e("performance-improve.spec.js"), "--workers=1", "--trace=off"], playwright: true },
  { name: "subscription direct purchase flow", command: npmBin, args: ["run", "test:subscription-conversion-no-trial:core"], playwright: true },
  { name: "build", command: npmBin, args: ["run", "build"] },
  { name: "git diff check", command: "git", args: ["diff", "--check"] },
];

const steps = mode === "--fast" ? fastSteps : mode === "--wave" ? waveSteps : releaseSteps;

let exitCode = 0;

try {
  await acquireGateLock();
  if (mode !== "--release") console.log(`[v13-release-gate] scopes=${activeScopes.join(",")}`);
  for (const step of steps) await runStep(step);
  writeTimings("pass");
  console.log(`\n[v13-release-gate] PASS ${mode}`);
} catch (error) {
  writeTimings("fail", error);
  console.error(`\n[v13-release-gate] FAIL ${mode}`);
  console.error(error instanceof Error ? error.message : error);
  exitCode = 1;
} finally {
  releaseGateLock();
}

process.exit(exitCode);
