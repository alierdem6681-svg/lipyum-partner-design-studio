import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const appJs = fs.readFileSync(path.join(process.cwd(), "src/app.js"), "utf8");

test("V12-H keeps incomplete Vue migration behind explicit preview only", () => {
  assert.match(appJs, /const useVueEngine/, "app.js must keep the Vue preview flag explicit");
  assert.match(appJs, /if\s*\(\s*useVueEngine\s*\)/, "Vue boot must be inside the preview flag branch");
  assert.match(appJs, /else\s*\{\s*import\(["']\.\/legacyApp\.js["']\)/s, "stable legacy runtime must remain the default boot");
  assert.doesNotMatch(appJs, /const useLegacyEngine/, "legacy must not require a rollback flag while Vue visual parity is blocked");
  assert.doesNotMatch(appJs, /mountVueApp\(\);\s*import\(["']\.\/legacyApp\.js["']\)/s, "Vue and legacy roots must not mount together");
});
