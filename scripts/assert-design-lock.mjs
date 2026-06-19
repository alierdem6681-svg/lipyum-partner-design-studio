import fs from "node:fs";
import path from "node:path";
import { DESIGN_SENSITIVE_PREFIXES, isDesignSensitivePath } from "./design-sensitive-paths.mjs";

const root = process.cwd();
const failures = [];
const rawSvgAllowed = new Set([
  "src/vue/components/ui/AppIcon.vue",
  "src/vue/components/profile/ProfileScoreRing.vue",
  "src/vue/components/profile/ProfileStrengthIllustration.vue",
]);

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`missing required file: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(fullPath, "utf8");
}

function walk(dir, predicate = () => true) {
  const base = path.join(root, dir);
  if (!fs.existsSync(base)) return [];
  const output = [];
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    const full = path.join(base, entry.name);
    const relative = path.relative(root, full).replaceAll("\\", "/");
    if (entry.isDirectory()) output.push(...walk(relative, predicate));
    else if (predicate(relative)) output.push(relative);
  }
  return output;
}

function requireIncludes(file, source, expected) {
  if (!source.includes(expected)) failures.push(`${file} must include ${JSON.stringify(expected)}`);
}

function forbidIncludes(file, source, forbidden) {
  if (source.includes(forbidden)) failures.push(`${file} must not include ${JSON.stringify(forbidden)}`);
}

const approvalShim = read("scripts/assert-design-approval.mjs");
requireIncludes("scripts/assert-design-approval.mjs", approvalShim, "./assert-design-review.mjs");
forbidIncludes("scripts/assert-design-approval.mjs", approvalShim, "DESIGN_APPROVED");
forbidIncludes("scripts/assert-design-approval.mjs", approvalShim, "DESIGN-APPROVED");

const reviewGuard = read("scripts/assert-design-review.mjs");
requireIncludes("scripts/assert-design-review.mjs", reviewGuard, "GITHUB_TOKEN");
requireIncludes("scripts/assert-design-review.mjs", reviewGuard, "PR_HEAD_SHA");
requireIncludes("scripts/assert-design-review.mjs", reviewGuard, "review.state === \"APPROVED\"");
requireIncludes("scripts/assert-design-review.mjs", reviewGuard, "review.user?.login === DESIGN_OWNER");
requireIncludes("scripts/assert-design-review.mjs", reviewGuard, "review.commit_id === expectedHead");
forbidIncludes("scripts/assert-design-review.mjs", reviewGuard, "DESIGN_APPROVED");
forbidIncludes("scripts/assert-design-review.mjs", reviewGuard, "DESIGN-APPROVED");

const workflow = read(".github/workflows/deploy-pages.yml");
forbidIncludes(".github/workflows/deploy-pages.yml", workflow, "branches:\n      - feature/v12-golden-vue-cutover");
requireIncludes(".github/workflows/deploy-pages.yml", workflow, "workflow_dispatch:");
requireIncludes(".github/workflows/deploy-pages.yml", workflow, "Design review gate");

const codeowners = read(".github/CODEOWNERS");
for (const requiredPath of ["/src/vue/", "/src/styles/", "/.github/workflows/", "/scripts/assert-design-*", "/package.json"]) {
  requireIncludes(".github/CODEOWNERS", codeowners, requiredPath);
}

for (const requiredPath of [
  "scripts/assert-design-review.mjs",
  "scripts/assert-design-lock.mjs",
  "scripts/assert-dependency-lock.mjs",
  "scripts/design-sensitive-paths.mjs",
  ".github/CODEOWNERS",
  ".github/workflows/",
  "package.json",
  "package-lock.json",
  ".npmrc",
  "src/vue/",
  "src/styles/",
  "tests/golden-master/",
]) {
  if (!isDesignSensitivePath(requiredPath)) failures.push(`design-sensitive list must include ${requiredPath}`);
}

if (DESIGN_SENSITIVE_PREFIXES.length < 20) {
  failures.push("design-sensitive list is unexpectedly narrow");
}

const appJs = read("src/app.js");
requireIncludes("src/app.js", appJs, "const useVueEngine = requestedEngine === \"vue\";");
requireIncludes("src/app.js", appJs, "markRuntime(\"legacy\")");
requireIncludes("src/app.js", appJs, "import(\"./legacyApp.js\")");
forbidIncludes("src/app.js", appJs, "const useLegacyEngine");

const partnerProfile = read("src/vue/components/profile/PartnerProfileCard.vue");
requireIncludes("PartnerProfileCard.vue", partnerProfile, "variant");
requireIncludes("PartnerProfileCard.vue", partnerProfile, "drawerBadgesExpanded");
requireIncludes("PartnerProfileCard.vue", partnerProfile, "partner-share-button");
requireIncludes("PartnerProfileCard.vue", partnerProfile, "partner-preview-button");
forbidIncludes("PartnerProfileCard.vue", partnerProfile, "hiddenBadges");

const drawerProfile = read("src/vue/components/drawer/DrawerProfileCard.vue");
requireIncludes("DrawerProfileCard.vue", drawerProfile, "PartnerProfileCard");
forbidIncludes("DrawerProfileCard.vue", drawerProfile, "drawer-avatar");

const drawerMenu = read("src/vue/components/drawer/DrawerMenuCard.vue");
requireIncludes("DrawerMenuCard.vue", drawerMenu, "toneClasses");
forbidIncludes("DrawerMenuCard.vue", drawerMenu, ":style");
forbidIncludes("DrawerMenuCard.vue", drawerMenu, "#344054");

const strengthCard = read("src/vue/components/profile/ProfileStrengthCard.vue");
requireIncludes("ProfileStrengthCard.vue", strengthCard, "ProfileStrengthIllustration");
forbidIncludes("ProfileStrengthCard.vue", strengthCard, "<svg");
forbidIncludes("ProfileStrengthCard.vue", strengthCard, "#");

const contract = JSON.parse(read("STABLE_DESIGN_CONTRACT.json") || "{}");
for (const key of ["header", "bottomBar", "drawer", "profile"]) {
  if (!contract.surfaces?.[key]) failures.push(`STABLE_DESIGN_CONTRACT.json missing surface: ${key}`);
}

for (const file of walk("src/vue", (relative) => relative.endsWith(".vue"))) {
  const source = read(file);
  if (source.includes(":style")) failures.push(`${file} must not use Vue :style bindings`);
  if (/\sstyle=/.test(source)) failures.push(`${file} must not use raw style attributes`);
  if (/#[0-9a-fA-F]{3,8}\b/.test(source)) failures.push(`${file} must not contain hard-coded hex colors`);
  if (!rawSvgAllowed.has(file) && /<svg\b/.test(source)) failures.push(`${file} must not contain raw SVG markup`);
}

if (failures.length) {
  console.error("[design-lock] FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("[design-lock] PASS: trusted design governance contract is protected.");
