import { readFileSync, writeFileSync } from "node:fs";
import { ROUTE_TO_SCREEN } from "../src/utils/constants.js";
import { routeMeta } from "../src/utils/routeMeta.js";
import { pageRoutes } from "../src/pages/routePages.js";

const requiredRoutes = [
  "/home",
  "/jobs",
  "/my-jobs",
  "/calendar",
  "/wallet",
  "/profile",
  "/notifications",
  "/support",
  "/support/new",
  "/support/live",
  "/messages",
  "/reviews",
  "/leaderboard",
  "/referral",
  "/referral-earnings",
  "/job-referral",
  "/packages",
  "/subscription",
  "/package-builder",
  "/package-checkout",
  "/bonus",
  "/performance-score",
  "/customers",
  "/invoices",
  "/income-expense",
  "/appointment-link",
  "/satisfaction",
  "/partner-card-preview",
  "/about",
  "/photo-gallery",
  "/services",
  "/regions",
  "/working-hours",
  "/team",
  "/capacity",
  "/strategy",
  "/account-settings",
  "/notification-settings",
  "/contact-settings",
];

const missingRouteMap = requiredRoutes.filter((route) => !ROUTE_TO_SCREEN[route]);
const missingMeta = requiredRoutes.filter((route) => !routeMeta[route]);
const missingPageRoute = requiredRoutes.filter((route) => !pageRoutes[route]);

const legacySource = readFileSync("src/legacyApp.js", "utf8");
const appSource = readFileSync("src/app.js", "utf8");
const migrationStatus = readFileSync("MIGRATION_STATUS.md", "utf8");
const stillLegacyBoot = appSource.includes("./legacyApp.js");
const activeLegacyRender = /function render(Home|Work|Jobs|Calendar|Referral|GrowthPackages|Subscription)\b/.test(legacySource);
const p0Recorded = migrationStatus.includes("P0") && migrationStatus.includes("Vue migration");

const report = [
  "# V11 Architecture Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `- Required route count: ${requiredRoutes.length}`,
  `- Missing route map entries: ${missingRouteMap.length ? missingRouteMap.join(", ") : "none"}`,
  `- Missing route metadata entries: ${missingMeta.length ? missingMeta.join(", ") : "none"}`,
  `- Missing page route entries: ${missingPageRoute.length ? missingPageRoute.join(", ") : "none"}`,
  `- App still boots legacy shell: ${stillLegacyBoot ? "yes" : "no"}`,
  `- Active high-value legacy render functions present: ${activeLegacyRender ? "yes" : "no"}`,
  `- P0 migration debt documented: ${p0Recorded ? "yes" : "no"}`,
  "",
  "## Result",
  "",
  stillLegacyBoot || activeLegacyRender
    ? "V11 full Vue/Tailwind completion is not complete. This is an explicit release-candidate audit with remaining P0 migration debt."
    : "V11 full Vue/Tailwind completion criteria are structurally satisfied.",
  "",
];

writeFileSync("V11_ARCHITECTURE_AUDIT.md", `${report.join("\n")}\n`);

const hardFailures = [
  missingRouteMap.length && `Missing route map: ${missingRouteMap.join(", ")}`,
  missingMeta.length && `Missing route meta: ${missingMeta.join(", ")}`,
  missingPageRoute.length && `Missing page route: ${missingPageRoute.join(", ")}`,
  !p0Recorded && "P0 migration debt is not documented in MIGRATION_STATUS.md",
].filter(Boolean);

if (hardFailures.length) {
  console.error(hardFailures.join("\n"));
  process.exit(1);
}

console.log("V11 architecture audit completed with documented migration debt.");
