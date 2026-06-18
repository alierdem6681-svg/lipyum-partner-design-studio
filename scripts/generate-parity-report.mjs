import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const goldenPath = path.join(root, "tests/golden-master/v11-stable/GOLDEN_MASTER_MANIFEST.json");
const reportPath = path.join(root, "V12_VISUAL_PARITY_REPORT.md");
const jsonPath = path.join(root, "tests/golden-master/v11-stable/V12_VISUAL_PARITY_REPORT.json");
const routes = ["/home"];
const viewport = { width: 393, height: 852, name: "393x852" };
const featureBaseUrl = process.env.V12_FEATURE_URL || "http://127.0.0.1:56389/?engine=vue";

function hashBuffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function statusFromDiff(diff) {
  if (diff.pixelMatch && diff.contentMatch && diff.interactionMatch) return "PASS";
  if (!diff.pixelMatch || !diff.contentMatch) return "FAIL";
  return "WARN";
}

const golden = JSON.parse(await fs.readFile(goldenPath, "utf8"));
const goldenByRoute = new Map(
  golden.records
    .filter((item) => item.target === "vercel" && item.viewport === viewport.name)
    .map((item) => [item.route, item]),
);

const browser = await chromium.launch({ headless: true });
const results = [];
const screenshotDir = path.join(root, "tests/golden-master/v12-feature-preview", viewport.name);
await fs.mkdir(screenshotDir, { recursive: true });

for (const route of routes) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2, isMobile: true });
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(`${featureBaseUrl}#${route}`, { waitUntil: "networkidle", timeout: 45000 });
  await page.evaluate(() => document.fonts?.ready || Promise.resolve());
  await page.addStyleTag({ content: "*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important;}" });
  await page.waitForTimeout(300);

  const metrics = await page.evaluate(() => {
    const text = (selector) => Array.from(document.querySelectorAll(selector))
      .filter((el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length))
      .map((el) => el.textContent.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    const header = document.querySelector("[data-testid='app-header']");
    const bottom = document.querySelector("[data-testid='app-bottom-bar']");
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y) };
    };
    return {
      title: document.title,
      bodyTextLength: document.body.innerText.trim().length,
      visibleSections: text("h1,h2,h3,[data-section-title],.section-title").slice(0, 30),
      buttonLabels: text("button,a[role='button']").slice(0, 80),
      cardCount: document.querySelectorAll("[data-testid$='card'], .card, .lp-card, article, .v-card").length,
      iconCount: document.querySelectorAll("svg").length,
      headerHeight: rect(header)?.height || 0,
      bottomBarHeight: rect(bottom)?.height || 0,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });

  const screenshot = await page.screenshot({ fullPage: true });
  const screenshotFile = path.join(screenshotDir, `${route.replace("/", "").replace(/\//g, "__")}.png`);
  await fs.writeFile(screenshotFile, screenshot);
  const goldenRecord = goldenByRoute.get(route);
  const featureHash = hashBuffer(screenshot);
  const diff = {
    pixelMatch: goldenRecord?.screenshotHash === featureHash,
    contentMatch: goldenRecord
      ? goldenRecord.bodyTextLength === metrics.bodyTextLength
        && JSON.stringify(goldenRecord.visibleSections || []) === JSON.stringify(metrics.visibleSections || [])
      : false,
    interactionMatch: goldenRecord
      ? JSON.stringify(goldenRecord.buttonLabels || []) === JSON.stringify(metrics.buttonLabels || [])
      : false,
    headerMatch: goldenRecord ? Math.abs((goldenRecord.headerHeight || 0) - metrics.headerHeight) <= 1 : false,
    bottomMatch: goldenRecord ? Math.abs((goldenRecord.bottomBarHeight || 0) - metrics.bottomBarHeight) <= 1 : false,
  };
  results.push({
    route,
    goldenScreenshot: goldenRecord?.screenshotPath,
    featureScreenshot: path.relative(root, screenshotFile),
    goldenHash: goldenRecord?.screenshotHash,
    featureHash,
    consoleErrors,
    pageErrors,
    metrics,
    goldenMetrics: goldenRecord,
    diff,
    status: statusFromDiff(diff),
  });
  await page.close();
}

await browser.close();
await fs.writeFile(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), viewport, results }, null, 2));

const lines = [
  "# V12 Visual Parity Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Feature URL: \`${featureBaseUrl}\``,
  "",
  "| Route | Golden | Vue | Pixel fark | İçerik farkı | Interaction farkı | Durum |",
  "|---|---|---|---:|---|---|---|",
];

for (const item of results) {
  lines.push(`| ${item.route} | ${item.goldenScreenshot || "missing"} | ${item.featureScreenshot} | ${item.diff.pixelMatch ? "0" : "diff"} | ${item.diff.contentMatch ? "none" : "diff"} | ${item.diff.interactionMatch ? "none" : "diff"} | ${item.status} |`);
}

lines.push("");
lines.push("## Gate Decision");
lines.push("");
if (results.some((item) => item.status !== "PASS")) {
  lines.push("P0/P1 parity differences are present. The Vue core routes must not be activated as the default production route yet.");
} else {
  lines.push("All checked routes passed the parity gate.");
}
lines.push("");
lines.push("## Notes");
lines.push("");
lines.push("- Pixel parity uses screenshot hashes from the frozen V11 Golden Master manifest.");
lines.push("- Content parity compares visible section lists and text length.");
lines.push("- Interaction parity compares visible button/action labels.");
lines.push("- A FAIL result is expected until each Vue SFC is visually matched to the Golden Master.");

await fs.writeFile(reportPath, `${lines.join("\n")}\n`);
console.log(`Wrote ${reportPath}`);
console.log(`Wrote ${jsonPath}`);
