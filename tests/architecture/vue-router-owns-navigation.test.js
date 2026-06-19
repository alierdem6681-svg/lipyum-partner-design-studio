import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const routerSource = fs.readFileSync(path.join(root, "src/vue/router/index.js"), "utf8");
const shellSource = fs.readFileSync(path.join(root, "src/vue/layouts/AppShell.vue"), "utf8");

test("Vue Router owns default runtime navigation", () => {
  assert.match(routerSource, /createRouter\(/, "Vue Router must be created");
  assert.match(routerSource, /createWebHashHistory\(\)/, "hash history must own routing");
  assert.match(shellSource, /useRouter\(\)/, "AppShell must use Vue Router");
  assert.match(shellSource, /router\.push\(/, "navigation must go through router.push");
  assert.match(shellSource, /<RouterView\s*\/>/, "AppShell must render RouterView");
});
