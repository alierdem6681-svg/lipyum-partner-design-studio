import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const root = process.cwd();
const manifestPath = path.join(root, "tests/golden-master/v11-stable/GOLDEN_MASTER_MANIFEST.json");
const reportPath = path.join(root, "tests/golden-master/v12-feature-preview/V12_CORE_PIXEL_DIFF_REPORT.json");
const markdownPath = path.join(root, "V12_C_CORE_VISUAL_REVIEW.md");
const outputDir = path.join(root, "tests/golden-master/v12-feature-preview/core-diff/393x852");
const featureBaseUrl = process.env.V12_FEATURE_URL || "http://127.0.0.1:56389/?engine=vue";
const routes = (process.env.V12_CORE_ROUTES || "/home").split(",").filter(Boolean);
const viewport = { width: 393, height: 852, name: "393x852" };
const strict = process.argv.includes("--strict");
const maxDiffPixelRatio = Number(process.env.V12_CORE_MAX_DIFF_RATIO || "0.015");

function routeSlug(route) {
  return route.replace(/^\//, "").replace(/\//g, "__") || "home";
}

function blank(width, height) {
  const image = new PNG({ width, height });
  image.data.fill(255);
  for (let index = 3; index < image.data.length; index += 4) image.data[index] = 255;
  return image;
}

function normalizeSize(image, width, height) {
  if (image.width === width && image.height === height) return image;
  const target = blank(width, height);
  PNG.bitblt(image, target, 0, 0, image.width, image.height, 0, 0);
  return target;
}

async function readPng(filePath) {
  return PNG.sync.read(await fs.readFile(filePath));
}

await fs.mkdir(outputDir, { recursive: true });

const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const goldenByRoute = new Map(
  manifest.records
    .filter((record) => record.target === "vercel" && record.viewport === viewport.name)
    .map((record) => [record.route, record]),
);

const browser = await chromium.launch({ headless: true });
const results = [];

for (const route of routes) {
  const golden = goldenByRoute.get(route);
  if (!golden) {
    results.push({ route, status: "FAIL", severity: "P0", error: "Missing Golden Master screenshot" });
    continue;
  }

  const page = await browser.newPage({ viewport, deviceScaleFactor: 2, isMobile: false, hasTouch: false });
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(`${featureBaseUrl}#${route}`, { waitUntil: "networkidle", timeout: 45_000 });
  await page.evaluate(() => document.fonts?.ready || Promise.resolve());
  await page.addStyleTag({
    content: [
      "*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important;caret-color:transparent!important;}",
      ".v-bottom__cta--home{animation:none!important;}",
      "[data-region-activity-message],.region-activity-message{animation:none!important;transform:none!important;}",
    ].join("\n"),
  });
  await page.waitForTimeout(300);

  const featureBuffer = await page.screenshot({ fullPage: true });
  const featurePath = path.join(outputDir, `${routeSlug(route)}.png`);
  await fs.writeFile(featurePath, featureBuffer);
  await page.close();

  const goldenPng = await readPng(path.join(root, golden.screenshotPath));
  const featurePngRaw = PNG.sync.read(featureBuffer);
  const width = Math.max(goldenPng.width, featurePngRaw.width);
  const height = Math.max(goldenPng.height, featurePngRaw.height);
  const normalizedGolden = normalizeSize(goldenPng, width, height);
  const normalizedFeature = normalizeSize(featurePngRaw, width, height);
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(
    normalizedGolden.data,
    normalizedFeature.data,
    diff.data,
    width,
    height,
    { threshold: 0.12, includeAA: false },
  );
  const totalPixels = width * height;
  const diffRatio = diffPixels / totalPixels;
  const diffPath = path.join(outputDir, `${routeSlug(route)}.diff.png`);
  await fs.writeFile(diffPath, PNG.sync.write(diff));
  const status = diffRatio <= maxDiffPixelRatio && !consoleErrors.length && !pageErrors.length ? "PASS" : "FAIL";
  const severity = diffRatio > 0.08 || consoleErrors.length || pageErrors.length ? "P0" : status === "FAIL" ? "P1" : "OK";

  results.push({
    route,
    status,
    severity,
    goldenScreenshot: golden.screenshotPath,
    featureScreenshot: path.relative(root, featurePath),
    diffScreenshot: path.relative(root, diffPath),
    width,
    height,
    diffPixels,
    totalPixels,
    diffRatio: Number(diffRatio.toFixed(6)),
    maxDiffPixelRatio,
    consoleErrors,
    pageErrors,
  });
}

await browser.close();
await fs.writeFile(reportPath, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  featureBaseUrl,
  viewport: viewport.name,
  maxDiffPixelRatio,
  results,
}, null, 2)}\n`);

const lines = [
  "# V12-C Core Visual Review",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Feature URL: \`${featureBaseUrl}\``,
  `Viewport: \`${viewport.name}\``,
  `Max diff ratio: \`${maxDiffPixelRatio}\``,
  "",
  "| Route | Status | Severity | Diff ratio | Diff pixels | Golden | Feature | Diff |",
  "|---|---|---|---:|---:|---|---|---|",
];

for (const result of results) {
  lines.push(`| ${result.route} | ${result.status} | ${result.severity} | ${result.diffRatio ?? "-"} | ${result.diffPixels ?? "-"} | ${result.goldenScreenshot || "-"} | ${result.featureScreenshot || "-"} | ${result.diffScreenshot || "-"} |`);
}

lines.push("");
lines.push("## Review Notes");
lines.push("");
for (const result of results) {
  if (result.status === "PASS") {
    lines.push(`- ${result.route}: P0/P1 visual issue yok.`);
  } else {
    lines.push(`- ${result.route}: ${result.severity} visual fark var; Golden parity tamamlanmadan V12-C tamamlanamaz.`);
  }
}

await fs.writeFile(markdownPath, `${lines.join("\n")}\n`);
console.log(`Wrote ${markdownPath}`);
console.log(`Wrote ${reportPath}`);

if (strict && results.some((result) => result.status !== "PASS")) {
  console.error("[v12-core-visual] strict visual parity failed.");
  process.exit(1);
}
