import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localNode = process.platform === "win32"
  ? path.join(root, "node_modules", "node", "bin", "node.exe")
  : path.join(root, "node_modules", "node", "bin", "node");
const nodeBin = existsSync(localNode) ? localNode : process.execPath;
const playwrightCli = path.join(root, "node_modules", "@playwright", "test", "cli.js");
const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";
const mode = process.argv[2] || "--release";

function e2e(file) {
  return `tests/e2e/${file}`;
}

function unit(file) {
  return `tests/unit/${file}`;
}

function arch(file) {
  return `tests/architecture/${file}`;
}

function runStep(step) {
  return new Promise((resolve, reject) => {
    console.log(`\n[v13-release-gate] ${step.name}`);
    const child = spawn(step.command, step.args, {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, ...(step.env || {}) },
      shell: process.platform === "win32" && step.command.endsWith(".cmd"),
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${step.name} failed with exit code ${code}`));
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

const fastSteps = [
  { name: "syntax", command: npmBin, args: ["run", "check"] },
  { name: "runtime and architecture", command: nodeBin, args: ["--test", ...architectureFiles] },
  { name: "route contract smoke", command: nodeBin, args: ["tests/routes.smoke.js"] },
  { name: "V13 route smoke", command: nodeBin, args: [playwrightCli, "test", e2e("v13-release-smoke.spec.js"), "--grep", "boots Vue|blank bottom|retired", "--workers=1", "--trace=off"] },
];

const waveSteps = [
  ...fastSteps,
  { name: "profile and navigation interactions", command: nodeBin, args: [playwrightCli, "test", e2e("v13-release-smoke.spec.js"), "--grep", "profile|navigation|support", "--workers=1", "--trace=off"] },
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
  { name: "build", command: npmBin, args: ["run", "build"] },
  { name: "git diff check", command: "git", args: ["diff", "--check"] },
];

const steps = mode === "--fast" ? fastSteps : mode === "--wave" ? waveSteps : releaseSteps;

try {
  for (const step of steps) await runStep(step);
  console.log(`\n[v13-release-gate] PASS ${mode}`);
} catch (error) {
  console.error(`\n[v13-release-gate] FAIL ${mode}`);
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
