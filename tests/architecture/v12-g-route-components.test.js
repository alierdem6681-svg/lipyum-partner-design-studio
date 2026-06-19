import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const routerSource = fs.readFileSync(path.join(root, "src/vue/router/index.js"), "utf8");
const appSource = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
const contentRouteSource = fs.readFileSync(path.join(root, "src/vue/pages/ContentRoutePage.vue"), "utf8");
const activeRouteSource = fs.readFileSync(path.join(root, "src/vue/data/activeRouteContent.js"), "utf8");

const blankRoutes = [
  { route: "/jobs", component: "JobsPage", file: "JobsPage.vue" },
  { route: "/my-jobs", component: "MyJobsPage", file: "MyJobsPage.vue" },
  { route: "/calendar", component: "CalendarPage", file: "CalendarPage.vue" },
  { route: "/wallet", component: "WalletPage", file: "WalletPage.vue" },
];

const simpleRoutes = [
  "/about",
  "/services",
  "/regions",
  "/working-hours",
  "/team",
  "/capacity",
  "/strategy",
  "/account-settings",
  "/notification-settings",
  "/contact-settings",
  "/bonus",
  "/performance-score",
  "/customers",
  "/invoices",
  "/income-expense",
  "/appointment-link",
];

const richRoutes = [
  { route: "/profile", component: "ProfilePage", file: "ProfilePage.vue" },
  { route: "/partner-card-preview", component: "PartnerCardPreviewPage", file: "PartnerCardPreviewPage.vue" },
  { route: "/photo-gallery", component: "PhotoGalleryPage", file: "PhotoGalleryPage.vue" },
  { route: "/notifications", component: "NotificationsPage", file: "NotificationsPage.vue" },
  { route: "/support", component: "SupportPage", file: "SupportPage.vue" },
  { route: "/support/new", component: "CreateTicketPage", file: "CreateTicketPage.vue" },
  { route: "/support/live", component: "LiveSupportPage", file: "LiveSupportPage.vue" },
  { route: "/support/customer-service", component: "CustomerServicePage", file: "CustomerServicePage.vue" },
  { route: "/messages", component: "MessagesPage", file: "MessagesPage.vue" },
  { route: "/satisfaction", component: "SatisfactionPage", file: "SatisfactionPage.vue" },
  { route: "/reviews", component: "ReviewsPage", file: "ReviewsPage.vue" },
  { route: "/leaderboard", component: "LeaderboardPage", file: "LeaderboardPage.vue" },
  { route: "/subscription", component: "SubscriptionPage", file: "SubscriptionPage.vue" },
  { route: "/referral", component: "ReferralPage", file: "ReferralPage.vue" },
  { route: "/partners", component: "ReferralPartnersPage", file: "ReferralPartnersPage.vue" },
  { route: "/referral/tasks", component: "ReferralTasksPage", file: "ReferralTasksPage.vue" },
  { route: "/referral/partners", component: "ReferralPartnersPage", file: "ReferralPartnersPage.vue" },
  { route: "/referral/partner/:id", component: "ReferralPartnerDetailPage", file: "ReferralPartnerDetailPage.vue" },
  { route: "/referral-earnings", component: "ReferralEarningsPage", file: "ReferralEarningsPage.vue" },
  { route: "/job-referral", component: "JobReferralPage", file: "JobReferralPage.vue" },
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pagePath(file) {
  return path.join(root, "src/vue/pages", file);
}

function routeBlock(route) {
  const match = new RegExp(`path\\s*:\\s*["']${escapeRegex(route)}["'][\\s\\S]{0,800}`).exec(routerSource);
  return match?.[0] || "";
}

function routeUsesComponent(route, component, file) {
  const block = routeBlock(route);
  const componentPattern = new RegExp(`component\\s*:\\s*${component}\\b`);
  const lazyPattern = new RegExp(`import\\(["'][^"']*${escapeRegex(file)}["']\\)`);
  const routeMapPattern = new RegExp(`["']${escapeRegex(route)}["']\\s*:\\s*${component}\\b`);
  return componentPattern.test(block) || lazyPattern.test(block) || routeMapPattern.test(routerSource);
}

function simpleRouteUsesContentPage(route) {
  const explicitRoute = routeUsesComponent(route, "ContentRoutePage", "ContentRoutePage.vue");
  const simpleSetPattern = new RegExp(`simpleContentRoutes[\\s\\S]*["']${escapeRegex(route)}["']`);
  const simpleMapperPattern = /simpleContentRoutes\.has\(route\)[\s\S]{0,500}component\s*:\s*ContentRoutePage/.test(routerSource);
  return explicitRoute || (simpleSetPattern.test(routerSource) && simpleMapperPattern);
}

test("V12-G router keeps hash history, blank routes and retired redirects explicit", () => {
  assert.match(routerSource, /createWebHashHistory\(\)/, "Vue Router must preserve hash URLs");
  assert.doesNotMatch(routerSource, /LegacyContentBridge/, "active routes must not use LegacyContentBridge");

  for (const item of blankRoutes) {
    assert.ok(fs.existsSync(pagePath(item.file)), `${item.file} must exist`);
    assert.ok(routeUsesComponent(item.route, item.component, item.file), `${item.route} must use ${item.component}`);
  }

  for (const route of ["/packages", "/package-builder", "/package-checkout"]) {
    const block = routeBlock(route);
    assert.match(block, /redirect\s*:\s*["']\/subscription["']/, `${route} must redirect to /subscription`);
  }
});

test("V12-G rich routes use dedicated Vue SFC pages, not ContentRoutePage", () => {
  const offenders = [];

  for (const item of richRoutes) {
    if (!fs.existsSync(pagePath(item.file))) offenders.push(`${item.route}: missing ${item.file}`);
    if (!routeUsesComponent(item.route, item.component, item.file)) offenders.push(`${item.route}: not routed to ${item.component}`);
    if (/component\s*:\s*ContentRoutePage\b/.test(routeBlock(item.route))) offenders.push(`${item.route}: still routed to ContentRoutePage`);
  }

  assert.deepEqual(offenders, []);
});

test("V12-G simple routes are the only product routes allowed on clean ContentRoutePage", () => {
  assert.ok(fs.existsSync(pagePath("ContentRoutePage.vue")), "ContentRoutePage.vue must exist for simple routes");

  const offenders = [];
  for (const route of simpleRoutes) {
    if (!simpleRouteUsesContentPage(route)) {
      offenders.push(`${route}: must be routed to ContentRoutePage`);
    }
  }

  const activeContentMapper = /activeRoutePaths[\s\S]{0,700}component\s*:\s*ContentRoutePage/.test(routerSource);
  if (activeContentMapper) {
    assert.match(
      routerSource,
      /simpleContentRoutes\.has\(route\)/,
      "ContentRoutePage mapping must be filtered to simpleContentRoutes only",
    );
  }
  assert.deepEqual(offenders, []);
});

test("V12-G ContentRoutePage is production-clean and debug-free", () => {
  assert.doesNotMatch(contentRouteSource, /clickable-outcome-summary/, "debug clickable coverage card must not render");
  assert.doesNotMatch(contentRouteSource, /Clickable coverage/i, "debug clickable coverage text must not render");
  assert.doesNotMatch(contentRouteSource, /getClickableOutcomes/, "debug outcome helper must not be imported");
  assert.doesNotMatch(contentRouteSource, /\{\{\s*page\.group\s*\}\}/, "raw group names must not be shown");
  assert.doesNotMatch(contentRouteSource, /compatibility bridge/i, "legacy bridge wording must not be visible");
});

test("stable product default is legacy and Vue remains explicit preview only", () => {
  assert.match(appSource, /import\(["']\.\/vue\/main\.js["']\)/, "Vue root must be bootable from app.js");
  assert.match(appSource, /import\(["']\.\/legacyApp\.js["']\)/, "legacy runtime must remain available");
  assert.match(appSource, /params\.get\(["']engine["']\)/, "engine query must be read");
  assert.match(appSource, /requestedEngine\s*===\s*["']vue["']/, "Vue must require ?engine=vue");
  assert.match(appSource, /if\s*\(\s*useVueEngine\s*\)[\s\S]*import\(["']\.\/vue\/main\.js["']\)/, "Vue runtime must be explicit preview path");
  assert.match(appSource, /else\s*\{[\s\S]*import\(["']\.\/legacyApp\.js["']\)/, "legacy stable design must be the default boot path");
  assert.doesNotMatch(appSource, /else\s*\{[\s\S]*import\(["']\.\/vue\/main\.js["']\)/, "Vue must not be default boot path");
});

test("V12-G removes pilot route aliases from active product routing", () => {
  assert.doesNotMatch(activeRouteSource, /["']\/vue-job-referral["']/, "/vue-job-referral must not stay as an active product route");
  assert.doesNotMatch(routerSource, /path\s*:\s*["']\/vue-job-referral["']/, "/vue-job-referral must not be exposed as a user route");
});
