import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const appSource = fs.readFileSync(path.join(process.cwd(), "src/app.js"), "utf8");

test("legacy rollback is explicit and marked", () => {
  assert.match(appSource, /const useLegacyEngine\s*=\s*requestedEngine\s*===\s*["']legacy["']/, "legacy rollback must be selected only with ?engine=legacy");
  assert.match(appSource, /if\s*\(\s*useLegacyEngine\s*\)\s*\{[\s\S]*markRuntime\(["']legacy["']\)[\s\S]*import\(["']\.\/legacyApp\.js["']\)/, "legacy import must be guarded and marked");
});
