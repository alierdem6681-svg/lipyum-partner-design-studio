import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localDir = path.join(root, ".local", "autonomous-dev");
const pidPath = path.join(localDir, "lipyum-autonomous-dev.pid");
const reportPath = path.join(localDir, "latest.json");
const logPath = path.join(localDir, "autonomous-dev.log");
const intervalMs = Number(process.env.LIPYUM_DEV_LOOP_INTERVAL_MS || 60_000);
const nightlyReleaseHour = Number(process.env.LIPYUM_NIGHTLY_RELEASE_HOUR || 2);
const command = process.argv[2] || "status";
const nodeBin = process.platform === "win32"
  ? path.join(root, "node_modules", "node", "bin", "node.exe")
  : path.join(root, "node_modules", "node", "bin", "node");
const runtimeNode = existsSync(nodeBin) ? nodeBin : process.execPath;

function ensureDir() {
  mkdirSync(localDir, { recursive: true });
}

function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readPid() {
  if (!existsSync(pidPath)) return null;
  const pid = Number(readFileSync(pidPath, "utf8").trim());
  return Number.isInteger(pid) ? pid : null;
}

function run(commandPath, args, options = {}) {
  const child = spawn(commandPath, args, {
    cwd: root,
    stdio: options.stdio || "inherit",
    env: { ...process.env, ...(options.env || {}) },
    shell: false,
    windowsHide: true,
  });
  return new Promise((resolve) => {
    child.on("error", () => resolve(1));
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

async function runTimed(name, commandPath, args, options = {}) {
  const startedAt = new Date();
  const exitCode = await run(commandPath, args, options);
  const finishedAt = new Date();
  return {
    name,
    status: exitCode === 0 ? "pass" : "fail",
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    exitCode,
    failureCategory: exitCode === 0 ? null : classifyFailure(name),
  };
}

function classifyFailure(name) {
  const normalized = name.toLowerCase();
  if (normalized.includes("server")) return "local-server";
  if (normalized.includes("gate")) return "quality-gate";
  return "unknown";
}

function readJson(file) {
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function output(commandPath, args) {
  const result = spawnSync(commandPath, args, { cwd: root, encoding: "utf8", shell: false });
  return result.status === 0 ? result.stdout.trim() : "";
}

function workspaceFingerprint() {
  const parts = [
    output("git", ["rev-parse", "HEAD"]),
    output("git", ["status", "--porcelain=v1"]),
  ];
  return createHash("sha256").update(parts.join("\n")).digest("hex");
}

function writeReport(report) {
  ensureDir();
  writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
}

async function runOnce(reason = "manual") {
  ensureDir();
  const startedAt = new Date();
  const scopes = output(runtimeNode, [path.join(root, "scripts", "detect-test-scope.mjs")]) || "smoke";
  const steps = [];
  const gateTimingsPath = path.join(localDir, "latest-gate.json");
  steps.push(await runTimed("local server ensure", runtimeNode, [path.join(root, "scripts", "local-live.mjs"), "ensure"]));
  if (steps.at(-1).exitCode === 0) {
    steps.push(await runTimed("development quality gate", runtimeNode, [
      path.join(root, "tests", "v13-release-gate.mjs"),
      "--fast",
      "--scope=auto",
    ], {
      env: { LIPYUM_GATE_TIMINGS_PATH: gateTimingsPath },
    }));
  }
  const gateTimings = readJson(gateTimingsPath);
  const failedStep = steps.find((step) => step.exitCode !== 0);
  const exitCode = failedStep ? failedStep.exitCode : 0;
  const finishedAt = new Date();
  const report = {
    pipeline: "development",
    reason,
    scopes,
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    exitCode,
    status: exitCode === 0 ? "pass" : "fail",
    failureCategory: exitCode === 0 ? null : gateTimings?.failureCategory || failedStep?.failureCategory || "unknown",
    localUrl: "http://127.0.0.1:5173/",
    steps,
    qualityGate: gateTimings,
  };
  writeReport(report);
  return exitCode;
}

async function maybeRunNightlyRelease() {
  const now = new Date();
  if (now.getHours() !== nightlyReleaseHour) return;
  await run(runtimeNode, [path.join(root, "scripts", "autonomous-release.mjs"), "run"], {
    env: { LIPYUM_AUTONOMOUS_DEPLOY: "true" },
  });
}

async function loop() {
  ensureDir();
  writeFileSync(pidPath, `${process.pid}\n`, "utf8");
  let lastFingerprint = "";
  while (true) {
    const currentFingerprint = workspaceFingerprint();
    if (currentFingerprint && currentFingerprint !== lastFingerprint) {
      lastFingerprint = currentFingerprint;
      await runOnce("workspace-change");
    }
    await maybeRunNightlyRelease();
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

function start() {
  ensureDir();
  const existingPid = readPid();
  if (existingPid && isAlive(existingPid)) {
    console.log(`[autonomous-dev] already running pid=${existingPid}`);
    return;
  }
  rmSync(pidPath, { force: true });
  const out = openSync(logPath, "a");
  const child = spawn(runtimeNode, [fileURLToPath(import.meta.url), "loop"], {
    cwd: root,
    detached: true,
    stdio: ["ignore", out, out],
    env: process.env,
    windowsHide: true,
  });
  child.unref();
  writeFileSync(pidPath, `${child.pid}\n`, "utf8");
  console.log(`[autonomous-dev] started pid=${child.pid}`);
}

function stop() {
  const pid = readPid();
  if (!pid || !isAlive(pid)) {
    rmSync(pidPath, { force: true });
    console.log("[autonomous-dev] not running");
    return;
  }
  process.kill(pid);
  rmSync(pidPath, { force: true });
  console.log(`[autonomous-dev] stopped pid=${pid}`);
}

function status() {
  const pid = readPid();
  const report = existsSync(reportPath) ? JSON.parse(readFileSync(reportPath, "utf8")) : null;
  console.log(JSON.stringify({
    running: Boolean(pid && isAlive(pid)),
    pid,
    intervalMs,
    nightlyReleaseHour,
    reportPath,
    logPath,
    latest: report,
  }, null, 2));
}

if (command === "run") process.exit(await runOnce("manual"));
else if (command === "loop") await loop();
else if (command === "start") start();
else if (command === "stop") stop();
else if (command === "restart") {
  stop();
  start();
} else if (command === "status") status();
else {
  console.error(`[autonomous-dev] unknown command: ${command}`);
  process.exit(1);
}
