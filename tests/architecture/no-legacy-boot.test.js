import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const appJs = fs.readFileSync(path.join(process.cwd(), "src/app.js"), "utf8");

test("V12 pre-cutover keeps legacy boot guarded and prevents accidental production Vue activation", () => {
  assert.match(appJs, /const useVueEngine/, "app.js must make the boot decision explicit");
  assert.match(appJs, /if\s*\(\s*useVueEngine\s*\)/, "Vue boot must be inside the feature flag branch");
  assert.match(appJs, /else\s*\{\s*import\(["']\.\/legacyApp\.js["']\)/s, "legacy boot must be the non-feature fallback until parity passes");
  assert.doesNotMatch(appJs, /mountVueApp\(\);\s*import\(["']\.\/legacyApp\.js["']\)/s, "Vue and legacy roots must not mount together");
});

