import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const reportDir = process.env.V12_PRODUCT_REPORT_DIR || path.join(root, "artifacts/v12-i/product-home-contract");
const strict = process.argv.includes("--strict");
const baseUrl = process.env.V12_FEATURE_URL || "http://127.0.0.1:5173";

function homeUrl(base) {
  const url = new URL(base);
  url.hash = "/home";
  return url.toString();
}

await fs.mkdir(reportDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 393, height: 852 },
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

const featureUrl = homeUrl(baseUrl);
await page.goto(featureUrl, { waitUntil: "networkidle", timeout: 60_000 });
await page.evaluate(() => document.fonts?.ready || Promise.resolve());
await page.addStyleTag({
  content: "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;}",
});
await page.waitForTimeout(300);

const state = await page.evaluate(() => {
  const text = document.body.innerText;
  const visible = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };
  const bottomLabels = Array.from(document.querySelectorAll(".bottom-item span, .v-bottom__label"))
    .map((element) => element.textContent.trim())
    .filter(Boolean);
  return {
    title: document.title,
    runtime: document.documentElement.dataset.runtime || document.body.dataset.runtime || document.getElementById("app")?.dataset.runtime || "",
    bodyTextPreview: text.slice(0, 500),
    bottomLabels,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    requiredText: {
      performance: text.includes("Performans Skoru"),
      score: text.includes("81"),
      scoreCta: text.includes("Skorumu Art"),
      wallet: text.includes("Cüzdan") || text.includes("CÃ¼zdan"),
      bonus: text.includes("Bonus"),
      credit: text.includes("675"),
      bonusAmount: text.includes("240"),
      region: text.includes("Bölgendeki") || text.includes("BÃ¶lgendeki"),
      today: text.includes("Bugün") || text.includes("BugÃ¼n"),
      yesterday: text.includes("Dün") || text.includes("DÃ¼n"),
    },
    requiredElements: {
      header: visible('[data-testid="app-header"]'),
      bottomBar: visible('[data-testid="app-bottom-bar"]'),
      performanceCard: visible('[data-testid="home-performance-card"]'),
      walletCard: visible('[data-testid="home-wallet-card"]'),
      regionCard: visible('[data-testid="home-region-card"]'),
      notificationButton: visible('[data-testid="notification-button"]'),
      profileButton: visible('[data-testid="profile-button"]'),
      hamburgerButton: visible('[data-testid="hamburger-button"]'),
    },
  };
});

const bottomExpected = ["Ana Sayfa", "İşler", "İş Al", "Randevu", "Cüzdan"];
const bottomAsciiExpected = ["Ana Sayfa", "Ä°ÅŸler", "Ä°ÅŸ Al", "Randevu", "CÃ¼zdan"];
const bottomPass = JSON.stringify(state.bottomLabels) === JSON.stringify(bottomExpected)
  || JSON.stringify(state.bottomLabels) === JSON.stringify(bottomAsciiExpected);

await page.getByText(/Nedir/i).first().click();
const performanceSheetOpen = await page.locator('[role="dialog"]').count().catch(() => 0);
await page.keyboard.press("Escape").catch(() => {});

const failures = [];
for (const [name, pass] of Object.entries(state.requiredText)) {
  if (!pass) failures.push(`missing text: ${name}`);
}
for (const [name, pass] of Object.entries(state.requiredElements)) {
  if (!pass) failures.push(`missing element: ${name}`);
}
if (!bottomPass) failures.push(`bottom labels mismatch: ${state.bottomLabels.join(" | ")}`);
if (state.horizontalOverflow) failures.push("horizontal overflow");
if (state.runtime !== "vue") failures.push(`runtime marker mismatch: ${state.runtime}`);
if (consoleErrors.length) failures.push("console errors");
if (pageErrors.length) failures.push("page errors");
if (!performanceSheetOpen) failures.push("performance info sheet did not open");

await browser.close();

const report = {
  status: failures.length ? "FAIL" : "PASS",
  featureUrl,
  state,
  bottomExpected,
  performanceSheetOpen: Boolean(performanceSheetOpen),
  consoleErrors,
  pageErrors,
  failures,
};

await fs.writeFile(path.join(reportDir, "V12_PRODUCT_HOME_CONTRACT_REPORT.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));

if (strict && failures.length) {
  console.error("[v12-product-home-contract] strict contract failed");
  process.exit(1);
}
