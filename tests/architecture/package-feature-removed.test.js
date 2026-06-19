import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const blockedPatterns = [
  /PackagesPage/,
  /PackageBuilderPage/,
  /PackageCheckoutPage/,
  /growthPackages/,
  /growthPackageBuilder/,
  /growthPackageCheckout/,
  /packageTab/,
  /growthPackageStep/,
  /currentPackage/,
  /checkoutPackage/,
  /paidPackage/,
  /Paketler/,
  /Büyüme Paketleri/,
  /Paket Seçimi/,
  /Ödeme Özetine Geç/,
  /Hemen Kazanmaya Başla/,
];

const allowedFiles = new Set([
  "src/utils/constants.js",
  "src/utils/deepLinks.js",
  "src/vue/router/index.js",
  "tests/architecture/package-feature-removed.test.js",
  "tests/e2e/retired-package-routes.spec.js",
  "tests/e2e/subscription-retained.spec.js",
  "tests/e2e/v12-e-product-scope.spec.js",
  "tests/product-scope/v12-e/PRODUCT_SCOPE_CONTRACT.json",
]);

function collectFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (["node_modules", ".git", "dist", "golden-master"].includes(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectFiles(absolute));
    if (entry.isFile() && /\.(js|vue|json)$/.test(entry.name)) files.push(absolute);
  }
  return files;
}

test("package product is removed from active source except retired redirects", () => {
  const files = [
    ...collectFiles(path.join(root, "src")),
    ...collectFiles(path.join(root, "tests")),
  ];
  const offenders = [];

  for (const file of files) {
    const relative = path.relative(root, file).replaceAll(path.sep, "/");
    if (allowedFiles.has(relative)) continue;
    const source = fs.readFileSync(file, "utf8");
    for (const pattern of blockedPatterns) {
      if (pattern.test(source)) offenders.push(`${relative}: ${pattern}`);
    }
  }

  assert.deepEqual(offenders, []);
});

test("retired package routes only live in explicit redirect maps", () => {
  const constants = fs.readFileSync(path.join(root, "src/utils/constants.js"), "utf8");
  const vueRouter = fs.readFileSync(path.join(root, "src/vue/router/index.js"), "utf8");

  for (const route of ["/packages", "/package-builder", "/package-checkout"]) {
    assert.match(constants, new RegExp(`["']${route}["']:\\s*["']/subscription["']`));
    assert.match(vueRouter, new RegExp(`path:\\s*["']${route}["'],\\s*redirect:\\s*["']/subscription["']`));
  }
});
