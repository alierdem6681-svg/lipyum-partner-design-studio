import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const visualPath = path.join(root, "tests/golden-master/v11-stable/V12_VISUAL_PARITY_REPORT.json");
const contractPath = path.join(root, "tests/golden-master/v12-feature-preview/V12_ROUTE_CONTRACT_REPORT.json");
const visualOnly = process.argv.includes("--visual-only");
const contractOnly = process.argv.includes("--contract-only");

async function readJson(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read ${path.relative(root, filePath)}: ${error.message}`);
  }
}

const failures = [];

if (!contractOnly) {
  const visual = await readJson(visualPath);
  for (const result of visual.results || []) {
    if (result.status !== "PASS") {
      failures.push({
        kind: "visual",
        route: result.route,
        status: result.status,
        details: Object.entries(result.diff || {})
          .filter(([, value]) => value === false)
          .map(([key]) => key),
      });
    }
  }
}

if (!visualOnly) {
  const contract = await readJson(contractPath);
  for (const result of contract.results || []) {
    if (result.status !== "PASS") {
      failures.push({
        kind: "contract",
        route: result.route,
        status: result.status,
        details: (result.diffs || [])
          .filter((diff) => diff.severity === "P0" || diff.severity === "P1")
          .map((diff) => `${diff.severity}:${diff.name}`),
      });
    }
  }
}

if (failures.length) {
  console.error("[v12-strict-parity] blocking parity failures remain:");
  for (const failure of failures) {
    console.error(`- ${failure.kind} ${failure.route}: ${failure.status} ${failure.details.join(", ")}`);
  }
  process.exit(1);
}

console.log("[v12-strict-parity] all checked visual and contract parity gates passed.");
