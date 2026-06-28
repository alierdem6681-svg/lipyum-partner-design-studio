import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localDir = path.join(root, ".local", "autonomous-release");
const reportPath = path.join(localDir, "latest.json");
const lockPath = path.join(localDir, "release.lock.json");
const dailyStatePath = path.join(localDir, "daily-state.json");
const productionUrl = "https://alierdem6681-svg.github.io/lipyum-partner-design-studio/";
const releaseJsonUrl = `${productionUrl}release.json`;
const command = process.argv[2] || "status";
const force = process.argv.includes("--force");
const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";
const nodeBin = process.platform === "win32"
  ? path.join(root, "node_modules", "node", "bin", "node.exe")
  : path.join(root, "node_modules", "node", "bin", "node");
const runtimeNode = existsSync(nodeBin) ? nodeBin : process.execPath;

function ensureDir() {
  mkdirSync(localDir, { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readJson(file) {
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function writeJson(file, value) {
  ensureDir();
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function acquireLock() {
  ensureDir();
  const existing = readJson(lockPath);
  if (existing?.pid && isAlive(existing.pid)) return false;
  writeJson(lockPath, { pid: process.pid, startedAt: new Date().toISOString() });
  return true;
}

function releaseLock() {
  const existing = readJson(lockPath);
  if (!existing || existing.pid === process.pid) rmSync(lockPath, { force: true });
}

function run(commandPath, args, options = {}) {
  const child = spawn(commandPath, args, {
    cwd: root,
    stdio: options.stdio || "inherit",
    env: { ...process.env, ...(options.env || {}) },
    shell: process.platform === "win32" && commandPath.endsWith(".cmd"),
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
  if (normalized.includes("fetch")) return "git-fetch";
  if (normalized.includes("pending")) return "release-diff";
  if (normalized.includes("gate")) return "quality-gate";
  if (normalized.includes("backup")) return "production-backup";
  if (normalized.includes("pr")) return "pull-request";
  if (normalized.includes("merge")) return "pull-request-merge";
  if (normalized.includes("production release")) return "production-deploy";
  if (normalized.includes("smoke")) return "production-smoke";
  return "unknown";
}

async function timedStep(steps, name, fn, onUpdate = () => {}) {
  const startedAt = new Date();
  try {
    const value = await fn();
    const finishedAt = new Date();
    steps.push({
      name,
      status: "pass",
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      exitCode: 0,
      failureCategory: null,
    });
    onUpdate();
    return value;
  } catch (error) {
    const finishedAt = new Date();
    steps.push({
      name,
      status: "fail",
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      exitCode: 1,
      failureCategory: classifyFailure(name),
      error: error instanceof Error ? error.message : String(error),
    });
    onUpdate();
    throw error;
  }
}

async function runChecked(commandPath, args, options = {}) {
  const code = await run(commandPath, args, options);
  if (code !== 0) throw new Error(`${commandPath} ${args.join(" ")} failed with exit code ${code}`);
}

function output(commandPath, args, options = {}) {
  const result = spawnSync(commandPath, args, {
    cwd: root,
    encoding: "utf8",
    shell: false,
    env: { ...process.env, ...(options.env || {}) },
  });
  return result.status === 0 ? result.stdout.trim() : "";
}

function hasPendingReleaseWork() {
  const status = output("git", ["status", "--porcelain=v1"]);
  const ahead = output("git", ["rev-list", "--count", "origin/main..HEAD"]);
  return Boolean(status || Number(ahead || 0) > 0);
}

function refExists(ref) {
  const result = spawnSync("git", ["show-ref", "--verify", "--quiet", ref], { cwd: root, shell: false });
  return result.status === 0;
}

function remoteRefExists(ref) {
  const result = spawnSync("git", ["ls-remote", "--exit-code", "origin", ref], { cwd: root, shell: false });
  return result.status === 0;
}

function nextBackupSlot() {
  for (let version = 6; version < 200; version += 1) {
    const tag = `v${version}`;
    const branch = `archive/v${version}`;
    const tagBusy = refExists(`refs/tags/${tag}`) || remoteRefExists(`refs/tags/${tag}`);
    const branchBusy = refExists(`refs/heads/${branch}`) || remoteRefExists(`refs/heads/${branch}`);
    if (!tagBusy && !branchBusy) return { version, tag, branch };
  }
  throw new Error("No free backup slot found");
}

async function createProductionBackup() {
  await runChecked("git", ["fetch", "origin", "main", "--tags"]);
  const mainSha = output("git", ["rev-parse", "origin/main"]);
  const backup = nextBackupSlot();
  await runChecked("git", ["tag", backup.tag, mainSha]);
  await runChecked("git", ["branch", backup.branch, mainSha]);
  await runChecked("git", ["push", "origin", `refs/tags/${backup.tag}`, `refs/heads/${backup.branch}`]);
  const manifest = {
    createdAt: new Date().toISOString(),
    productionSha: mainSha,
    backupTag: backup.tag,
    archiveBranch: backup.branch,
  };
  writeJson(path.join(localDir, `release-${backup.tag}.json`), manifest);
  return manifest;
}

async function commitAndOpenReleasePr() {
  let branch = output("git", ["branch", "--show-current"]);
  if (!branch || branch === "main") {
    branch = `codex/autonomous-release-${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}`;
    await runChecked("git", ["switch", "-c", branch]);
  }

  await runChecked("git", ["add", "-A"]);
  const staged = spawnSync("git", ["diff", "--cached", "--quiet"], { cwd: root, shell: false }).status !== 0;
  if (staged) {
    await runChecked("git", ["commit", "-m", `chore: autonomous Lipyum release ${new Date().toISOString().slice(0, 10)}`]);
  }

  await runChecked("git", ["push", "-u", "origin", branch]);
  let prUrl = output("gh", ["pr", "view", branch, "--json", "url", "--jq", ".url"]);
  if (!prUrl) {
    prUrl = output("gh", [
      "pr",
      "create",
      "--base",
      "main",
      "--head",
      branch,
      "--title",
      `Autonomous Lipyum release ${new Date().toISOString().slice(0, 10)}`,
      "--body",
      "Autonomous release created after the local full release gate passed.",
    ]);
    if (!prUrl) throw new Error("GitHub PR creation did not return a URL");
  }
  await runChecked("gh", ["pr", "merge", branch, "--squash", "--auto"]);
  return { branch, prUrl };
}

function ghPrState(branch) {
  const raw = output("gh", ["pr", "view", branch, "--json", "state,mergeCommit,url"]);
  return raw ? JSON.parse(raw) : null;
}

async function waitForMerge(branch) {
  const deadline = Date.now() + 90 * 60 * 1000;
  while (Date.now() < deadline) {
    const state = ghPrState(branch);
    if (state?.state === "MERGED" && state.mergeCommit?.oid) {
      return { mergeSha: state.mergeCommit.oid, prUrl: state.url };
    }
    if (state?.state === "CLOSED") throw new Error("Release PR closed without merge");
    await sleep(60_000);
  }
  throw new Error("Timed out waiting for release PR merge");
}

function fetchText(url) {
  return new Promise((resolve) => {
    const req = https.get(`${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => resolve({ statusCode: res.statusCode || 0, body }));
    });
    req.on("error", () => resolve({ statusCode: 0, body: "" }));
    req.setTimeout(15_000, () => {
      req.destroy();
      resolve({ statusCode: 0, body: "" });
    });
  });
}

async function waitForProductionRelease(expectedSha) {
  const deadline = Date.now() + 90 * 60 * 1000;
  while (Date.now() < deadline) {
    const response = await fetchText(releaseJsonUrl);
    if (response.statusCode === 200) {
      try {
        const release = JSON.parse(response.body);
        if (release.gitSha === expectedSha && release.platform === "github-pages") return release;
      } catch {
        // Keep polling until GitHub Pages serves valid JSON.
      }
    }
    await sleep(60_000);
  }
  throw new Error(`Timed out waiting for production release.json SHA ${expectedSha}`);
}

async function runProductionSmoke() {
  await runChecked(runtimeNode, [path.join(root, "scripts", "production-smoke.mjs")], {
    env: {
      LIPYUM_PRODUCTION_URL: productionUrl,
      LIPYUM_EXPECTED_SHA: process.env.LIPYUM_EXPECTED_SHA || "",
    },
  });
}

function writeReport(report) {
  writeJson(reportPath, report);
}

async function runReleaseGateStep(steps, updateRunning) {
  const gateTimingsPath = path.join(localDir, "latest-gate.json");
  const gateStep = await runTimed("full release quality gate", npmBin, ["run", "test:quality-gate:release"], {
    env: {
      PLAYWRIGHT_PORT: process.env.PLAYWRIGHT_PORT || "5174",
      LIPYUM_GATE_TIMINGS_PATH: gateTimingsPath,
    },
  });
  steps.push(gateStep);
  const qualityGate = readJson(gateTimingsPath);
  updateRunning({ qualityGate });
  if (gateStep.exitCode !== 0) throw new Error(`full release quality gate failed with exit code ${gateStep.exitCode}`);
  return qualityGate;
}

function failedCategory(steps, qualityGate) {
  const failedStep = steps.find((step) => step.status === "fail");
  return qualityGate?.failureCategory || failedStep?.failureCategory || null;
}

async function runReadinessCheck() {
  if (!acquireLock()) {
    writeReport({ pipeline: "release", mode: "check", status: "skipped", reason: "release already running", skippedAt: new Date().toISOString() });
    return 0;
  }

  const today = localDateKey();
  const startedAt = new Date();
  const steps = [];
  let qualityGate = null;
  const report = {
    pipeline: "release",
    mode: "check",
    date: today,
    startedAt: startedAt.toISOString(),
    status: "running",
    deployEnabled: false,
    productionUrl,
  };
  const updateRunning = (extra = {}) => writeReport({ ...report, steps, qualityGate, ...extra });
  updateRunning();

  try {
    await timedStep(steps, "fetch production refs", () => runChecked("git", ["fetch", "origin", "main", "--tags"]), updateRunning);
    const pendingReleaseWork = await timedStep(steps, "detect pending release work", async () => hasPendingReleaseWork(), updateRunning);
    qualityGate = await runReleaseGateStep(steps, updateRunning);
    const finishedAt = new Date();
    const checked = {
      ...report,
      status: "checked",
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      pendingReleaseWork,
      failureCategory: null,
      steps,
      qualityGate,
    };
    writeReport(checked);
    return 0;
  } catch (error) {
    const finishedAt = new Date();
    const finalQualityGate = qualityGate || readJson(path.join(localDir, "latest-gate.json"));
    const failed = {
      ...report,
      status: "failed",
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      failureCategory: failedCategory(steps, finalQualityGate),
      error: error instanceof Error ? error.message : String(error),
      steps,
      qualityGate: finalQualityGate,
    };
    writeReport(failed);
    return 1;
  } finally {
    releaseLock();
  }
}

async function runRelease() {
  const today = localDateKey();
  if (!force) {
    const dailyState = readJson(dailyStatePath);
    if (dailyState?.date === today && ["idle", "blocked", "ready", "submitted", "deployed", "failed"].includes(dailyState.status)) {
      writeReport({ ...dailyState, status: "skipped", skippedAt: new Date().toISOString(), reason: "daily release already attempted" });
      return 0;
    }
  }

  if (!acquireLock()) {
    writeReport({ pipeline: "release", status: "skipped", reason: "release already running", skippedAt: new Date().toISOString() });
    return 0;
  }

  const startedAt = new Date();
  const steps = [];
  let qualityGate = null;
  const report = {
    pipeline: "release",
    mode: "run",
    date: today,
    startedAt: startedAt.toISOString(),
    status: "running",
    deployEnabled: process.env.LIPYUM_AUTONOMOUS_DEPLOY === "true",
    productionUrl,
  };
  const updateRunning = (extra = {}) => writeReport({ ...report, steps, qualityGate, ...extra });
  updateRunning();

  try {
    await timedStep(steps, "fetch production refs", () => runChecked("git", ["fetch", "origin", "main", "--tags"]), updateRunning);
    const pendingReleaseWork = await timedStep(steps, "detect pending release work", async () => hasPendingReleaseWork(), updateRunning);
    if (!pendingReleaseWork) {
      const finishedAt = new Date();
      const idle = {
        ...report,
        status: "idle",
        finishedAt: finishedAt.toISOString(),
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        reason: "no pending release work",
        pendingReleaseWork,
        steps,
        qualityGate,
      };
      writeReport(idle);
      writeJson(dailyStatePath, idle);
      return 0;
    }

    qualityGate = await runReleaseGateStep(steps, updateRunning);

    const backup = await timedStep(steps, "create production backup", () => createProductionBackup(), updateRunning);
    if (process.env.LIPYUM_AUTONOMOUS_DEPLOY !== "true") {
      const finishedAt = new Date();
      const ready = {
        ...report,
        status: "ready",
        finishedAt: finishedAt.toISOString(),
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        pendingReleaseWork,
        backup,
        steps,
        qualityGate,
      };
      writeReport(ready);
      writeJson(dailyStatePath, ready);
      return 0;
    }

    const pr = await timedStep(steps, "open release PR", () => commitAndOpenReleasePr(), updateRunning);
    const merged = await timedStep(steps, "wait for release PR merge", () => waitForMerge(pr.branch), updateRunning);
    const productionRelease = await timedStep(steps, "wait for production release", () => waitForProductionRelease(merged.mergeSha), updateRunning);
    process.env.LIPYUM_EXPECTED_SHA = merged.mergeSha;
    await timedStep(steps, "production smoke", () => runProductionSmoke(), updateRunning);

    const finishedAt = new Date();
    const deployed = {
      ...report,
      status: "deployed",
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      pendingReleaseWork,
      backup,
      pr: { ...pr, ...merged },
      productionRelease,
      steps,
      qualityGate,
    };
    writeReport(deployed);
    writeJson(dailyStatePath, deployed);
    return 0;
  } catch (error) {
    const finishedAt = new Date();
    const finalQualityGate = qualityGate || readJson(path.join(localDir, "latest-gate.json"));
    const failed = {
      ...report,
      status: "failed",
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      failureCategory: failedCategory(steps, finalQualityGate),
      error: error instanceof Error ? error.message : String(error),
      steps,
      qualityGate: finalQualityGate,
    };
    writeReport(failed);
    writeJson(dailyStatePath, failed);
    return 1;
  } finally {
    releaseLock();
  }
}

function status() {
  const latest = readJson(reportPath);
  const dailyState = readJson(dailyStatePath);
  const lock = readJson(lockPath);
  console.log(JSON.stringify({ reportPath, latest, dailyState, lock }, null, 2));
}

if (command === "run") process.exit(await runRelease());
else if (command === "check") process.exit(await runReadinessCheck());
else if (command === "status") status();
else {
  console.error(`[autonomous-release] unknown command: ${command}`);
  process.exit(1);
}
