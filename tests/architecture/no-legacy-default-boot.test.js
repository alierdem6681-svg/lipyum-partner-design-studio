import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const appSource = fs.readFileSync(path.join(process.cwd(), "src/app.js"), "utf8");

test("Vue runtime is not the default boot path while stable design is protected", () => {
  assert.doesNotMatch(appSource, /^import\s+["']\.\/legacyApp\.js["'];?/m, "legacy must not be statically imported");
  assert.match(appSource, /else\s*\{[\s\S]*import\(["']\.\/legacyApp\.js["']\)/, "default else branch must import the stable legacy design");
  assert.doesNotMatch(appSource, /else\s*\{[\s\S]*import\(["']\.\/vue\/main\.js["']\)/, "default else branch must not import Vue");
  assert.doesNotMatch(appSource, /\.catch\([^)]*legacyApp[^)]*\)/, "Vue boot error must not fall back to legacy");
});
