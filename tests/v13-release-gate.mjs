import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync, spawn } from "node:child_process";
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
const stepResults = [];

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
  const report = {
    pipeline: "v13-release-gate",
    mode: mode.replace(/^--/, ""),
    scopes: mode === "--release" ? ["release"] : activeScopes,
    status,
    startedAt: gateStartedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - gateStartedAt.getTime(),
    failureCategory: failedStep ? classifyFailedStep(failedStep.name) : null,
    error: error ? String(error instanceof Error ? error.message : error) : null,
    steps: stepResults,
  };
  mkdirSync(path.dirname(gateTimingsPath), { recursive: true });
  writeFileSync(gateTimingsPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
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

function runStep(step) {
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
  };
}

const v13SmokeArgs = [playwrightCli, "test", e2e("v13-release-smoke.spec.js"), "--workers=1", "--trace=off"];
const v13Grep = v13GrepForScopes();
if (v13Grep) v13SmokeArgs.push("--grep", v13Grep);

const fastSteps = [
  { name: "syntax", command: npmBin, args: ["run", "check"] },
  { name: "runtime and architecture", command: nodeBin, args: ["--test", ...architectureFiles] },
  { name: "route contract smoke", command: nodeBin, args: ["tests/routes.smoke.js"] },
  { name: "V13 scoped route smoke", command: nodeBin, args: v13SmokeArgs },
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
    : [{ name: "profile and navigation interactions", command: nodeBin, args: [playwrightCli, "test", e2e("v13-release-smoke.spec.js"), "--grep", "profile|navigation|support", "--workers=1", "--trace=off"] }]),
];

const releaseSteps = [
  { name: "dependency lock", command: npmBin, args: ["run", "test:dependency-lock"] },
  { name: "syntax", command: npmBin, args: ["run", "check"] },
  { name: "UTF-8 integrity", command: npmBin, args: ["run", "test:utf8-integrity"] },
  { name: "static design contract", command: npmBin, args: ["run", "test:design-contract"] },
  { name: "Vue style debt", command: npmBin, args: ["run", "test:no-vue-style-debt"] },
  { name: "unit and route smoke", command: npmBin, args: ["test"] },
  { name: "runtime and architecture", command: nodeBin, args: ["--test", ...architectureFiles] },
  { name: "V13 release smoke", command: nodeBin, args: [playwrightCli, "test", e2e("v13-release-smoke.spec.js"), "--workers=1", "--trace=off"] },
  { name: "performance improve flow", command: nodeBin, args: [playwrightCli, "test", e2e("performance-improve.spec.js"), "--workers=1", "--trace=off"] },
  { name: "subscription direct purchase flow", command: npmBin, args: ["run", "test:subscription-conversion-no-trial:core"] },
  { name: "build", command: npmBin, args: ["run", "build"] },
  { name: "git diff check", command: "git", args: ["diff", "--check"] },
];

const steps = mode === "--fast" ? fastSteps : mode === "--wave" ? waveSteps : releaseSteps;

try {
  if (mode !== "--release") console.log(`[v13-release-gate] scopes=${activeScopes.join(",")}`);
  await configurePlaywrightPort();
  for (const step of steps) await runStep(step);
  writeTimings("pass");
  console.log(`\n[v13-release-gate] PASS ${mode}`);
} catch (error) {
  writeTimings("fail", error);
  console.error(`\n[v13-release-gate] FAIL ${mode}`);
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
