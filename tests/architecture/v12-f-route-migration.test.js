import test from "node:test";
import assert from "node:assert/strict";
import { activeRoutePaths } from "../../src/vue/data/activeRouteContent.js";
import { clickableOutcomes } from "../../src/vue/data/clickableOutcomes.js";
import { ROUTE_TO_SCREEN } from "../../src/utils/constants.js";

const blankBottomRoutes = new Set(["/jobs", "/my-jobs", "/calendar", "/wallet"]);
const retiredRoutes = new Set(["/packages", "/package-builder", "/package-checkout"]);

test("V12-G active route registry covers product routes", () => {
  const missing = Object.keys(ROUTE_TO_SCREEN).filter(
    (route) => route !== "/home" && route !== "/ui-kit" && !blankBottomRoutes.has(route) && !activeRoutePaths.includes(route),
  );
  assert.deepEqual(missing, []);
  for (const route of retiredRoutes) assert.ok(!activeRoutePaths.includes(route), `${route} must stay retired`);
});

test("V12-G clickable outcome registry covers every active content route", () => {
  const missing = activeRoutePaths.filter((route) => !clickableOutcomes[route]?.length);
  assert.deepEqual(missing, []);
});
