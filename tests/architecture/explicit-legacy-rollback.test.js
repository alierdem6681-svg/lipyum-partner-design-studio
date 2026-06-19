import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const appSource = fs.readFileSync(path.join(process.cwd(), "src/app.js"), "utf8");

test("legacy stable design is the default and Vue preview is explicit", () => {
  assert.match(appSource, /const useVueEngine\s*=\s*requestedEngine\s*===\s*["']vue["']/, "Vue preview must be selected only with ?engine=vue");
  assert.match(appSource, /if\s*\(\s*useVueEngine\s*\)\s*\{[\s\S]*markRuntime\(["']vue["']\)[\s\S]*import\(["']\.\/vue\/main\.js["']\)/, "Vue import must be guarded and marked");
  assert.match(appSource, /else\s*\{[\s\S]*markRuntime\(["']legacy["']\)[\s\S]*import\(["']\.\/legacyApp\.js["']\)/, "legacy stable design must be the default marked runtime");
});
