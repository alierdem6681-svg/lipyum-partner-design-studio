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
const previewPort = Number(process.env.V12_GATE_PREVIEW_PORT || "56390");
const previewUrl = process.env.V12_FEATURE_URL || `http://127.0.0.1:${previewPort}`;

const e2e = (file) => `tests/e2e/${file}`;
const architecture = (file) => `tests/architecture/${file}`;
const script = (file) => `scripts/${file}`;

const architectureFiles = [
  "default-vue-runtime.test.js",
  "explicit-legacy-rollback.test.js",
  "no-active-legacy-content-bridge.test.js",
  "no-legacy-boot.test.js",
  "no-legacy-default-boot.test.js",
  "package-feature-removed.test.js",
  "v12-f-route-migration.test.js",
  "v12-g-route-components.test.js",
  "vue-root.test.js",
  "vue-router-owns-navigation.test.js",
  "vue-router.test.js",
].map(architecture);

const steps = [
  { name: "syntax", command: nodeBin, args: [script("check-js-syntax.mjs"), "src", "tests", "scripts"] },
  { name: "lint", command: nodeBin, args: [script("check-js-syntax.mjs"), "src", "tests", "scripts"] },
  { name: "architecture", command: nodeBin, args: ["--test", ...architectureFiles] },
  {
    name: "default Vue runtime acceptance",
    command: nodeBin,
    args: [playwrightCli, "test", "--workers=4", e2e("v12-j-runtime-acceptance.spec.js")],
  },
  {
    name: "product scope and redirects",
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
    name: "rich route outcomes",
    command: nodeBin,
    args: [playwrightCli, "test", "--workers=4", e2e("v12-g-rich-routes.spec.js")],
  },
  {
    name: "home default Product Golden parity",
    command: nodeBin,
    args: [script("compare-v12-product-home-parity.mjs"), "--strict"],
    env: {
      V12_FEATURE_URL: previewUrl,
      V12_PRODUCT_REPORT_DIR: path.join(root, "artifacts", "v12-j", "product-home-parity"),
    },
  },
  {
    name: "home default content and interaction contract",
    command: nodeBin,
    args: [script("assert-v12-product-home-contract.mjs"), "--strict"],
    env: {
      V12_FEATURE_URL: previewUrl,
      V12_PRODUCT_REPORT_DIR: path.join(root, "artifacts", "v12-j", "product-home-contract"),
    },
  },
  {
    name: "accessibility",
    command: nodeBin,
    args: [playwrightCli, "test", "--workers=2", e2e("accessibility.spec.js")],
  },
  {
    name: "clickable outcome coverage",
    command: nodeBin,
    args: [playwrightCli, "test", "--workers=2", e2e("clickable-inventory.spec.js")],
  },
  {
    name: "performance smoke",
    command: nodeBin,
    args: [playwrightCli, "test", "--workers=1", e2e("performance.spec.js")],
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
    console.log(`\n[v12-j-quality-gate] ${step.name}`);
    const child = spawn(step.command, step.args, {
      cwd: root,
      stdio: "inherit",
      shell: process.platform === "win32",
      env: { ...process.env, V12_FEATURE_URL: previewUrl, ...(step.env || {}) },
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
  console.log("\n[v12-j-quality-gate] PASS");
} finally {
  if (previewProcess) previewProcess.kill();
}
