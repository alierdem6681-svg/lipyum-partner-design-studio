import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const appJs = fs.readFileSync(path.join(process.cwd(), "src/app.js"), "utf8");

test("V12-G keeps legacy behind explicit rollback only", () => {
  assert.match(appJs, /const useLegacyEngine/, "app.js must keep the legacy rollback flag explicit");
  assert.match(appJs, /if\s*\(\s*useLegacyEngine\s*\)/, "legacy boot must be inside the rollback flag branch");
  assert.match(appJs, /else\s*\{\s*import\(["']\.\/vue\/main\.js["']\)/s, "Vue runtime must remain the default boot");
  assert.doesNotMatch(appJs, /const useVueEngine/, "Vue preview flag must not control production boot");
  assert.doesNotMatch(appJs, /else\s*\{\s*import\(["']\.\/legacyApp\.js["']\)/s, "legacy must not be the default boot");
  assert.doesNotMatch(appJs, /mountVueApp\(\);\s*import\(["']\.\/legacyApp\.js["']\)/s, "Vue and legacy roots must not mount together");
});
