import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const appSource = fs.readFileSync(path.join(process.cwd(), "src/app.js"), "utf8");

test("legacy runtime is not the default boot path", () => {
  assert.doesNotMatch(appSource, /^import\s+["']\.\/legacyApp\.js["'];?/m, "legacy must not be statically imported");
  assert.doesNotMatch(appSource, /else\s*\{[\s\S]*import\(["']\.\/legacyApp\.js["']\)/, "default else branch must not import legacy");
  assert.doesNotMatch(appSource, /catch\([\s\S]*legacyApp/, "Vue boot error must not fall back to legacy");
});
