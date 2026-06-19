import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("final product boots Vue by default with AppShell", () => {
  const appJs = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
  const vueMain = fs.readFileSync(path.join(root, "src/vue/main.js"), "utf8");
  const appVue = fs.readFileSync(path.join(root, "src/vue/App.vue"), "utf8");

  assert.doesNotMatch(appJs, /params\.get\(["']engine["']\)/, "app.js must not use runtime query switches");
  assert.doesNotMatch(appJs, /legacyApp/, "legacy runtime must not be part of active boot");
  assert.match(appJs, /import\s+\{\s*mountVueApp\s*\}\s+from\s+["']\.\/vue\/main\.js["']/, "app.js must import the Vue root");
  assert.match(appJs, /markRuntime\(["']vue["']\)/, "Vue runtime marker must be written");
  assert.match(appJs, /mountVueApp\(\)/, "Vue root must mount on normal URLs");
  assert.match(appJs, /renderVueBootError/, "Vue boot failures must render a visible error boundary");

  assert.match(vueMain, /createApp\(/, "Vue main must create a Vue app");
  assert.match(vueMain, /createPinia\(/, "Vue main must install Pinia");
  assert.match(vueMain, /\.use\(router\)/, "Vue main must install Vue Router");
  assert.match(appVue, /AppShell/, "Vue App must render the shared AppShell");
});
