import assert from "node:assert/strict";
import {
  getCtaVariant,
  getScreenForRoute,
  normalizeRoute,
  pageRoutes,
} from "../src/router.js";

const requiredRoutes = [
  "/home",
  "/profile",
  "/notifications",
  "/support",
  "/referral",
  "/job-referral",
  "/reviews",
  "/wallet",
  "/leaderboard",
  "/packages",
  "/subscription",
];

for (const route of requiredRoutes) {
  assert.equal(normalizeRoute(route), route, `${route} normalize edilmeli`);
  assert.ok(getScreenForRoute(route), `${route} screen'e bağlanmalı`);
  assert.ok(pageRoutes[route], `${route} pageRoutes içinde olmalı`);
  assert.ok(["home", "subpage", "disabled", "hidden"].includes(getCtaVariant(route)), `${route} CTA variant üretmeli`);
}

assert.equal(normalizeRoute("/unknown"), "/home", "Bilinmeyen route /home'a düşmeli");
console.log(`Route smoke passed: ${requiredRoutes.length} route`);
