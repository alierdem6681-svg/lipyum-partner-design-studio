import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const appJs = fs.readFileSync(path.join(process.cwd(), "src/app.js"), "utf8");

test("stable design boots legacy by default and Vue only when explicitly requested", () => {
  assert.match(appJs, /const useVueEngine/, "app.js must use an explicit Vue preview flag");
  assert.match(appJs, /requestedEngine\s*===\s*["']vue["']/, "Vue must only be selected by ?engine=vue");
  assert.match(appJs, /if\s*\(\s*useVueEngine\s*\)/, "Vue boot must be guarded by the preview flag");
  assert.match(appJs, /else\s*\{[\s\S]*import\(["']\.\/legacyApp\.js["']\)/, "default branch must mount the stable legacy design");
  assert.doesNotMatch(appJs, /else\s*\{[\s\S]*import\(["']\.\/vue\/main\.js["']\)/, "Vue must not be the default branch");
  assert.doesNotMatch(appJs, /mountVueApp\(\);\s*import\(["']\.\/legacyApp\.js["']\)/s, "Vue and legacy roots must not mount together");
});
