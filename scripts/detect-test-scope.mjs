import { execFileSync } from "node:child_process";

function gitLines(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8" })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch {
    return [];
  }
}

const changedFiles = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
    ...gitLines(["diff", "--name-only", "origin/main...HEAD"]),
    ...gitLines(["diff", "--name-only"]),
    ...gitLines(["diff", "--cached", "--name-only"]),
    ...gitLines(["ls-files", "--others", "--exclude-standard"]),
  ];

const scopes = new Set();

for (const file of changedFiles) {
  const normalized = file.replaceAll("\\", "/");
  const basename = normalized.split("/").pop() || normalized;
  if (normalized.includes("AppHeader") || normalized.includes("routeMeta")) scopes.add("header");
  if (normalized.includes("AppBottomBar") || normalized.includes("BOTTOM_TABS")) scopes.add("bottom-bar");
  if (normalized.includes("AppDrawer") || normalized.includes("Drawer") || normalized.includes("PartnerProfileCard")) scopes.add("drawer");
  if (normalized.includes("Profile")) scopes.add("profile");
  if (normalized.includes("Calendar") || normalized.includes("appointment") || normalized.includes("randevu")) scopes.add("calendar");
  if (normalized.includes("Jobs") || normalized.includes("jobs") || normalized.includes("jobOpportunities")) scopes.add("jobs");
  if (normalized.includes("Wallet") || normalized.includes("wallet")) scopes.add("wallet");
  if (normalized.includes("router") || normalized.includes("navigation") || normalized.endsWith("src/app.js")) scopes.add("navigation");
  if (normalized.includes("Support") || normalized.includes("support")) scopes.add("support");
  if (normalized.includes("Reviews") || normalized.includes("Leaderboard") || normalized.includes("Subscription")) scopes.add("growth");
  if (normalized.includes("Referral") || normalized.includes("referral")) scopes.add("referral");
  if (normalized.includes("tokens") || normalized.includes("tailwind") || normalized.includes("styles/")) scopes.add("shared-shell");
  if (normalized.includes(".github/") || basename === "package.json" || basename === "package-lock.json" || basename === "playwright.config.js") {
    scopes.add("release");
  } else if (normalized.includes("tests/v13-release-gate.mjs") || normalized.includes("scripts/detect-test-scope.mjs")) {
    scopes.add("gate");
  } else if (normalized.includes("scripts/")) {
    scopes.add("automation");
  }
}

if (!scopes.size) scopes.add("smoke");

console.log([...scopes].sort().join(","));
