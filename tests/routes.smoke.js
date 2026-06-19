import assert from "node:assert/strict";
import {
  getCtaVariant,
  getScreenForRoute,
  normalizeRoute,
  pageRoutes,
} from "../src/router.js";

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
  "/job-referral",
  "/partners",
  "/customers",
  "/reviews",
  "/leaderboard",
  "/subscription",
  "/bonus",
  "/performance-score",
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
  "/ui-kit",
  "/partner-card-preview",
];

for (const route of requiredRoutes) {
  assert.equal(normalizeRoute(route), route, `${route} normalize edilmeli`);
  assert.ok(getScreenForRoute(route), `${route} screen'e bağlanmalı`);
  assert.ok(pageRoutes[route], `${route} pageRoutes içinde olmalı`);
  assert.ok(["home", "subpage", "disabled", "hidden"].includes(getCtaVariant(route)), `${route} CTA variant üretmeli`);
}

assert.equal(normalizeRoute("/unknown"), "/home", "Bilinmeyen route /home'a düşmeli");
assert.equal(normalizeRoute("/vue-job-referral"), "/home", "/vue-job-referral aktif urun rotasi olmamali");
assert.ok(pageRoutes["/vue-job-referral"], "/vue-job-referral legacy smoke pageRoutes icinde korunmali");
console.log(`Route smoke passed: ${requiredRoutes.length} route`);
