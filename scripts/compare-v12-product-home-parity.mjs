import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const root = process.cwd();
const baselinePath = path.join(root, "tests/golden-master/v12-product-final/home.png");
const reportDir = process.env.V12_PRODUCT_REPORT_DIR || path.join(root, "artifacts/v12-i/product-home-parity");
const strict = process.argv.includes("--strict");
const maxDiffPixelRatio = Number(process.env.V12_PRODUCT_MAX_DIFF_RATIO || "0.015");
const baseUrl = process.env.V12_FEATURE_URL || "http://127.0.0.1:5173";
const viewport = { width: 393, height: 852 };

function vueHomeUrl(base) {
  const url = new URL(base);
  url.searchParams.set("engine", "vue");
  url.hash = "/home";
  return url.toString();
}

function normalizeSize(image, width, height) {
  if (image.width === width && image.height === height) return image;
  const target = new PNG({ width, height });
  target.data.fill(255);
  for (let index = 3; index < target.data.length; index += 4) target.data[index] = 255;
  PNG.bitblt(image, target, 0, 0, image.width, image.height, 0, 0);
  return target;
}

await fs.mkdir(reportDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: "tr-TR",
  timezoneId: "Europe/Istanbul",
  colorScheme: "light",
  reducedMotion: "reduce",
});
const consoleErrors = [];
const pageErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => pageErrors.push(error.message));
const featureUrl = vueHomeUrl(baseUrl);
await page.goto(featureUrl, { waitUntil: "networkidle", timeout: 60_000 });
await page.evaluate(() => document.fonts?.ready || Promise.resolve());
await page.addStyleTag({
  content: [
    "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important;}",
    ".v-bottom__cta--home,.cta-fab{animation:none!important;}",
    "[data-region-activity-message],.region-activity-message{animation:none!important;transform:none!important;}",
    ".nav-alert-track{animation:none!important;transform:translate3d(0,0,0)!important;}",
  ].join("\n"),
});
await page.waitForTimeout(300);
const featureBuffer = await page.screenshot({ fullPage: true });
await page.close();
await browser.close();

const baselineBuffer = await fs.readFile(baselinePath);
const baseline = PNG.sync.read(baselineBuffer);
const feature = PNG.sync.read(featureBuffer);
const width = Math.max(baseline.width, feature.width);
const height = Math.max(baseline.height, feature.height);
const normalizedBaseline = normalizeSize(baseline, width, height);
const normalizedFeature = normalizeSize(feature, width, height);
const diff = new PNG({ width, height });
const diffPixels = pixelmatch(
  normalizedBaseline.data,
  normalizedFeature.data,
  diff.data,
  width,
  height,
  { threshold: 0.12, includeAA: false },
);
const diffRatio = Number((diffPixels / (width * height)).toFixed(6));
const featurePath = path.join(reportDir, "home-feature.png");
const diffPath = path.join(reportDir, "home.diff.png");
await fs.writeFile(featurePath, featureBuffer);
await fs.writeFile(diffPath, PNG.sync.write(diff));

const status = diffRatio <= maxDiffPixelRatio && !consoleErrors.length && !pageErrors.length ? "PASS" : "FAIL";
const report = {
  status,
  featureUrl,
  baselinePath: path.relative(root, baselinePath),
  featurePath: path.relative(root, featurePath),
  diffPath: path.relative(root, diffPath),
  viewport: "393x852",
  diffPixels,
  totalPixels: width * height,
  diffRatio,
  maxDiffPixelRatio,
  consoleErrors,
  pageErrors,
};

await fs.writeFile(path.join(reportDir, "V12_PRODUCT_HOME_PARITY_REPORT.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));

if (strict && status !== "PASS") {
  console.error("[v12-product-home-parity] strict parity failed");
  process.exit(1);
}
