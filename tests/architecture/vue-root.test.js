import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("V12-G Vue root is the default runtime with explicit legacy rollback", () => {
  const appJs = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
  const vueMain = fs.readFileSync(path.join(root, "src/vue/main.js"), "utf8");
  const appVue = fs.readFileSync(path.join(root, "src/vue/App.vue"), "utf8");

  assert.match(appJs, /params\.get\(["']engine["']\)\s*===\s*["']legacy["']/, "legacy rollback must require ?engine=legacy");
  assert.match(appJs, /if\s*\(\s*useLegacyEngine\s*\)\s*\{\s*import\(["']\.\/legacyApp\.js["']\)/s, "legacy boot must be inside the rollback flag branch");
  assert.match(appJs, /else\s*\{\s*import\(["']\.\/vue\/main\.js["']\)/s, "Vue runtime must be the default boot path");
  assert.doesNotMatch(appJs, /params\.get\(["']engine["']\)\s*===\s*["']vue["']/, "Vue must not require ?engine=vue after cutover");
  assert.doesNotMatch(appJs, /^import\s+["']\.\/legacyApp\.js["'];?/m, "legacy boot must not be an unconditional static import");

  assert.match(vueMain, /createApp\(/, "Vue main must create a Vue app");
  assert.match(vueMain, /createPinia\(/, "Vue main must install Pinia");
  assert.match(vueMain, /\.use\(router\)/, "Vue main must install Vue Router");
  assert.match(appVue, /AppShell/, "Vue App must render the shared AppShell");
});
