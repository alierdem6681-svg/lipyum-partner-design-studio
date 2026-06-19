import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const roots = ["src", "scripts", "tests"];
const blockedPatterns = [
  new RegExp("\\u00c3"),
  new RegExp("\\u00c5"),
  new RegExp("\\u00c4"),
  new RegExp("\\u00e2\\u2030"),
  new RegExp("\\u00c2"),
];
const ignoredSegments = [
  `${path.sep}tests${path.sep}golden-master${path.sep}`,
  `${path.sep}node_modules${path.sep}`,
  `${path.sep}dist${path.sep}`,
  `${path.sep}artifacts${path.sep}`,
];
const extensions = new Set([".js", ".mjs", ".vue", ".json", ".md", ".yml", ".yaml"]);

function walk(dir, output = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      if (!ignoredSegments.some((segment) => `${fullPath}${path.sep}`.includes(segment))) {
        walk(fullPath, output);
      }
      continue;
    }
    if (extensions.has(path.extname(fullPath))) output.push(fullPath);
  }
  return output;
}

const offenders = [];

for (const item of roots) {
  const dir = path.join(root, item);
  for (const file of walk(dir)) {
    const text = readFileSync(file, "utf8");
    const lines = text.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (blockedPatterns.some((pattern) => pattern.test(line))) {
        offenders.push(`${path.relative(root, file)}:${index + 1}: ${line.trim()}`);
      }
    });
  }
}

if (offenders.length) {
  console.error("[utf8-integrity] FAIL: mojibake-like sequences found.");
  for (const offender of offenders) console.error(`- ${offender}`);
  process.exit(1);
}

console.log("[utf8-integrity] PASS: no mojibake-like sequences found in active source.");
