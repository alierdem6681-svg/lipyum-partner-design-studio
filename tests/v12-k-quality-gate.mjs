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

const mode = process.argv[2] || "--v12-k";
const allowedModes = new Set(["--stable-default", "--vue-preview", "--automated", "--release", "--v12-k"]);

if (!allowedModes.has(mode)) {
  console.error(`[v12-k-quality-gate] Unknown mode: ${mode}`);
  console.error("[v12-k-quality-gate] Use --stable-default, --vue-preview, --automated, --release or --v12-k.");
  process.exit(1);
}

const e2e = (file) => `tests/e2e/${file}`;
const unit = (file) => path.join("tests", "unit", file);

function runStep(step) {
  return new Promise((resolve, reject) => {
    console.log(`\n[v12-k-quality-gate] ${step.name}`);
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

const runtimeContractStep = {
  name: "runtime source contract",
  command: nodeBin,
  args: ["--test", unit("defaultRuntimeContract.test.js")],
};

const dependencyLockStep = {
  name: "dependency lock",
  command: npmBin,
  args: ["run", "test:dependency-lock"],
};

const syntaxStep = {
  name: "syntax check",
  command: npmBin,
  args: ["run", "check"],
};

const smokeTestStep = {
  name: "unit and route smoke",
  command: npmBin,
  args: ["test"],
};

const utf8IntegrityStep = {
  name: "UTF-8 integrity",
  command: npmBin,
  args: ["run", "test:utf8-integrity"],
};

const designReviewStep = {
  name: "trusted GitHub design review",
  command: npmBin,
  args: ["run", "test:design-review"],
};

const staticDesignContractStep = {
  name: "static design contract and guard self-protection",
  command: npmBin,
  args: ["run", "test:design-contract"],
};

const vueStyleDebtStep = {
  name: "no new Vue inline style or hard-coded color debt",
  command: npmBin,
  args: ["run", "test:no-vue-style-debt"],
};

const visualRegressionStep = {
  name: "stable-to-vue visual regression",
  command: npmBin,
  args: ["run", "test:visual-regression:v12-k"],
};

const shellActionsStep = {
  name: "header actions and navigation back stack",
  command: nodeBin,
  args: [playwrightCli, "test", e2e("v12-k2-shell-actions.spec.js"), "--trace=off", "--workers=1"],
};

const routeContractsStep = {
  name: "route header and bottom-bar contracts",
  command: nodeBin,
  args: [playwrightCli, "test", e2e("v12-k3-route-contracts.spec.js"), "--trace=off", "--workers=1"],
};

const buildStep = {
  name: "build",
  command: npmBin,
  args: ["run", "build"],
};

const gitDiffCheckStep = {
  name: "git diff check",
  command: "git",
  args: ["diff", "--check"],
};

const stableDefaultSteps = [
  runtimeContractStep,
  {
    name: "stable default runtime/design",
    command: nodeBin,
    args: [
      playwrightCli,
      "test",
      e2e("stable-design-default.spec.js"),
      "--trace=off",
      "--grep",
      "normal URLs use the stable|bottom bar remains centered",
      "--workers=2",
    ],
  },
];

const vuePreviewSteps = [
  runtimeContractStep,
  {
    name: "vue preview explicit flag",
    command: nodeBin,
    args: [
      playwrightCli,
      "test",
      e2e("stable-design-default.spec.js"),
      "--trace=off",
      "--grep",
      "Vue preview keeps stable",
      "--workers=1",
    ],
  },
];

const vuePreviewParitySpec = path.join(root, e2e("stable-vue-shell-parity.spec.js"));
if (existsSync(vuePreviewParitySpec)) {
  vuePreviewSteps.push({
    name: "vue preview shell parity",
    command: nodeBin,
    args: [playwrightCli, "test", e2e("stable-vue-shell-parity.spec.js"), "--trace=off", "--workers=1"],
  });
}

const steps = mode === "--stable-default"
  ? stableDefaultSteps
  : mode === "--vue-preview"
    ? vuePreviewSteps
    : mode === "--automated" || mode === "--release"
      ? [
        dependencyLockStep,
        syntaxStep,
        smokeTestStep,
        utf8IntegrityStep,
        staticDesignContractStep,
        vueStyleDebtStep,
        ...stableDefaultSteps,
        ...vuePreviewSteps.slice(1),
        shellActionsStep,
        routeContractsStep,
        visualRegressionStep,
        buildStep,
        gitDiffCheckStep,
      ]
      : [
          dependencyLockStep,
          utf8IntegrityStep,
          designReviewStep,
          staticDesignContractStep,
          vueStyleDebtStep,
          ...stableDefaultSteps,
          ...vuePreviewSteps.slice(1),
          shellActionsStep,
          visualRegressionStep,
          buildStep,
          gitDiffCheckStep,
        ];

try {
  for (const step of steps) await runStep(step);
  console.log(`\n[v12-k-quality-gate] PASS ${mode}`);
} catch (error) {
  console.error(`\n[v12-k-quality-gate] FAIL ${mode}`);
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
