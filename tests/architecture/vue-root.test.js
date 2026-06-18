import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("V12 Vue root is available behind an explicit feature flag", () => {
  const appJs = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
  const vueMain = fs.readFileSync(path.join(root, "src/vue/main.js"), "utf8");
  const appVue = fs.readFileSync(path.join(root, "src/vue/App.vue"), "utf8");

  assert.match(appJs, /engine["']?\)\s*===\s*["']vue["']/, "app.js must require ?engine=vue before mounting Vue");
  assert.match(appJs, /import\(["']\.\/vue\/main\.js["']\)/, "app.js must lazy-load the Vue root");
  assert.doesNotMatch(appJs, /^import\s+["']\.\/legacyApp\.js["'];?/m, "legacy boot must not be an unconditional static import");

  assert.match(vueMain, /createApp\(/, "Vue main must create a Vue app");
  assert.match(vueMain, /createPinia\(/, "Vue main must install Pinia");
  assert.match(vueMain, /\.use\(router\)/, "Vue main must install Vue Router");
  assert.match(appVue, /AppShell/, "Vue App must render the shared AppShell");
});

