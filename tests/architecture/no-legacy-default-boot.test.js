import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const appSource = fs.readFileSync(path.join(process.cwd(), "src/app.js"), "utf8");

test("legacy runtime is not a default or fallback boot path", () => {
  assert.doesNotMatch(appSource, /^import\s+["']\.\/legacyApp\.js["'];?/m, "legacy must not be statically imported");
  assert.doesNotMatch(appSource, /import\(["']\.\/legacyApp\.js["']\)/, "legacy must not be dynamically imported");
  assert.doesNotMatch(appSource, /\.catch\([^)]*legacyApp[^)]*\)/, "Vue boot error must not fall back to legacy");
  assert.doesNotMatch(appSource, /markRuntime\(["']legacy["']\)/, "legacy runtime marker must not remain");
});
