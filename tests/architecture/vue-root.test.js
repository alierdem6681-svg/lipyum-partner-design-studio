import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("stable product boots legacy by default and keeps Vue as explicit preview", () => {
  const appJs = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
  const vueMain = fs.readFileSync(path.join(root, "src/vue/main.js"), "utf8");
  const appVue = fs.readFileSync(path.join(root, "src/vue/App.vue"), "utf8");

  assert.match(appJs, /params\.get\(["']engine["']\)/, "app.js must read the engine query parameter");
  assert.match(appJs, /requestedEngine\s*===\s*["']vue["']/, "Vue runtime must require ?engine=vue");
  assert.match(appJs, /if\s*\(\s*useVueEngine\s*\)\s*\{[\s\S]*import\(["']\.\/vue\/main\.js["']\)/, "Vue boot must stay inside explicit preview branch");
  assert.match(appJs, /else\s*\{[\s\S]*import\(["']\.\/legacyApp\.js["']\)/, "legacy stable UI must be the default branch");
  assert.doesNotMatch(appJs, /^import\s+["']\.\/legacyApp\.js["'];?/m, "legacy boot must not be an unconditional static import");
  assert.doesNotMatch(appJs, /\.catch\([^)]*legacyApp[^)]*\)/, "Vue boot failure must not silently fall back to legacy");
  assert.match(appJs, /markRuntime\(["']vue["']\)/, "explicit Vue preview runtime marker must be written");
  assert.match(appJs, /markRuntime\(["']legacy["']\)/, "default legacy runtime marker must be written");
  assert.match(appJs, /renderVueBootError/, "Vue boot failures must render a visible error boundary");

  assert.match(vueMain, /createApp\(/, "Vue main must create a Vue app");
  assert.match(vueMain, /createPinia\(/, "Vue main must install Pinia");
  assert.match(vueMain, /\.use\(router\)/, "Vue main must install Vue Router");
  assert.match(appVue, /AppShell/, "Vue App must render the shared AppShell");
});
