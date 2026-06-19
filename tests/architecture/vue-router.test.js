import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const routerSource = fs.readFileSync(path.join(root, "src/vue/router/index.js"), "utf8");

const blankRoutes = [
  { route: "/jobs", component: "JobsPage" },
  { route: "/my-jobs", component: "MyJobsPage" },
  { route: "/calendar", component: "CalendarPage" },
  { route: "/wallet", component: "WalletPage" },
];

test("V12-G router uses hash history and no active LegacyContentBridge", () => {
  assert.match(routerSource, /createWebHashHistory\(\)/, "Vue Router must preserve hash-route URLs");
  assert.doesNotMatch(routerSource, /LegacyContentBridge/, "active routes must not use the compatibility bridge");

  for (const item of blankRoutes) {
    assert.match(routerSource, new RegExp(`path:\\s*["']${item.route}["']`), `${item.route} must be registered`);
    assert.match(routerSource, new RegExp(`component:\\s*${item.component}`), `${item.route} must use ${item.component}`);
    const componentPath = path.join(root, `src/vue/pages/${item.component}.vue`);
    assert.ok(fs.existsSync(componentPath), `${item.component}.vue must exist`);
  }

  assert.ok(fs.existsSync(path.join(root, "src/vue/pages/ContentRoutePage.vue")), "ContentRoutePage.vue must exist");
  assert.ok(!fs.existsSync(path.join(root, "src/vue/pages/LegacyContentBridge.vue")), "LegacyContentBridge.vue must be removed");

  for (const route of ["/packages", "/package-builder", "/package-checkout"]) {
    assert.match(routerSource, new RegExp(`path:\\s*["']${route}["'],\\s*redirect:\\s*["']/subscription["']`));
  }
});
