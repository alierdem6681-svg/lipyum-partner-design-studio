import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const rawSvgAllowed = new Set([
  "src/vue/components/ui/AppIcon.vue",
  "src/vue/components/profile/ProfileScoreRing.vue",
  "src/vue/components/profile/ProfileStrengthIllustration.vue",
]);

function walk(relativeDir) {
  const dir = path.join(root, relativeDir);
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const relative = path.relative(root, full).replaceAll("\\", "/");
    if (entry.isDirectory()) files.push(...walk(relative));
    else if (relative.endsWith(".vue")) files.push(relative);
  }
  return files;
}

for (const file of walk("src/vue")) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  if (source.includes(":style")) failures.push(`${file}: Vue :style binding is not allowed`);
  if (/\sstyle=/.test(source)) failures.push(`${file}: raw style attribute is not allowed`);
  if (/#[0-9a-fA-F]{3,8}\b/.test(source)) failures.push(`${file}: hard-coded hex color is not allowed`);
  if (!rawSvgAllowed.has(file) && /<svg\b/.test(source)) failures.push(`${file}: raw SVG markup is not allowed`);
}

if (failures.length) {
  console.error("[vue-style-debt] FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("[vue-style-debt] PASS: Vue templates are free of inline style, random hex, and raw SVG debt.");
