import { spawn } from "node:child_process";

const repeat = Number(process.env.V12_A_REPEAT || 1);
const steps = [
  {
    name: "check",
    command: "find src tests -name '*.js' -print0 2>/dev/null | xargs -0 -r -n1 node_modules/node/bin/node --check",
  },
  {
    name: "architecture",
    command: "node_modules/node/bin/node --test tests/architecture/*.test.js",
  },
  {
    name: "compatibility-routes",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/v12-compatibility-routes.spec.js",
  },
  {
    name: "shell",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/v12-shell.spec.js",
  },
  {
    name: "core-routes",
    command: "node_modules/node/bin/node node_modules/@playwright/test/cli.js test tests/e2e/v12-home.spec.js tests/e2e/v12-jobs.spec.js tests/e2e/v12-my-jobs.spec.js tests/e2e/v12-calendar.spec.js",
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

for (let cycle = 1; cycle <= repeat; cycle += 1) {
  console.log(`\n[v12-a-quality-gate] cycle ${cycle}/${repeat}`);
  for (const step of steps) {
    console.log(`\n[v12-a-quality-gate] ${step.name}`);
    await runStep(step);
  }
}

console.log("\n[v12-a-quality-gate] all checks passed");
