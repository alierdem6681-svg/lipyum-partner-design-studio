import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const vuePagesDir = path.join(root, "src/vue/pages");

function readVuePage(fileName) {
  return fs.readFileSync(path.join(vuePagesDir, fileName), "utf8");
}

function walkVueFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkVueFiles(fullPath);
    return entry.isFile() && entry.name.endsWith(".vue") ? [fullPath] : [];
  });
}

test("filter-like tab controls use AppFilterChips in Vue pages", () => {
  for (const filePath of walkVueFiles(vuePagesDir)) {
    const source = fs.readFileSync(filePath, "utf8");
    assert.doesNotMatch(source, /AppSegmentedControl/, `${path.relative(root, filePath)} must not use AppSegmentedControl`);
    assert.doesNotMatch(source, /<AppTabs\b/, `${path.relative(root, filePath)} must not use AppTabs for filter chips`);
  }

  for (const fileName of ["HomePage.vue", "NotificationsPage.vue", "ReviewsPage.vue", "ReferralPartnersPage.vue"]) {
    assert.match(readVuePage(fileName), /AppFilterChips/, `${fileName} must render filters through AppFilterChips`);
  }
});
