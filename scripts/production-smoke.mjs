import { chromium } from "@playwright/test";

const productionUrl = process.env.LIPYUM_PRODUCTION_URL || "https://alierdem6681-svg.github.io/lipyum-partner-design-studio/";
const expectedSha = process.env.LIPYUM_EXPECTED_SHA || "";
const baseUrl = productionUrl.endsWith("/") ? productionUrl : `${productionUrl}/`;

const routes = [
  ["#/home", "home-performance-card"],
  ["#/jobs", "jobs-page"],
  ["#/calendar", "calendar-page"],
  ["#/support/live", "live-support-page"],
];

async function assertFetch(path, description) {
  const response = await fetch(`${baseUrl}${path}?t=${Date.now()}`);
  if (!response.ok) throw new Error(`${description} failed with status ${response.status}`);
  return response;
}

await assertFetch("health.txt", "health check");
const release = await assertFetch("release.json", "release metadata").then((response) => response.json());
if (expectedSha && release.gitSha !== expectedSha) {
  throw new Error(`release.json SHA mismatch: expected ${expectedSha}, received ${release.gitSha}`);
}
if (release.platform !== "github-pages") {
  throw new Error(`release platform mismatch: ${release.platform}`);
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 393, height: 852 },
  isMobile: true,
  hasTouch: true,
});

try {
  for (const [hashRoute, testId] of routes) {
    const errors = [];
    page.removeAllListeners("console");
    page.removeAllListeners("pageerror");
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(`${baseUrl}${hashRoute}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".phone-screen", { state: "visible", timeout: 30_000 });
    await page.waitForSelector(`[data-testid="${testId}"]`, { state: "visible", timeout: 30_000 });
    const runtime = await page.locator("html").getAttribute("data-runtime");
    if (runtime !== "vue") throw new Error(`${hashRoute} runtime mismatch: ${runtime}`);
    const overflow = await page.evaluate(() => {
      const root = document.querySelector("#appRoot");
      return root ? root.scrollWidth > root.clientWidth + 1 : true;
    });
    if (overflow) throw new Error(`${hashRoute} has horizontal overflow`);
    if (errors.length) throw new Error(`${hashRoute} console/page errors: ${errors.join(" | ")}`);
  }
} finally {
  await browser.close();
}

console.log(`[production-smoke] PASS ${baseUrl} ${release.gitSha}`);
