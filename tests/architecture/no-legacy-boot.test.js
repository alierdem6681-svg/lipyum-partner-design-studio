import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const appJs = fs.readFileSync(path.join(process.cwd(), "src/app.js"), "utf8");

test("final boot mounts only the Vue runtime", () => {
  assert.doesNotMatch(appJs, /const useVueEngine|requestedEngine|params\.get\(["']engine["']\)/, "runtime query switches must not remain");
  assert.doesNotMatch(appJs, /legacyApp/, "legacy runtime must not be imported");
  assert.match(appJs, /mountVueApp\(\)/, "Vue runtime must be the default boot");
  assert.doesNotMatch(appJs, /mountVueApp\(\);\s*import\(["']\.\/legacyApp\.js["']\)/s, "Vue and legacy roots must not mount together");
});
