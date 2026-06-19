import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const appSource = fs.readFileSync(path.join(process.cwd(), "src/app.js"), "utf8");

test("runtime rollback is provided by git refs, not query switches", () => {
  assert.match(appSource, /mountVueApp\(\)/, "Vue runtime must be active");
  assert.doesNotMatch(appSource, /requestedEngine\s*===\s*["']legacy["']/, "?engine=legacy must not exist");
  assert.doesNotMatch(appSource, /requestedEngine\s*===\s*["']vue["']/, "?engine=vue must not be required");
  assert.doesNotMatch(appSource, /legacyApp/, "legacy runtime must be absent from active boot");
});
