import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const files = [
  ["src/app.js", readFileSync("src/app.js", "utf8")],
  ["src/vue/main.js", readFileSync("src/vue/main.js", "utf8")],
  ["src/vue/App.vue", readFileSync("src/vue/App.vue", "utf8")],
];

for (const [name, source] of files) {
  assert.doesNotMatch(source, /legacyApp\.js/, `${name} must not import legacyApp.js`);
  assert.doesNotMatch(source, /mountAppShell/, `${name} must not call the legacy app shell`);
  assert.doesNotMatch(source, /createNavigationController/, `${name} must not boot legacy navigation`);
}
