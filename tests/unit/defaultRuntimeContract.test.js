import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const appSource = fs.readFileSync(path.join(process.cwd(), "src/app.js"), "utf8");

test("final Vue runtime is the only active boot path", () => {
  assert.match(appSource, /import\s+\{\s*mountVueApp\s*\}\s+from\s+["']\.\/vue\/main\.js["']/, "app.js must statically import Vue root");
  assert.match(appSource, /markRuntime\(["']vue["']\)/, "normal URLs must mark the Vue runtime");
  assert.match(appSource, /mountVueApp\(\)/, "normal URLs must mount Vue");
  assert.doesNotMatch(appSource, /legacyApp/, "legacy runtime must not be imported");
  assert.doesNotMatch(appSource, /requestedEngine|useVueEngine|useLegacyEngine/, "runtime query switches must not remain active");
});
