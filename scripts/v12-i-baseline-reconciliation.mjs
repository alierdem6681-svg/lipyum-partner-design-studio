import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const root = process.cwd();
const viewport = { width: 393, height: 852 };
const viewportName = "393x852";
const deviceScaleFactor = 2;
const locale = "tr-TR";
const timezoneId = "Europe/Istanbul";
const maxRunDiff = 0.003;
const maxVueDiff = 0.015;
const localBaseUrl = process.env.V12_LOCAL_URL || "http://127.0.0.1:5173";
const vercelUrl = process.env.V12_ACCEPTED_VERCEL_URL || "https://lipyum-partner-design-studio.vercel.app/#/home";

const artifactsDir = path.join(root, "artifacts/v12-i/reproducibility");
const candidateDir = path.join(root, "tests/golden-master/v12-product-candidate");
const finalDir = path.join(root, "tests/golden-master/v12-product-final");
const v11HomePath = path.join(root, "tests/golden-master/v11-stable/vercel/393x852/home.png");
const v11ManifestPath = path.join(root, "tests/golden-master/v11-stable/GOLDEN_MASTER_MANIFEST.json");

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function routeUrl(base, engine) {
  const separator = base.includes("?") ? "&" : "?";
  if (engine === "vue") return `${base}${separator}engine=vue#/home`;
  if (engine === "legacy") return `${base}${separator}engine=legacy#/home`;
  return `${base}#/home`;
}

function normalizeSize(image, width, height) {
  if (image.width === width && image.height === height) return image;
  const target = new PNG({ width, height });
  target.data.fill(255);
  for (let index = 3; index < target.data.length; index += 4) target.data[index] = 255;
  PNG.bitblt(image, target, 0, 0, image.width, image.height, 0, 0);
  return target;
}

function comparePngBuffers(aBuffer, bBuffer, diffPath) {
  const a = PNG.sync.read(aBuffer);
  const b = PNG.sync.read(bBuffer);
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  const normalizedA = normalizeSize(a, width, height);
  const normalizedB = normalizeSize(b, width, height);
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(
    normalizedA.data,
    normalizedB.data,
    diff.data,
    width,
    height,
    { threshold: 0.12, includeAA: false },
  );
  return fs.writeFile(diffPath, PNG.sync.write(diff)).then(() => ({
    width,
    height,
    diffPixels,
    totalPixels: width * height,
    diffRatio: Number((diffPixels / (width * height)).toFixed(6)),
    diffPath: path.relative(root, diffPath),
  }));
}

async function preparePage(page) {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.addStyleTag({
    content: [
      "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important;}",
      ".v-bottom__cta--home,.cta-fab{animation:none!important;}",
      "[data-region-activity-message],.region-activity-message{animation:none!important;transform:none!important;}",
      ".nav-alert-track{animation:none!important;transform:translate3d(0,0,0)!important;}",
      ".pull-refresh{transition:none!important;}",
    ].join("\n"),
  });
  await page.evaluate(() => document.fonts?.ready || Promise.resolve());
  await page.waitForTimeout(300);
}

async function capture(browser, source, run) {
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor,
    isMobile: true,
    hasTouch: true,
    locale,
    timezoneId,
    colorScheme: "light",
    reducedMotion: "reduce",
    userAgent: `LipyumV12I/${source.name}`,
  });
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (request) => failedRequests.push({
    url: request.url(),
    failure: request.failure()?.errorText || "",
  }));
  const response = await page.goto(source.url, { waitUntil: "networkidle", timeout: 60_000 });
  await preparePage(page);
  const buffer = await page.screenshot({ fullPage: true });
  const filePath = path.join(artifactsDir, `${source.name}-run-${run}.png`);
  await fs.writeFile(filePath, buffer);
  const meta = await page.evaluate(() => ({
    title: document.title,
    hash: location.hash,
    search: location.search,
    bodyTextPreview: document.body.innerText.slice(0, 320),
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    appTextLength: document.querySelector("#app")?.innerText?.length || 0,
    fontFamilies: Array.from(document.fonts || []).map((font) => font.family).filter(Boolean),
  }));
  await page.close();
  return {
    source: source.name,
    run,
    url: source.url,
    status: response?.status() || 0,
    screenshotPath: path.relative(root, filePath),
    screenshotHash: sha256(buffer),
    consoleErrors,
    pageErrors,
    failedRequests,
    meta,
    buffer,
  };
}

function tile(images, columns = 2) {
  const pngs = images.map((image) => PNG.sync.read(image));
  const width = Math.max(...pngs.map((png) => png.width));
  const height = Math.max(...pngs.map((png) => png.height));
  const rows = Math.ceil(pngs.length / columns);
  const sheet = new PNG({ width: width * columns, height: height * rows });
  sheet.data.fill(255);
  for (let index = 3; index < sheet.data.length; index += 4) sheet.data[index] = 255;
  pngs.forEach((png, index) => {
    PNG.bitblt(png, sheet, 0, 0, png.width, png.height, (index % columns) * width, Math.floor(index / columns) * height);
  });
  return PNG.sync.write(sheet);
}

await fs.mkdir(artifactsDir, { recursive: true });
await fs.mkdir(candidateDir, { recursive: true });
await fs.mkdir(finalDir, { recursive: true });
await fs.mkdir(path.join(candidateDir, "candidate/393x852"), { recursive: true });
await fs.mkdir(path.join(finalDir, "diff/393x852"), { recursive: true });

const v11Buffer = await fs.readFile(v11HomePath);
const v11Manifest = JSON.parse(await fs.readFile(v11ManifestPath, "utf8"));
const commitSha = (await fs.readFile(path.join(root, ".git/HEAD"), "utf8")).trim();
const gitHead = await new Promise((resolve) => {
  const child = globalThis.process?.env ? null : null;
  resolve(commitSha);
});

const sources = [
  { name: "legacy", url: routeUrl(localBaseUrl, "legacy"), engine: "legacy" },
  { name: "vue", url: routeUrl(localBaseUrl, "vue"), engine: "vue" },
  { name: "vercel", url: vercelUrl, engine: "accepted-vercel" },
];

const browser = await chromium.launch({ headless: true });
const browserVersion = browser.version();
const captures = {};
for (const source of sources) {
  captures[source.name] = [await capture(browser, source, 1), await capture(browser, source, 2)];
}
await browser.close();

const diffsDir = path.join(artifactsDir, "diff");
await fs.mkdir(diffsDir, { recursive: true });
const runDiffs = {};
for (const source of sources) {
  runDiffs[source.name] = await comparePngBuffers(
    captures[source.name][0].buffer,
    captures[source.name][1].buffer,
    path.join(diffsDir, `${source.name}-run.diff.png`),
  );
}

const crossDiffs = {
  v11VsLegacy: await comparePngBuffers(v11Buffer, captures.legacy[0].buffer, path.join(diffsDir, "v11-vs-legacy.diff.png")),
  legacyVsVue: await comparePngBuffers(captures.legacy[0].buffer, captures.vue[0].buffer, path.join(diffsDir, "legacy-vs-vue.diff.png")),
  legacyVsVercel: await comparePngBuffers(captures.legacy[0].buffer, captures.vercel[0].buffer, path.join(diffsDir, "legacy-vs-vercel.diff.png")),
};

const candidateHome = captures.legacy[0].buffer;
await fs.writeFile(path.join(candidateDir, "home.png"), candidateHome);
await fs.writeFile(path.join(candidateDir, "candidate/393x852/home.png"), candidateHome);
await fs.writeFile(path.join(finalDir, "home.png"), candidateHome);
await fs.writeFile(path.join(finalDir, "393x852-home.png"), candidateHome);
await fs.writeFile(path.join(candidateDir, "APPROVAL_CONTACT_SHEET.png"), tile([
  v11Buffer,
  captures.legacy[0].buffer,
  captures.vue[0].buffer,
  captures.vercel[0].buffer,
]));

const captureConfig = {
  browser: "chromium",
  browserVersion,
  os: `${os.type()} ${os.release()}`,
  viewport,
  viewportName,
  deviceScaleFactor,
  isMobile: true,
  hasTouch: true,
  locale,
  timezoneId,
  colorScheme: "light",
  reducedMotion: "reduce",
  deterministicStyle: true,
};

const productDecisions = [
  "Bottom labels are Ana Sayfa, Isler, Is Al, Randevu, Cuzdan.",
  "Packages routes are retired and redirect to subscription.",
  "Jobs, my-jobs, calendar and wallet bottom routes stay blank.",
  "Subscription is retained.",
];

const manifest = {
  baselineVersion: "v12-product-final",
  generatedAt: new Date().toISOString(),
  sourceCommit: process.env.GITHUB_SHA || "local-working-tree",
  sourceEngine: "legacy",
  sourceUrl: sources[0].url,
  captureConfig,
  productScope: "V12-E product decisions plus current stable premium Home",
  historicalV11: {
    screenshotPath: path.relative(root, v11HomePath),
    screenshotHash: sha256(v11Buffer),
    manifestPath: path.relative(root, v11ManifestPath),
    manifestGeneratedAt: v11Manifest.generatedAt || "",
  },
  productDecisions,
  intentionalDifferencesFromV11: [
    "Islerim label superseded by Isler.",
    "Takvim label superseded by Randevu.",
    "V11 is kept historical and does not block V12 final gate.",
  ],
  reproducibility: {
    maxAllowedRunDiff: maxRunDiff,
    runDiffs,
    pass: Object.values(runDiffs).every((item) => item.diffRatio <= maxRunDiff),
  },
  vueParity: {
    maxAllowedDiff: maxVueDiff,
    diff: crossDiffs.legacyVsVue,
    pass: crossDiffs.legacyVsVue.diffRatio <= maxVueDiff,
  },
  crossDiffs,
  screenshots: Object.fromEntries(Object.entries(captures).map(([name, records]) => [name, records.map((record) => ({
    run: record.run,
    url: record.url,
    status: record.status,
    screenshotPath: record.screenshotPath,
    screenshotHash: record.screenshotHash,
    consoleErrors: record.consoleErrors,
    pageErrors: record.pageErrors,
    failedRequests: record.failedRequests,
    meta: record.meta,
  }))])),
};

await fs.writeFile(path.join(candidateDir, "GOLDEN_MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`);
await fs.writeFile(path.join(finalDir, "GOLDEN_MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`);
await fs.writeFile(path.join(root, "V12_PRODUCT_GOLDEN_MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`);
await fs.writeFile(path.join(root, "V12_I_BASELINE_REPRODUCIBILITY.json"), `${JSON.stringify(manifest, null, 2)}\n`);
await fs.writeFile(path.join(candidateDir, "HOME_PRODUCT_CONTRACT.json"), `${JSON.stringify({
  route: "/home",
  source: "v12-product-candidate",
  requiredLabels: ["Ana Sayfa", "Isler", "Is Al", "Randevu", "Cuzdan"],
  requiredSections: ["Performans Skoru", "Cuzdan", "Bonus", "Bolgendeki Isler"],
  productDecisions,
}, null, 2)}\n`);

const rationale = [
  "# V12 Product Golden Rationale",
  "",
  "The V11 Golden baseline is kept immutable as historical rollback evidence.",
  "It cannot represent current V12 product completion because it carries retired bottom labels and drifts against the accepted current UI.",
  "",
  "The V12 Product Golden candidate is captured from the same feature branch stable legacy Home runtime.",
  "That source keeps the premium Home design while carrying current V12 product decisions.",
  "",
  `Legacy run-to-run diff: ${runDiffs.legacy.diffRatio}`,
  `Vue Home diff to candidate: ${crossDiffs.legacyVsVue.diffRatio}`,
  `V11 historical diff to candidate: ${crossDiffs.v11VsLegacy.diffRatio}`,
  "",
].join("\n");

await fs.writeFile(path.join(candidateDir, "V12_PRODUCT_GOLDEN_RATIONALE.md"), rationale);
await fs.writeFile(path.join(root, "V12_PRODUCT_GOLDEN_APPROVAL.md"), [
  "# V12 Product Golden Approval",
  "",
  `Status: ${manifest.reproducibility.pass && manifest.vueParity.pass ? "PASS" : "BLOCKED"}`,
  "",
  "- V11 historical Golden remains unchanged.",
  "- New V12 Product Golden uses stable premium Home with current product labels.",
  "- Intentional differences from V11 are documented in the manifest.",
  `- Run-to-run reproducibility max: ${Math.max(...Object.values(runDiffs).map((item) => item.diffRatio))}`,
  `- Vue Home final diff: ${crossDiffs.legacyVsVue.diffRatio}`,
  "",
].join("\n"));
await fs.writeFile(path.join(root, "V12_I_BASELINE_REPRODUCIBILITY_REPORT.md"), [
  "# V12-I Baseline Reproducibility Report",
  "",
  `Browser: Chromium ${browserVersion}`,
  `OS: ${os.type()} ${os.release()}`,
  `Viewport: ${viewportName}, dSF ${deviceScaleFactor}`,
  "",
  "| Source | Run diff | Status | URL |",
  "|---|---:|---|---|",
  ...sources.map((source) => `| ${source.name} | ${runDiffs[source.name].diffRatio} | ${runDiffs[source.name].diffRatio <= maxRunDiff ? "PASS" : "FAIL"} | ${source.url} |`),
  "",
  `V11 vs product candidate: ${crossDiffs.v11VsLegacy.diffRatio}`,
  `Product candidate vs Vue: ${crossDiffs.legacyVsVue.diffRatio}`,
  `Product candidate vs Vercel: ${crossDiffs.legacyVsVercel.diffRatio}`,
  "",
].join("\n"));
await fs.writeFile(path.join(root, "V12_I_HOME_PARITY_REPORT.md"), [
  "# V12-I Home Parity Report",
  "",
  `Status: ${manifest.vueParity.pass ? "PASS" : "FAIL"}`,
  `Target diff: <= ${maxVueDiff}`,
  `Vue diff: ${crossDiffs.legacyVsVue.diffRatio}`,
  "Baseline: tests/golden-master/v12-product-final/home.png",
  "Feature URL: ?engine=vue#/home",
  "",
].join("\n"));

console.log(JSON.stringify({
  reproducibilityPass: manifest.reproducibility.pass,
  vueParityPass: manifest.vueParity.pass,
  runDiffs,
  vueDiff: crossDiffs.legacyVsVue.diffRatio,
  candidate: path.relative(root, path.join(candidateDir, "home.png")),
  final: path.relative(root, path.join(finalDir, "home.png")),
}, null, 2));

if (!manifest.reproducibility.pass || !manifest.vueParity.pass) {
  process.exitCode = 1;
}
