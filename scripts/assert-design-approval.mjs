import { spawnSync } from "node:child_process";

const approvalToken = "DESIGN-APPROVED-BY-DENIZKAN";
const sensitivePrefixes = [
  ".github/workflows/",
  "index.html",
  "src/app.js",
  "src/styles/",
  "src/vue/components/ui/AppHeader.vue",
  "src/vue/components/ui/AppBottomBar.vue",
  "src/vue/components/ui/AppDrawer.vue",
  "src/vue/components/profile/",
  "src/vue/components/drawer/",
  "src/vue/layouts/",
  "src/vue/styles/",
  "tests/e2e/stable-design-default.spec.js",
  "tests/e2e/stable-vue-shell-parity.spec.js",
  "tests/golden-master/",
  "STABLE_DESIGN_CONTRACT.json",
  "STABLE_DESIGN_GOLDEN_MANIFEST.json",
  "STABLE_TO_VUE_TOKEN_MAP.md",
];

function git(args, options = {}) {
  const result = spawnSync("git", args, { encoding: "utf8", ...options });
  if (result.status !== 0) {
    throw new Error(result.stderr || `git ${args.join(" ")} failed`);
  }
  return result.stdout.trim();
}

function normalize(file) {
  return file.replaceAll("\\", "/");
}

const base = process.env.DESIGN_APPROVAL_BASE || "HEAD^";
const head = process.env.DESIGN_APPROVAL_HEAD || "HEAD";
let changed = [];

try {
  changed = git(["diff", "--name-only", `${base}..${head}`]).split(/\r?\n/).filter(Boolean).map(normalize);
} catch {
  changed = git(["diff", "--name-only", "--cached"]).split(/\r?\n/).filter(Boolean).map(normalize);
}

const sensitiveChanged = changed.filter((file) =>
  sensitivePrefixes.some((prefix) => file === prefix || file.startsWith(prefix)),
);

if (!sensitiveChanged.length) {
  console.log("[design-approval] PASS: no design-sensitive files changed.");
  process.exit(0);
}

const commitMessage = git(["log", "-1", "--pretty=%B"]);
const approvedByEnv = process.env.DESIGN_APPROVED === "true";
const approvedByCommit = commitMessage.includes(approvalToken);

if (approvedByEnv || approvedByCommit) {
  console.log("[design-approval] PASS: design-sensitive changes include explicit approval.");
  process.exit(0);
}

console.error("[design-approval] FAIL: design-sensitive files changed without explicit approval.");
console.error(`Required commit token: ${approvalToken}`);
for (const file of sensitiveChanged) console.error(`- ${file}`);
process.exit(1);
