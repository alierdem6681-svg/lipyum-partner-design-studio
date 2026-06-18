import { spawn } from "node:child_process";

const steps = [
  { name: "quality-gate", command: "node_modules/node/bin/node tests/quality-gate.mjs" },
  { name: "test:cta-mist", command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/cta-mist.spec.js" },
  { name: "test:notification-header", command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/notification-header.spec.js" },
  { name: "test:profile-grid-geometry", command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/profile-grid-geometry.spec.js" },
  { name: "v11-audit", command: "node_modules/node/bin/node tests/v11-audit.mjs" },
  { name: "build", command: "node_modules/node/bin/node node_modules/vite/bin/vite.js build" },
  { name: "git diff --check", command: "git diff --check" },
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
  console.log(`\n[v11-quality-gate] ${step.name}`);
  await runStep(step);
}

console.log("\n[v11-quality-gate] all checks passed");
