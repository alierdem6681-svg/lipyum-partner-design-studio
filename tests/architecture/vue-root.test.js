import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("V12-J boots Vue by default and keeps legacy only as explicit rollback", () => {
  const appJs = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
  const vueMain = fs.readFileSync(path.join(root, "src/vue/main.js"), "utf8");
  const appVue = fs.readFileSync(path.join(root, "src/vue/App.vue"), "utf8");

  assert.match(appJs, /params\.get\(["']engine["']\)/, "app.js must read the engine query parameter");
  assert.match(appJs, /requestedEngine\s*===\s*["']legacy["']/, "legacy runtime must require ?engine=legacy");
  assert.match(appJs, /if\s*\(\s*useLegacyEngine\s*\)\s*\{[\s\S]*import\(["']\.\/legacyApp\.js["']\)/, "legacy boot must be inside explicit rollback branch");
  assert.match(appJs, /else\s*\{[\s\S]*import\(["']\.\/vue\/main\.js["']\)/, "Vue boot must be the default branch");
  assert.doesNotMatch(appJs, /^import\s+["']\.\/legacyApp\.js["'];?/m, "legacy boot must not be an unconditional static import");
  assert.doesNotMatch(appJs, /catch\([\s\S]*import\(["']\.\/legacyApp\.js["']\)/, "Vue boot failure must not silently fall back to legacy");
  assert.match(appJs, /markRuntime\(["']vue["']\)/, "default Vue runtime marker must be written");
  assert.match(appJs, /markRuntime\(["']legacy["']\)/, "legacy rollback runtime marker must be written");
  assert.match(appJs, /renderBootError/, "Vue boot failures must render a visible error boundary");

  assert.match(vueMain, /createApp\(/, "Vue main must create a Vue app");
  assert.match(vueMain, /createPinia\(/, "Vue main must install Pinia");
  assert.match(vueMain, /\.use\(router\)/, "Vue main must install Vue Router");
  assert.match(appVue, /AppShell/, "Vue App must render the shared AppShell");
});
