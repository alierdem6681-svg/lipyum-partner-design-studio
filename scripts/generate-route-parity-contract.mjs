import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const outputPath = path.join(root, "tests/golden-master/v11-stable/ROUTE_PARITY_CONTRACT.json");
const baseUrl = process.env.V11_STABLE_URL || "http://127.0.0.1:56387";
const viewport = { width: 393, height: 852 };
const routes = [
  "/home",
  "/wallet",
  "/profile",
  "/notifications",
  "/support",
  "/support/new",
  "/support/live",
  "/support/customer-service",
  "/satisfaction",
  "/messages",
  "/reviews",
  "/leaderboard",
  "/referral",
  "/job-referral",
  "/partners",
  "/customers",
  "/subscription",
  "/bonus",
  "/performance-score",
  "/invoices",
  "/income-expense",
  "/appointment-link",
  "/about",
  "/photo-gallery",
  "/services",
  "/regions",
  "/working-hours",
  "/team",
  "/capacity",
  "/strategy",
  "/account-settings",
  "/notification-settings",
  "/contact-settings",
  "/partner-card-preview",
];

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

const browser = await chromium.launch({ headless: true });
const contracts = [];

for (const route of routes) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const url = `${baseUrl}#${route}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
  await page.evaluate(() => document.fonts?.ready || Promise.resolve());
  await page.addStyleTag({ content: "*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important;}" });
  await page.waitForTimeout(250);

  const contract = await page.evaluate((currentRoute) => {
    const visible = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    const clean = (value) => (value || "").replace(/\s+/g, " ").trim();
    const texts = (selector) => Array.from(document.querySelectorAll(selector))
      .filter(visible)
      .map((el) => clean(el.textContent))
      .filter(Boolean);
    const records = (selector) => Array.from(document.querySelectorAll(selector))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          text: clean(el.textContent).slice(0, 220),
          className: el.className ? String(el.className).slice(0, 160) : "",
          testid: el.getAttribute("data-testid") || "",
          action: el.getAttribute("data-action") || el.getAttribute("data-open") || el.getAttribute("data-screen") || "",
          href: el.getAttribute("href") || "",
          role: el.getAttribute("role") || "",
          bounds: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
        };
      });
    const actionableSelector = "button,a[href],input,textarea,select,[role='button'],[data-action],[data-route],[data-open],[data-screen]";
    const isNativeAction = (el) => ["BUTTON", "A", "INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
    const isActionable = (el) => {
      if (el.closest("[data-contract-ignore='true']")) return false;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const disabled = el.disabled || el.getAttribute("aria-disabled") === "true";
      const inViewport = rect.width > 0
        && rect.height > 0
        && rect.right > 0
        && rect.bottom > 0
        && rect.left < window.innerWidth
        && rect.top < window.innerHeight;
      const interactiveChild = !isNativeAction(el)
        && el.getAttribute("role") !== "button"
        && !!el.querySelector("button,a[href],input,textarea,select,[role='button']");
      const pageSizedWrapper = rect.width >= window.innerWidth * 0.92 && rect.height >= window.innerHeight * 0.72;
      return inViewport
        && !disabled
        && style.display !== "none"
        && style.visibility !== "hidden"
        && style.pointerEvents !== "none"
        && Number(style.opacity || "1") > 0
        && !interactiveChild
        && !pageSizedWrapper;
    };
    const actionRecords = () => Array.from(document.querySelectorAll(actionableSelector))
      .filter((el) => visible(el) && isActionable(el))
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const label = el.getAttribute("aria-label") || el.textContent || el.getAttribute("value") || "";
        return {
          label: clean(label).slice(0, 160),
          text: clean(el.textContent).slice(0, 160),
          testid: el.getAttribute("data-testid") || "",
          action: el.getAttribute("data-action") || el.getAttribute("data-open") || el.getAttribute("data-route") || el.getAttribute("data-screen") || "",
          route: el.getAttribute("data-route") || el.getAttribute("href") || "",
          href: el.getAttribute("href") || "",
          role: el.getAttribute("role") || "",
          tagName: el.tagName.toLowerCase(),
          bounds: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
          visible: true,
          expectedOutcome: "",
        };
      });
    const root = document.querySelector("#appRoot");
    const header = document.querySelector(".app-header, .page-header, .notifications-head, .back-head, [data-testid='app-header']");
    const bottom = document.querySelector("[data-testid='app-bottom-bar'], .bottom-nav");
    const firstCard = document.querySelector(".card, .ui-card, .v-card, article");
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        width: Math.round(r.width),
        height: Math.round(r.height),
      };
    };

    return {
      route: currentRoute,
      title: document.title,
      pageTitle: texts("h1,h2,.app-title h2,.page-header h2,.notifications-head h2")[0] || "",
      subtitle: texts(".app-title p,.page-header p,.notifications-head p")[0] || "",
      headings: texts("h1,h2,h3,.section-title h3").slice(0, 80),
      sectionOrder: texts("h1,h2,h3,.section-title h3").slice(0, 80),
      cardTexts: records(".card,.ui-card,.v-card,article").slice(0, 80),
      buttonLabels: texts("button,a[role='button'],.primary-btn,.secondary-btn").slice(0, 120),
      filterLabels: texts(".tab-pill,.chip-btn,.segmented button,.filter-chip,.review-filter-chip").slice(0, 80),
      clickActions: actionRecords().slice(0, 160),
      modalOrSheetTriggers: records("[data-open]").slice(0, 80),
      headerActions: records(".app-header button,.page-header button,.notifications-head button,.back-head button").slice(0, 20),
      bottomBar: {
        visible: !!bottom && visible(bottom),
        bounds: rect(bottom),
        labels: texts("#bottomNav button,.bottom-nav button,[data-testid='app-bottom-bar'] button"),
      },
      cta: records("[data-testid='bottom-cta-job'],.fab,.nav-cta,.bottom-cta").slice(0, 10),
      geometry: {
        header: rect(header),
        firstCard: rect(firstCard),
        contentHeight: Math.max(root ? root.scrollHeight : document.documentElement.scrollHeight, window.innerHeight),
        viewportHeight: window.innerHeight,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      },
      states: {
        hasEmptyState: !!document.querySelector(".empty-state,.v-empty,[data-empty-state]"),
        hasLoadingState: !!document.querySelector(".loading,.skeleton,[data-loading]"),
        hasErrorState: !!document.querySelector(".error-state,[data-error-state]"),
      },
    };
  }, route);

  contracts.push({
    ...contract,
    contentHash: hash(JSON.stringify({
      headings: contract.headings,
      cardTexts: contract.cardTexts.map((item) => item.text),
      buttonLabels: contract.buttonLabels,
      filterLabels: contract.filterLabels,
      clickActions: contract.clickActions.map((item) => `${item.label || item.text}|${item.action}|${item.route || item.href}`),
    })),
  });
  await page.close();
}

await browser.close();
await fs.writeFile(outputPath, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  baseUrl,
  viewport: "393x852",
  routeCount: contracts.length,
  contracts,
}, null, 2)}\n`);
console.log(`Wrote ${outputPath}`);
