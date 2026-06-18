import { spawn } from "node:child_process";

const steps = [
  {
    name: "syntax",
    command: "find src tests scripts -name '*.js' -print0 2>/dev/null | xargs -0 -r -n1 node_modules/node/bin/node --check",
  },
  {
    name: "architecture",
    command: "node_modules/node/bin/node --test tests/architecture/*.test.js",
  },
  {
    name: "route smoke",
    command: "node_modules/node/bin/node tests/routes.smoke.js",
  },
  {
    name: "bottom bar",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/bottom-bar.spec.js",
  },
  {
    name: "blank bottom routes",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/blank-bottom-routes.spec.js",
  },
  {
    name: "bottom labels",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/bottom-labels.spec.js",
  },
  {
    name: "product scope",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/v12-e-product-scope.spec.js",
  },
  {
    name: "retired package routes",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/retired-package-routes.spec.js",
  },
  {
    name: "subscription retained",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/subscription-retained.spec.js",
  },
  {
    name: "sidebar",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/sidebar.spec.js",
  },
  {
    name: "header consistency",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/header-consistency.spec.js",
  },
  {
    name: "mobile smoke",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/mobile.spec.js",
  },
  {
    name: "screenshot smoke",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/screenshots.spec.js",
  },
  {
    name: "build",
    command: "node_modules/node/bin/node node_modules/vite/bin/vite.js build",
  },
  {
    name: "git diff check",
    command: "git diff --check",
  },
];

function runStep(step) {
  return new Promise((resolve, reject) => {
    const child = spawn("bash", ["-lc", step.command], {
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
