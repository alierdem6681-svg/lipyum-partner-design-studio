import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ROUTE_TO_SCREEN } from "../../src/utils/constants.js";

const routerSource = readFileSync("src/vue/router/index.js", "utf8");
const routePaths = Object.keys(ROUTE_TO_SCREEN);

for (const route of ["/home", "/jobs", "/my-jobs", "/calendar"]) {
  assert.match(routerSource, new RegExp(`["']${route}["']\\s*:\\s*\\w+Page`), `${route} must be declared as a core Vue route`);
  assert.ok(routePaths.includes(route), `${route} must be owned by Vue Router`);
}

for (const route of ["/wallet", "/profile", "/notifications", "/support", "/referral", "/packages"]) {
  assert.ok(routePaths.includes(route), `${route} must still resolve through the Vue Router bridge`);
}

assert.match(routerSource, /createWebHashHistory\(\)/, "Vue Router must preserve hash URLs");
assert.match(routerSource, /LegacyContentBridge/, "Non-core routes must use the temporary compatibility bridge");
