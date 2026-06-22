import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const appSource = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
const vueMainSource = fs.readFileSync(path.join(root, "src/vue/main.js"), "utf8");

test("normal URLs mount Vue directly", () => {
  assert.match(appSource, /import\(["']\.\/vue\/main\.js["']\)/, "app.js must import Vue root before mounting");
  assert.match(appSource, /markRuntime\(["']vue["']\)/, "normal URL must mark Vue");
  assert.match(appSource, /mountVueApp\(\)/, "normal URL must mount Vue");
  assert.doesNotMatch(appSource, /legacyApp/, "legacy runtime must not be imported");
  assert.match(vueMainSource, /createApp\(App\)/, "Vue root must create App");
  assert.match(vueMainSource, /\.use\(createPinia\(\)\)/, "Vue root must install Pinia");
  assert.match(vueMainSource, /\.use\(router\)/, "Vue root must install router");
});
