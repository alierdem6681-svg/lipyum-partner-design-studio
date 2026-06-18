import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const routerSource = fs.readFileSync(path.join(root, "src/vue/router/index.js"), "utf8");

const coreRoutes = [
  { route: "/home", component: "HomePage" },
  { route: "/jobs", component: "JobsPage" },
  { route: "/my-jobs", component: "MyJobsPage" },
  { route: "/calendar", component: "CalendarPage" },
];

test("V12 router uses hash history and real Vue SFCs for core routes", () => {
  assert.match(routerSource, /createWebHashHistory\(\)/, "Vue Router must preserve hash-route URLs");
  assert.match(routerSource, /LegacyContentBridge/, "compatibility bridge should be explicit for non-core routes");

  for (const item of coreRoutes) {
    assert.match(routerSource, new RegExp(`path:\\s*["']${item.route}["']`), `${item.route} must be registered`);
    assert.match(routerSource, new RegExp(`component:\\s*${item.component}`), `${item.route} must use ${item.component}`);
    const componentPath = path.join(root, `src/vue/pages/${item.component}.vue`);
    assert.ok(fs.existsSync(componentPath), `${item.component}.vue must exist`);
  }

  const coreRoutesBlock = routerSource.slice(
    routerSource.indexOf("const coreRoutes"),
    routerSource.indexOf("const compatibilityRoutes"),
  );
  assert.doesNotMatch(coreRoutesBlock, /LegacyContentBridge/, "core routes must not use the compatibility bridge");
});

