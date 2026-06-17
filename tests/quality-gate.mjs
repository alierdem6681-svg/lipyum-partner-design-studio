import { spawn } from "node:child_process";

const steps = [
  {
    name: "check",
    command: "find src tests -name '*.js' -print0 2>/dev/null | xargs -0 -r -n1 node_modules/node/bin/node --check",
  },
  {
    name: "lint",
    command: "find src tests -name '*.js' -print0 2>/dev/null | xargs -0 -r -n1 node_modules/node/bin/node --check",
  },
  {
    name: "test",
    command: "node_modules/node/bin/node --test tests/unit/*.test.js && node_modules/node/bin/node tests/routes.smoke.js",
  },
  {
    name: "test:routes",
    command: "node_modules/node/bin/node tests/routes.smoke.js",
  },
  {
    name: "test:e2e",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/routes.spec.js tests/e2e/back-button.spec.js tests/e2e/accessibility.spec.js tests/e2e/geometry.spec.js",
  },
  {
    name: "test:e2e:mobile",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/mobile.spec.js",
  },
  {
    name: "test:accessibility",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/accessibility.spec.js",
  },
  {
    name: "test:interactions",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/sidebar.spec.js tests/e2e/bottom-bar.spec.js tests/e2e/core-interactions.spec.js tests/e2e/navigation-contract.spec.js tests/e2e/forms-and-filters.spec.js",
  },
  {
    name: "test:sidebar",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/sidebar.spec.js",
  },
  {
    name: "test:bottom-bar",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/bottom-bar.spec.js",
  },
  {
    name: "test:navigation-contract",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/navigation-contract.spec.js",
  },
  {
    name: "test:forms",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/forms-and-filters.spec.js",
  },
  {
    name: "test:device-matrix",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/device-matrix.spec.js",
  },
  {
    name: "test:performance",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/performance.spec.js",
  },
  {
    name: "test:visual-alignment",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/visual-alignment.spec.js",
  },
  {
    name: "test:deeplinks",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/deeplinks.spec.js",
  },
  {
    name: "test:satisfaction",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/satisfaction.spec.js",
  },
  {
    name: "test:home-flow",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/home-flow.spec.js",
  },
  {
    name: "test:packages-flow",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/packages-flow.spec.js",
  },
  {
    name: "test:referral-flow",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/referral-flow.spec.js",
  },
  {
    name: "test:support-ticket",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/support-ticket.spec.js",
  },
  {
    name: "test:profile-badges",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/profile-badges.spec.js",
  },
  {
    name: "test:clickable-inventory",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/clickable-inventory.spec.js",
  },
  {
    name: "test:visual-regression",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/visual-regression.spec.js",
  },
  {
    name: "test:visual-qa-report",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/visual-qa-report.spec.js",
  },
  {
    name: "test:text-overflow",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/text-overflow.spec.js",
  },
  {
    name: "test:touch-targets",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/touch-targets.spec.js",
  },
  {
    name: "test:header-consistency",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/header-consistency.spec.js",
  },
  {
    name: "test:back-stack-stress",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/back-stack-stress.spec.js",
  },
  {
    name: "test:modal-sheet-drawer",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/modal-sheet-drawer.spec.js",
  },
  {
    name: "test:all-routes-interactions",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/all-routes-interactions.spec.js",
  },
  {
    name: "test:v10-quality-automation",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/v10-quality-automation.spec.js",
  },
  {
    name: "test:screenshots",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/screenshots.spec.js",
  },
  {
    name: "build",
    command: "node_modules/node/bin/node node_modules/vite/bin/vite.js build",
  },
  {
    name: "git diff --check",
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
  console.log(`\n[quality-gate] ${step.name}`);
  await runStep(step);
}

console.log("\n[quality-gate] all checks passed");
