import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const appSource = fs.readFileSync(path.join(process.cwd(), "src/app.js"), "utf8");

test("stable product design remains the default runtime", () => {
  assert.match(appSource, /const useVueEngine\s*=\s*requestedEngine\s*===\s*["']vue["']/, "Vue must require ?engine=vue");
  assert.match(
    appSource,
    /if\s*\(\s*useVueEngine\s*\)\s*\{[\s\S]*markRuntime\(["']vue["']\)[\s\S]*import\(["']\.\/vue\/main\.js["']\)/,
    "?engine=vue must be the only Vue boot path",
  );
  assert.match(
    appSource,
    /else\s*\{[\s\S]*markRuntime\(["']legacy["']\)[\s\S]*import\(["']\.\/legacyApp\.js["']\)/,
    "normal URLs must boot the stable legacy design",
  );
  assert.doesNotMatch(appSource, /requestedEngine\s*===\s*["']legacy["']/, "?engine=legacy must not be the runtime switch");
  assert.doesNotMatch(appSource, /const useLegacyEngine/, "legacy must not be behind a rollback-only flag");
});
