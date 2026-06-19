import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nodeBin = process.platform === "win32"
  ? path.join(root, "node_modules", "node", "bin", "node.exe")
  : path.join(root, "node_modules", "node", "bin", "node");
const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");
const strict = process.argv.includes("--strict");
const port = Number(process.env.V12_K_VISUAL_PORT || "4187");
const baseUrl = process.env.V12_K_VISUAL_BASE_URL || `http://127.0.0.1:${port}`;
const maxSurfaceDiff = Number(process.env.V12_K_SURFACE_MAX_DIFF_RATIO || "0.015");
const outputDir = path.join(root, "artifacts", "v12-k-final", "visual-regression");
const viewport = { width: 393, height: 852 };
const routes = [
  "/home",
  "/profile",
  "/notifications",
  "/support",
  "/support/new",
  "/support/live",
  "/reviews",
  "/leaderboard",
  "/subscription",
  "/referral",
  "/partner-card-preview",
  "/jobs",
  "/my-jobs",
  "/calendar",
  "/wallet",
];
const routeSurfaces = [
  { name: "header", selector: '[data-testid="app-header"]', strict: true },
  { name: "bottom-bar", selector: '[data-testid="app-bottom-bar"]', strict: true },
];
const profileSurfaces = [
  { name: "profile-card", selector: '[data-testid="partner-profile-card"]', strict: true },
  { name: "profile-strength", selector: ".profile-strength-card", strict: true },
  { name: "profile-grid", selector: ".profile-menu-grid", strict: true },
];

function routeSlug(route) {
  return route.replace(/^\//, "").replace(/\//g, "__") || "home";
}

async function ensureServer() {
  try {
    const response = await fetch(baseUrl);
    if (response.ok) return null;
  } catch {
    // Start local server below.
  }

  const child = spawn(nodeBin, [viteBin, "--host", "127.0.0.1", "--port", String(port)], {
    cwd: root,
    stdio: "ignore",
    shell: false,
  });

  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return child;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  child.kill();
  throw new Error(`Vite server did not start at ${baseUrl}`);
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

async function compareImages(stablePath, vuePath, diffPath) {
  const stable = PNG.sync.read(await fs.readFile(stablePath));
  const vue = PNG.sync.read(await fs.readFile(vuePath));
  const width = Math.max(stable.width, vue.width);
  const height = Math.max(stable.height, vue.height);
  const stableNormalized = normalizeSize(stable, width, height);
  const vueNormalized = normalizeSize(vue, width, height);
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(stableNormalized.data, vueNormalized.data, diff.data, width, height, {
    threshold: 0.12,
    includeAA: false,
  });
  await fs.writeFile(diffPath, PNG.sync.write(diff));
  return {
    width,
    height,
    diffPixels,
    totalPixels: width * height,
    diffRatio: Number((diffPixels / (width * height)).toFixed(6)),
  };
}

async function preparePage(page, url) {
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
  await page.evaluate(() => document.fonts?.ready || Promise.resolve());
  await page.addStyleTag({
    content: [
      "*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important;caret-color:transparent!important;}",
      ".v-bottom__cta--home{animation:none!important;}",
      ".region-activity-message,.nav-alert-track{animation:none!important;transform:none!important;}",
    ].join("\n"),
  });
  await page.waitForTimeout(250);
  return { consoleErrors, pageErrors };
}

async function capture(page, selector, outputPath) {
  const locator = page.locator(selector).first();
  if ((await locator.count()) === 0) return false;
  await locator.screenshot({ path: outputPath });
  return true;
}

async function capturePair(browser, route, surface) {
  const slug = routeSlug(route);
  const stablePage = await browser.newPage({ viewport, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const vuePage = await browser.newPage({ viewport, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const stableInfo = await preparePage(stablePage, `${baseUrl}/#${route}`);
  const vueInfo = await preparePage(vuePage, `${baseUrl}/?engine=vue#${route}`);
  const surfaceDir = path.join(outputDir, "393x852", slug);
  await fs.mkdir(surfaceDir, { recursive: true });

  const stablePath = path.join(surfaceDir, `${surface.name}.stable.png`);
  const vuePath = path.join(surfaceDir, `${surface.name}.vue.png`);
  const diffPath = path.join(surfaceDir, `${surface.name}.diff.png`);
  const stableExists = await capture(stablePage, surface.selector, stablePath);
  const vueExists = await capture(vuePage, surface.selector, vuePath);
  let result;

  if (stableExists && vueExists) {
    result = await compareImages(stablePath, vuePath, diffPath);
  }

  await stablePage.close();
  await vuePage.close();

  return {
    route,
    surface: surface.name,
    strict: surface.strict,
    stableExists,
    vueExists,
    stableScreenshot: path.relative(root, stablePath).replaceAll("\\", "/"),
    vueScreenshot: path.relative(root, vuePath).replaceAll("\\", "/"),
    diffScreenshot: path.relative(root, diffPath).replaceAll("\\", "/"),
    ...(result || {}),
    consoleErrors: [...stableInfo.consoleErrors, ...vueInfo.consoleErrors],
    pageErrors: [...stableInfo.pageErrors, ...vueInfo.pageErrors],
  };
}

async function captureDrawerPair(browser) {
  const stablePage = await browser.newPage({ viewport, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const vuePage = await browser.newPage({ viewport, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const stableInfo = await preparePage(stablePage, `${baseUrl}/#/home`);
  const vueInfo = await preparePage(vuePage, `${baseUrl}/?engine=vue#/home`);
  await stablePage.getByTestId("hamburger-button").click();
  await vuePage.getByTestId("hamburger-button").click();
  await stablePage.waitForTimeout(250);
  await vuePage.waitForTimeout(250);

  const surfaceDir = path.join(outputDir, "393x852", "drawer");
  await fs.mkdir(surfaceDir, { recursive: true });
  const stablePath = path.join(surfaceDir, "drawer.stable.png");
  const vuePath = path.join(surfaceDir, "drawer.vue.png");
  const diffPath = path.join(surfaceDir, "drawer.diff.png");
  const stableExists = await capture(stablePage, '[data-testid="sidebar-drawer"]', stablePath);
  const vueExists = await capture(vuePage, '[data-testid="sidebar-drawer"]', vuePath);
  const result = stableExists && vueExists ? await compareImages(stablePath, vuePath, diffPath) : {};
  await stablePage.close();
  await vuePage.close();
  return {
    route: "/home",
    surface: "drawer",
    strict: true,
    stableExists,
    vueExists,
    stableScreenshot: path.relative(root, stablePath).replaceAll("\\", "/"),
    vueScreenshot: path.relative(root, vuePath).replaceAll("\\", "/"),
    diffScreenshot: path.relative(root, diffPath).replaceAll("\\", "/"),
    ...result,
    consoleErrors: [...stableInfo.consoleErrors, ...vueInfo.consoleErrors],
    pageErrors: [...stableInfo.pageErrors, ...vueInfo.pageErrors],
  };
}

function imageTag(relativePath) {
  return `<img src="${pathToFileURL(path.join(root, relativePath)).href}" />`;
}

async function writeContactSheet(results) {
  const rows = results
    .filter((result) => result.stableExists && result.vueExists)
    .map((result) => `
      <tr>
        <td><strong>${result.route}</strong><br>${result.surface}<br>${result.diffRatio ?? "-"}</td>
        <td>${imageTag(result.stableScreenshot)}</td>
        <td>${imageTag(result.vueScreenshot)}</td>
        <td>${imageTag(result.diffScreenshot)}</td>
      </tr>
    `)
    .join("\n");
  const html = `<!doctype html>
  <html><head><meta charset="utf-8"><style>
  body{font-family:Inter,Arial,sans-serif;margin:0;padding:18px;background:#f8fafc;color:#101828}
  h1{font-size:22px;margin:0 0 14px}
  table{border-collapse:collapse;width:100%}
  td{vertical-align:top;border:1px solid #d0d5dd;padding:8px;background:white;font-size:12px}
  img{width:180px;max-height:420px;object-fit:contain;border:1px solid #eef2f7;background:#fff}
  </style></head><body><h1>V12-K Stable to Vue Visual Regression</h1><table>${rows}</table></body></html>`;
  const htmlPath = path.join(outputDir, "V12_K_DESIGN_APPROVAL_CONTACT_SHEET.html");
  const pngPath = path.join(outputDir, "V12_K_DESIGN_APPROVAL_CONTACT_SHEET.png");
  await fs.writeFile(htmlPath, html);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1800 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  return {
    html: path.relative(root, htmlPath).replaceAll("\\", "/"),
    png: path.relative(root, pngPath).replaceAll("\\", "/"),
  };
}

await fs.mkdir(outputDir, { recursive: true });
const server = await ensureServer();
const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const route of routes) {
    for (const surface of routeSurfaces) {
      results.push(await capturePair(browser, route, surface));
    }
    if (route === "/profile") {
      for (const surface of profileSurfaces) results.push(await capturePair(browser, route, surface));
    }
  }
  results.push(await captureDrawerPair(browser));
} finally {
  await browser.close();
  if (server) server.kill();
}

const failures = results.filter((result) =>
  result.strict &&
  (!result.stableExists ||
    !result.vueExists ||
    result.diffRatio > maxSurfaceDiff ||
    result.consoleErrors.length ||
    result.pageErrors.length)
);
const contactSheet = await writeContactSheet(results);
const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  viewport: "393x852",
  maxSurfaceDiff,
  status: failures.length ? "FAIL" : "PASS",
  contactSheet,
  results,
  failures,
};

await fs.writeFile(path.join(outputDir, "V12_K_VISUAL_REGRESSION_REPORT.json"), `${JSON.stringify(report, null, 2)}\n`);
await fs.writeFile(
  path.join(root, "V12_K_DESIGN_PARITY_REPORT.md"),
  [
    "# V12-K Design Parity Report",
    "",
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    `Contact sheet: ${contactSheet.png}`,
    "",
    "| Route | Surface | Status | Diff ratio | Stable | Vue | Diff |",
    "|---|---|---|---:|---|---|---|",
    ...results.map((result) => {
      const status = failures.includes(result) ? "FAIL" : "PASS";
      return `| ${result.route} | ${result.surface} | ${status} | ${result.diffRatio ?? "-"} | ${result.stableScreenshot} | ${result.vueScreenshot} | ${result.diffScreenshot} |`;
    }),
    "",
  ].join("\n"),
);

console.log(`[v12-k-visual] ${report.status}: ${results.length} surfaces checked.`);
console.log(`[v12-k-visual] Contact sheet: ${contactSheet.png}`);

if (strict && failures.length) process.exit(1);
