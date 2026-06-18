import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const reportPath = path.join(root, "tests/golden-master/v11-stable/V12_VISUAL_PARITY_REPORT.json");
const appJsPath = path.join(root, "src/app.js");

const report = JSON.parse(await fs.readFile(reportPath, "utf8"));
const appJs = await fs.readFile(appJsPath, "utf8");
const failingRoutes = report.results.filter((item) => item.status !== "PASS");
const isDefaultVueCutover = !appJs.includes("params.get(\"engine\") === \"vue\"");

if (failingRoutes.length && isDefaultVueCutover) {
  console.error("V12 parity failed but app.js appears to boot Vue by default. Cutover is unsafe.");
  for (const item of failingRoutes) {
    console.error(`- ${item.route}: ${item.status}`);
  }
  process.exit(1);
}

if (failingRoutes.length) {
  console.log("[v12-parity-gate] parity differences remain; Vue default cutover is correctly blocked.");
  for (const item of failingRoutes) {
    console.log(`- ${item.route}: ${item.status}`);
  }
  process.exit(0);
}

console.log("[v12-parity-gate] all checked routes passed parity.");

