import assert from "node:assert/strict";
import { BOTTOM_TABS, RETIRED_ROUTE_REDIRECTS, ROUTE_TO_SCREEN } from "../src/utils/constants.js";
import { getRouteMeta } from "../src/utils/routeMeta.js";

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
  "/support/customer-service",
  "/satisfaction",
  "/messages",
  "/referral",
  "/referral/tasks",
  "/referral/partners",
  "/referral-earnings",
  "/job-referral",
  "/partners",
  "/customers",
  "/reviews",
  "/leaderboard",
  "/subscription",
  "/bonus",
  "/customer-management",
  "/account-transactions",
  "/digital-service-form",
  "/create-offer",
  "/performance-score",
  "/performance-improve",
  "/invoices",
  "/income-expense",
  "/appointment-link",
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
  "/partner-card-preview",
];

for (const route of requiredRoutes) {
  assert.ok(ROUTE_TO_SCREEN[route], `${route} must map to a product screen`);
  const meta = getRouteMeta(route);
  assert.equal(meta.route, route, `${route} must produce route metadata`);
  assert.ok(["home", "section", "subpage"].includes(meta.headerVariant), `${route} must produce a header variant`);
  assert.ok(["home", "subpage"].includes(meta.ctaVariant), `${route} must produce a CTA variant`);
}

assert.deepEqual(Object.keys(RETIRED_ROUTE_REDIRECTS), [
  "/packages",
  "/package-builder",
  "/package-checkout",
  "/partner/packages",
]);
assert.deepEqual(BOTTOM_TABS.map((item) => item.label), ["Ana Sayfa", "İşler", "İş Al", "Randevu", "Cüzdan"]);
assert.equal(getRouteMeta("/unknown").route, "/home", "Unknown routes must fall back to /home metadata");
assert.equal(ROUTE_TO_SCREEN["/vue-job-referral"], undefined, "/vue-job-referral must not be an active product route");

console.log(`Route smoke passed: ${requiredRoutes.length} routes`);
