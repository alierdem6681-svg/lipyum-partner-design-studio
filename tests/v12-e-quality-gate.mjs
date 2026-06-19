import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nodeBin = process.platform === "win32"
  ? path.join(root, "node_modules", "node", "bin", "node.exe")
  : path.join(root, "node_modules", "node", "bin", "node");
const playwrightCli = path.join(root, "node_modules", "@playwright", "test", "cli.js");
const viteCli = path.join(root, "node_modules", "vite", "bin", "vite.js");
const e2e = (file) => `tests/e2e/${file}`;
const coreE2eSpecs = [
  "bottom-bar.spec.js",
  "blank-bottom-routes.spec.js",
  "bottom-labels.spec.js",
  "v12-e-product-scope.spec.js",
  "retired-package-routes.spec.js",
  "subscription-retained.spec.js",
  "sidebar.spec.js",
  "header-consistency.spec.js",
  "v12-compatibility.spec.js",
].map(e2e);

function architectureTests() {
  const dir = path.join(root, "tests", "architecture");
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".test.js"))
    .map((file) => path.join("tests", "architecture", file));
}

const steps = [
  {
    name: "syntax",
    command: nodeBin,
    args: [path.join("scripts", "check-js-syntax.mjs"), "src", "tests", "scripts"],
  },
  {
    name: "architecture",
    command: nodeBin,
    args: ["--test", ...architectureTests()],
  },
  {
    name: "route smoke",
    command: nodeBin,
    args: [path.join("tests", "routes.smoke.js")],
  },
  {
    name: "core e2e",
    command: nodeBin,
    args: [playwrightCli, "test", "--workers=4", ...coreE2eSpecs],
  },
  {
    name: "mobile smoke",
    command: nodeBin,
    args: [playwrightCli, "test", "--fully-parallel", "--workers=4", e2e("mobile.spec.js")],
  },
  {
    name: "screenshot smoke",
    command: nodeBin,
    args: [playwrightCli, "test", e2e("screenshots.spec.js")],
  },
  {
    name: "build",
    command: nodeBin,
    args: [viteCli, "build"],
  },
  {
    name: "git diff check",
    command: "git",
    args: ["diff", "--check"],
  },
];

function runStep(step) {
  return new Promise((resolve, reject) => {
    const child = spawn(step.command, step.args, {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${step.name} failed with exit code ${code}`));
    });
  });
}

for (const step of steps) {
  console.log(`\n[v12-e-quality-gate] ${step.name}`);
  await runStep(step);
}

console.log("\n[v12-e-quality-gate] all checks passed");
