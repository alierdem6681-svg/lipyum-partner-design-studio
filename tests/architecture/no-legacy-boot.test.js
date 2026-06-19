import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const appJs = fs.readFileSync(path.join(process.cwd(), "src/app.js"), "utf8");

test("V12-J does not boot legacy unless rollback is explicitly requested", () => {
  assert.match(appJs, /const useLegacyEngine/, "app.js must use an explicit legacy rollback flag");
  assert.match(appJs, /requestedEngine\s*===\s*["']legacy["']/, "legacy must only be selected by ?engine=legacy");
  assert.match(appJs, /if\s*\(\s*useLegacyEngine\s*\)/, "legacy boot must be guarded by the rollback flag");
  assert.match(appJs, /else\s*\{[\s\S]*import\(["']\.\/vue\/main\.js["']\)/, "default branch must mount Vue");
  assert.doesNotMatch(appJs, /else\s*\{[\s\S]*import\(["']\.\/legacyApp\.js["']\)/, "legacy must not be the default branch");
  assert.doesNotMatch(appJs, /mountVueApp\(\);\s*import\(["']\.\/legacyApp\.js["']\)/s, "Vue and legacy roots must not mount together");
});
