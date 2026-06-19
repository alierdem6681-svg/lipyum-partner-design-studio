import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const appSource = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
const vueMainSource = fs.readFileSync(path.join(root, "src/vue/main.js"), "utf8");

test("default runtime branch mounts Vue", () => {
  assert.match(appSource, /else\s*\{[\s\S]*markRuntime\(["']vue["']\)[\s\S]*import\(["']\.\/vue\/main\.js["']\)/, "normal URL must mark and boot Vue");
  assert.match(vueMainSource, /createApp\(App\)/, "Vue root must create App");
  assert.match(vueMainSource, /\.use\(createPinia\(\)\)/, "Vue root must install Pinia");
  assert.match(vueMainSource, /\.use\(router\)/, "Vue root must install router");
});
