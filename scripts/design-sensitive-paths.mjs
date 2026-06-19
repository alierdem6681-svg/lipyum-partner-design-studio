export const DESIGN_OWNER = "alierdem6681-svg";

export const DESIGN_SENSITIVE_PREFIXES = [
  ".github/CODEOWNERS",
  ".github/workflows/",
  ".npmrc",
  "DESIGN_LOCK.md",
  "STABLE_DESIGN_CONTRACT.json",
  "STABLE_DESIGN_GOLDEN_MANIFEST.json",
  "STABLE_TO_VUE_TOKEN_MAP.md",
  "index.html",
  "package.json",
  "package-lock.json",
  "playwright.config.js",
  "postcss.config.cjs",
  "tailwind.config.cjs",
  "vite.config.js",
  "public/",
  "scripts/assert-dependency-lock.mjs",
  "scripts/assert-design-approval.mjs",
  "scripts/assert-design-lock.mjs",
  "scripts/assert-design-review.mjs",
  "scripts/design-sensitive-paths.mjs",
  "scripts/run-v12k-visual-regression.mjs",
  "src/app.js",
  "src/components/",
  "src/pages/",
  "src/styles/",
  "src/utils/constants.js",
  "src/utils/routeMeta.js",
  "src/vue/",
  "tests/e2e/",
  "tests/golden-master/",
  "tests/v12-k-quality-gate.mjs",
];

export function normalizePath(filePath) {
  return filePath.replaceAll("\\", "/").replace(/^\.\//, "");
}

export function isDesignSensitivePath(filePath) {
  const normalized = normalizePath(filePath);
  return DESIGN_SENSITIVE_PREFIXES.some((prefix) => normalized === prefix || normalized.startsWith(prefix));
}
