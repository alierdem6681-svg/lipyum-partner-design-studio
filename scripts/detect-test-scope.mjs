import { execFileSync } from "node:child_process";

const changedFiles = process.argv.slice(2).length
  ? process.argv.slice(2)
  : execFileSync("git", ["diff", "--name-only", "origin/main...HEAD"], { encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean);

const scopes = new Set();

for (const file of changedFiles) {
  const normalized = file.replaceAll("\\", "/");
  if (normalized.includes("AppHeader") || normalized.includes("routeMeta")) scopes.add("header");
  if (normalized.includes("AppBottomBar") || normalized.includes("BOTTOM_TABS")) scopes.add("bottom-bar");
  if (normalized.includes("AppDrawer") || normalized.includes("Drawer") || normalized.includes("PartnerProfileCard")) scopes.add("drawer");
  if (normalized.includes("Profile")) scopes.add("profile");
  if (normalized.includes("router") || normalized.includes("navigation") || normalized.endsWith("src/app.js")) scopes.add("navigation");
  if (normalized.includes("Support") || normalized.includes("support")) scopes.add("support");
  if (normalized.includes("Reviews") || normalized.includes("Leaderboard") || normalized.includes("Subscription")) scopes.add("growth");
  if (normalized.includes("Referral") || normalized.includes("referral")) scopes.add("referral");
  if (normalized.includes("tokens") || normalized.includes("tailwind") || normalized.includes("styles/")) scopes.add("shared-shell");
  if (normalized.includes(".github/") || normalized.includes("package") || normalized.includes("scripts/")) scopes.add("release");
}

if (!scopes.size) scopes.add("smoke");

console.log([...scopes].sort().join(","));
