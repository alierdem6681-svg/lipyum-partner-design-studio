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

function isZeroSha(value) {
  return /^0{40}$/.test(value || "");
}

function splitLines(value) {
  return value.split(/\r?\n/).filter(Boolean);
}

function changedFiles(base, head) {
  if (base && !isZeroSha(base)) {
    try {
      return splitLines(git(["diff", "--name-only", `${base}..${head}`])).map(normalize);
    } catch {
      // Fall through to single-commit or staged fallback.
    }
  }

  try {
    return splitLines(git(["diff-tree", "--no-commit-id", "--name-only", "-r", head])).map(normalize);
  } catch {
    return splitLines(git(["diff", "--name-only", "--cached"])).map(normalize);
  }
}

function approvalMessages(base, head) {
  if (base && !isZeroSha(base)) {
    try {
      return git(["log", "--pretty=%B", `${base}..${head}`]);
    } catch {
      // Fall through to head message.
    }
  }

  return git(["log", "-1", "--pretty=%B", head]);
}

const base = process.env.DESIGN_APPROVAL_BASE || "HEAD^";
const head = process.env.DESIGN_APPROVAL_HEAD || "HEAD";
const changed = changedFiles(base, head);

const sensitiveChanged = changed.filter((file) =>
  sensitivePrefixes.some((prefix) => file === prefix || file.startsWith(prefix)),
);

if (!sensitiveChanged.length) {
  console.log("[design-approval] PASS: no design-sensitive files changed.");
  process.exit(0);
}

const commitMessage = approvalMessages(base, head);
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
