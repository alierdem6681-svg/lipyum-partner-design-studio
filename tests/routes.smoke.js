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
  "/messages",
  "/referral",
  "/job-referral",
  "/partners",
  "/customers",
  "/reviews",
  "/leaderboard",
  "/packages",
  "/subscription",
  "/package-builder",
  "/package-checkout",
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
  "/vue-job-referral",
];

for (const route of requiredRoutes) {
  assert.equal(normalizeRoute(route), route, `${route} normalize edilmeli`);
  assert.ok(getScreenForRoute(route), `${route} screen'e bağlanmalı`);
  assert.ok(pageRoutes[route], `${route} pageRoutes içinde olmalı`);
  assert.ok(["home", "subpage", "disabled", "hidden"].includes(getCtaVariant(route)), `${route} CTA variant üretmeli`);
}

assert.equal(normalizeRoute("/unknown"), "/home", "Bilinmeyen route /home'a düşmeli");
console.log(`Route smoke passed: ${requiredRoutes.length} route`);
