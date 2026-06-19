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
  {
    name: "syntax",
    command: nodeBin,
    args: [script("check-js-syntax.mjs"), "src", "tests", "scripts"],
  },
  {
    name: "v12-g architecture",
    command: nodeBin,
    args: [
      "--test",
      architecture("vue-router.test.js"),
      architecture("package-feature-removed.test.js"),
      architecture("v12-g-route-components.test.js"),
    ],
  },
  {
    name: "blank and retired route product scope",
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
    name: "v12-g simple content routes",
    command: nodeBin,
    args: [playwrightCli, "test", "--workers=4", e2e("v12-g-simple-content-routes.spec.js")],
  },
  {
    name: "v12-g rich route outcomes",
    command: nodeBin,
    args: [playwrightCli, "test", "--workers=4", e2e("v12-g-rich-routes.spec.js")],
  },
  {
    name: "home strict visual parity",
    command: nodeBin,
    args: [script("compare-core-visual-parity.mjs"), "--strict"],
  },
  {
    name: "home content and interaction parity",
    command: nodeBin,
    args: [script("report-route-contract.mjs"), "--routes=/home", "--strict"],
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

async function waitForPreview(url) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 60_000) {
    if (await canReach(url)) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`preview server did not start at ${url}`);
}

async function ensurePreviewServer() {
  if (await canReach(previewUrl)) return null;
  const child = spawn(nodeBin, [viteCli, "--host", "127.0.0.1", "--port", String(previewPort)], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  await waitForPreview(previewUrl);
  return child;
}

function runStep(step) {
  return new Promise((resolve, reject) => {
    const child = spawn(step.command, step.args, {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, V12_FEATURE_URL: previewUrl },
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

const previewServer = await ensurePreviewServer();

try {
  for (const step of steps) {
    console.log(`\n[v12-g-quality-gate] ${step.name}`);
    await runStep(step);
  }
} finally {
  if (previewServer) previewServer.kill();
}

console.log("\n[v12-g-quality-gate] all checks passed");
