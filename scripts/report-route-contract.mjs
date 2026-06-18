import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const contractPath = path.join(root, "tests/golden-master/v11-stable/ROUTE_PARITY_CONTRACT.json");
const reportDir = path.join(root, "tests/golden-master/v12-feature-preview");
const jsonPath = path.join(reportDir, "V12_ROUTE_CONTRACT_REPORT.json");
const mdPath = path.join(root, "V12_ROUTE_CONTRACT_REPORT.md");
const featureBaseUrl = process.env.V12_FEATURE_URL || "http://127.0.0.1:56389/?engine=vue";
const args = new Set(process.argv.slice(2));
const isStrict = args.has("--strict");
const contentOnly = args.has("--kind=content");
const interactionOnly = args.has("--kind=interaction");
const allRoutes = args.has("--all");
const explicitRoutes = [...args]
  .find((arg) => arg.startsWith("--routes="))
  ?.replace("--routes=", "")
  .split(",")
  .map((route) => route.trim())
  .filter(Boolean);
const defaultCoreRoutes = ["/home", "/jobs", "/my-jobs", "/calendar"];

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizeTexts(items) {
  return items.map((item) => String(item || "").replace(/\s+/g, " ").trim()).filter(Boolean);
}

function normalizeAction(item) {
  return {
    text: String(item.text || "").replace(/\s+/g, " ").trim(),
    action: item.action || "",
    href: item.href || "",
    testid: item.testid || "",
    role: item.role || "",
  };
}

function compareArrays(name, golden, feature, severity = "P1") {
  const goldenValue = JSON.stringify(golden);
  const featureValue = JSON.stringify(feature);
  if (goldenValue === featureValue) return [];
  return [{
    name,
    severity,
    goldenCount: golden.length,
    featureCount: feature.length,
    goldenPreview: golden.slice(0, 12),
    featurePreview: feature.slice(0, 12),
  }];
}

function compareRoute(golden, feature) {
  const diffs = [];
  const goldenCardTexts = normalizeTexts(golden.cardTexts.map((item) => item.text));
  const featureCardTexts = normalizeTexts(feature.cardTexts.map((item) => item.text));
  const goldenActions = golden.clickActions.map(normalizeAction);
  const featureActions = feature.clickActions.map(normalizeAction);

  if (!contentOnly) {
    diffs.push(...compareArrays("buttonLabels", golden.buttonLabels, feature.buttonLabels, "P1"));
    diffs.push(...compareArrays("filterLabels", golden.filterLabels, feature.filterLabels, "P1"));
    diffs.push(...compareArrays("clickActions", goldenActions, featureActions, "P1"));
  }

  if (!interactionOnly) {
    diffs.push(...compareArrays("headings", golden.headings, feature.headings, "P0"));
    diffs.push(...compareArrays("sectionOrder", golden.sectionOrder, feature.sectionOrder, "P0"));
    diffs.push(...compareArrays("cardTexts", goldenCardTexts, featureCardTexts, "P0"));
  }

  if (!contentOnly && !interactionOnly) {
    if (feature.geometry.horizontalOverflow) {
      diffs.push({ name: "horizontalOverflow", severity: "P0", golden: false, feature: true });
    }

    const contentHeightDelta = Math.abs((feature.geometry.contentHeight || 0) - (golden.geometry.contentHeight || 0));
    const contentHeightTolerance = Math.max(48, Math.round((golden.geometry.contentHeight || 1) * 0.08));
    if (contentHeightDelta > contentHeightTolerance) {
      diffs.push({
        name: "contentHeight",
        severity: "P1",
        golden: golden.geometry.contentHeight,
        feature: feature.geometry.contentHeight,
        tolerance: contentHeightTolerance,
      });
    }

    const goldenHeader = golden.geometry.header;
    const featureHeader = feature.geometry.header;
    if (goldenHeader && featureHeader) {
      const headerDelta = Math.abs((featureHeader.height || 0) - (goldenHeader.height || 0));
      if (headerDelta > 2) {
        diffs.push({ name: "headerGeometry", severity: "P1", golden: goldenHeader, feature: featureHeader });
      }
    } else if (goldenHeader || featureHeader) {
      diffs.push({ name: "headerPresence", severity: "P1", golden: goldenHeader, feature: featureHeader });
    }

    if (golden.bottomBar.visible !== feature.bottomBar.visible) {
      diffs.push({
        name: "bottomBarPresence",
        severity: "P0",
        golden: golden.bottomBar.visible,
        feature: feature.bottomBar.visible,
      });
    }
  }

  const blockingDiffs = diffs.filter((diff) => diff.severity === "P0" || diff.severity === "P1");
  return {
    diffs,
    status: blockingDiffs.length ? "FAIL" : "PASS",
  };
}

async function collectContract(page, currentRoute) {
  return page.evaluate((route) => {
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
      route,
      title: document.title,
      pageTitle: texts("h1,h2,.app-title h2,.page-header h2,.notifications-head h2")[0] || "",
      subtitle: texts(".app-title p,.page-header p,.notifications-head p")[0] || "",
      headings: texts("h1,h2,h3,.section-title h3").slice(0, 80),
      sectionOrder: texts(".section-title h3,h2,h3").slice(0, 80),
      cardTexts: records(".card,.ui-card,.v-card,article").slice(0, 80),
      buttonLabels: texts("button,a[role='button'],.primary-btn,.secondary-btn").slice(0, 120),
      filterLabels: texts(".tab-pill,.chip-btn,.segmented button,.filter-chip,.review-filter-chip").slice(0, 80),
      clickActions: records("button,[data-action],[data-open],[data-screen],a[href]").slice(0, 160),
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
        contentHeight: root ? root.scrollHeight : document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      },
      states: {
        hasEmptyState: !!document.querySelector(".empty-state,.v-empty,[data-empty-state]"),
        hasLoadingState: !!document.querySelector(".loading,.skeleton,[data-loading]"),
        hasErrorState: !!document.querySelector(".error-state,[data-error-state]"),
      },
    };
  }, currentRoute);
}

const contract = JSON.parse(await fs.readFile(contractPath, "utf8"));
const contractRoutes = allRoutes
  ? contract.contracts.map((item) => item.route)
  : explicitRoutes || defaultCoreRoutes;
const goldenByRoute = new Map(contract.contracts.map((item) => [item.route, item]));
const browser = await chromium.launch({ headless: true });
const results = [];

for (const route of contractRoutes) {
  const golden = goldenByRoute.get(route);
  if (!golden) {
    results.push({
      route,
      status: "FAIL",
      diffs: [{ name: "missingGoldenContract", severity: "P0" }],
    });
    continue;
  }

  const page = await browser.newPage({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(`${featureBaseUrl}#${route}`, { waitUntil: "networkidle", timeout: 45_000 });
  await page.evaluate(() => document.fonts?.ready || Promise.resolve());
  await page.addStyleTag({ content: "*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important;}" });
  await page.waitForTimeout(250);
  const feature = await collectContract(page, route);
  await page.close();

  const comparison = compareRoute(golden, feature);
  if (consoleErrors.length || pageErrors.length) {
    comparison.diffs.unshift({
      name: "consoleOrPageErrors",
      severity: "P0",
      consoleErrors,
      pageErrors,
    });
    comparison.status = "FAIL";
  }

  results.push({
    route,
    status: comparison.status,
    goldenContentHash: golden.contentHash,
    featureContentHash: hash(JSON.stringify({
      headings: feature.headings,
      cardTexts: feature.cardTexts.map((item) => item.text),
      buttonLabels: feature.buttonLabels,
      filterLabels: feature.filterLabels,
      clickActions: feature.clickActions.map((item) => `${item.text}|${item.action}|${item.href}`),
    })),
    diffs: comparison.diffs,
    goldenSummary: {
      headingCount: golden.headings.length,
      cardCount: golden.cardTexts.length,
      buttonCount: golden.buttonLabels.length,
      actionCount: golden.clickActions.length,
      contentHeight: golden.geometry.contentHeight,
    },
    featureSummary: {
      headingCount: feature.headings.length,
      cardCount: feature.cardTexts.length,
      buttonCount: feature.buttonLabels.length,
      actionCount: feature.clickActions.length,
      contentHeight: feature.geometry.contentHeight,
    },
  });
}

await browser.close();
await fs.mkdir(reportDir, { recursive: true });
await fs.writeFile(jsonPath, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  mode: isStrict ? "strict" : "report",
  featureBaseUrl,
  routeCount: results.length,
  results,
}, null, 2)}\n`);

const lines = [
  "# V12 Route Contract Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Mode: \`${isStrict ? "strict" : "report"}\``,
  `Feature URL: \`${featureBaseUrl}\``,
  "",
  "| Route | Status | Golden cards | Vue cards | Golden actions | Vue actions | Blocking diffs |",
  "|---|---|---:|---:|---:|---:|---:|",
];

for (const item of results) {
  const blocking = item.diffs.filter((diff) => diff.severity === "P0" || diff.severity === "P1").length;
  lines.push(`| ${item.route} | ${item.status} | ${item.goldenSummary?.cardCount ?? "-"} | ${item.featureSummary?.cardCount ?? "-"} | ${item.goldenSummary?.actionCount ?? "-"} | ${item.featureSummary?.actionCount ?? "-"} | ${blocking} |`);
}

lines.push("");
lines.push("## Diff Details");
lines.push("");
for (const item of results.filter((result) => result.status !== "PASS")) {
  lines.push(`### ${item.route}`);
  for (const diff of item.diffs.slice(0, 12)) {
    lines.push(`- ${diff.severity}: ${diff.name}`);
  }
  lines.push("");
}

await fs.writeFile(mdPath, `${lines.join("\n")}\n`);
console.log(`Wrote ${mdPath}`);
console.log(`Wrote ${jsonPath}`);

if (isStrict && results.some((item) => item.status !== "PASS")) {
  console.error("[v12-route-contract] strict parity failed.");
  process.exit(1);
}
