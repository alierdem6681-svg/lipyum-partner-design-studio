import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("V12-F Vue root stays behind the engine flag until final cutover", () => {
  const appJs = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
  const vueMain = fs.readFileSync(path.join(root, "src/vue/main.js"), "utf8");
  const appVue = fs.readFileSync(path.join(root, "src/vue/App.vue"), "utf8");

  assert.match(appJs, /params\.get\(["']engine["']\)\s*===\s*["']vue["']/, "Vue must require ?engine=vue until final gates pass");
  assert.match(appJs, /if\s*\(\s*useVueEngine\s*\)\s*\{\s*import\(["']\.\/vue\/main\.js["']\)/s, "app.js must lazy-load Vue only inside the Vue flag branch");
  assert.match(appJs, /else\s*\{\s*import\(["']\.\/legacyApp\.js["']\)/s, "legacy Golden runtime must remain the default fallback");
  assert.doesNotMatch(appJs, /^import\s+["']\.\/legacyApp\.js["'];?/m, "legacy boot must not be an unconditional static import");

  assert.match(vueMain, /createApp\(/, "Vue main must create a Vue app");
  assert.match(vueMain, /createPinia\(/, "Vue main must install Pinia");
  assert.match(vueMain, /\.use\(router\)/, "Vue main must install Vue Router");
  assert.match(appVue, /AppShell/, "Vue App must render the shared AppShell");
});
