import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const routerSource = fs.readFileSync(path.join(root, "src/vue/router/index.js"), "utf8");

test("active Vue routes do not use LegacyContentBridge", () => {
  assert.doesNotMatch(routerSource, /LegacyContentBridge/, "router must not reference LegacyContentBridge");
  assert.ok(!fs.existsSync(path.join(root, "src/vue/pages/LegacyContentBridge.vue")), "LegacyContentBridge page must not exist");
});
