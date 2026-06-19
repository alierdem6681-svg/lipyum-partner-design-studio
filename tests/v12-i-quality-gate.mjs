import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nodeBin = process.platform === "win32"
  ? path.join(root, "node_modules", "node", "bin", "node.exe")
  : path.join(root, "node_modules", "node", "bin", "node");
const playwrightCli = path.join(root, "node_modules", "@playwright", "test", "cli.js");
const viteCli = path.join(root, "node_modules", "vite", "bin", "vite.js");
const previewPort = Number(process.env.V12_GATE_PREVIEW_PORT || "56389");
const previewUrl = process.env.V12_FEATURE_URL || `http://127.0.0.1:${previewPort}`;

const e2e = (file) => `tests/e2e/${file}`;
const architecture = (file) => `tests/architecture/${file}`;
const script = (file) => `scripts/${file}`;

const steps = [
  { name: "syntax", command: nodeBin, args: [script("check-js-syntax.mjs"), "src", "tests", "scripts"] },
  {
    name: "architecture",
    command: nodeBin,
    args: [
      "--test",
      architecture("vue-root.test.js"),
      architecture("vue-router.test.js"),
      architecture("package-feature-removed.test.js"),
      architecture("v12-g-route-components.test.js"),
    ],
  },
  {
    name: "product scope",
    command: nodeBin,
    args: [
      playwrightCli,
      "test",
      "--workers=4",
      e2e("blank-bottom-routes.spec.js"),
      e2e("retired-package-routes.spec.js"),
      e2e("subscription-retained.spec.js"),
      e2e("v12-e-product-scope.spec.js"),
    ],
  },
  {
    name: "v12 route outcomes",
    command: nodeBin,
    args: [playwrightCli, "test", "--workers=4", e2e("v12-g-rich-routes.spec.js")],
  },
  {
    name: "home v12 product parity",
    command: nodeBin,
    args: [script("compare-v12-product-home-parity.mjs"), "--strict"],
    env: { V12_FEATURE_URL: previewUrl },
  },
  {
    name: "home content and interaction parity",
    command: nodeBin,
    args: [script("assert-v12-product-home-contract.mjs"), "--strict"],
    env: { V12_FEATURE_URL: previewUrl },
  },
  { name: "build", command: nodeBin, args: [viteCli, "build"] },
  { name: "git diff check", command: "git", args: ["diff", "--check"] },
];

function canReach(url) {
  return new Promise((resolve) => {
    const request = http.get(url, (response) => {
      response.resume();
      resolve(response.statusCode >= 200 && response.statusCode < 500);
    });
    request.on("error", () => resolve(false));
    request.setTimeout(1500, () => {
      request.destroy();
      resolve(false);
    });
  });
}

function runStep(step) {
  return new Promise((resolve, reject) => {
    console.log(`\n[v12-i-quality-gate] ${step.name}`);
    const child = spawn(step.command, step.args, {
      cwd: root,
      stdio: "inherit",
      shell: process.platform === "win32",
      env: { ...process.env, ...(step.env || {}) },
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${step.name} failed with exit code ${code}`));
    });
  });
}

let previewProcess = null;
if (!(await canReach(previewUrl))) {
  previewProcess = spawn(nodeBin, [viteCli, "--host", "127.0.0.1", "--port", String(previewPort)], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  const started = Date.now();
  while (!(await canReach(previewUrl))) {
    if (Date.now() - started > 20_000) throw new Error("Vite preview did not start");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

try {
  for (const step of steps) await runStep(step);
  console.log("\n[v12-i-quality-gate] PASS");
} finally {
  if (previewProcess) previewProcess.kill();
}
