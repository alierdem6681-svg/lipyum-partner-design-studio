import { test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { waitForApp } from "./helpers.js";

const screenshotRoutes = [
  "/home",
  "/profile",
  "/notifications",
  "/support",
  "/reviews",
  "/wallet",
  "/leaderboard",
  "/referral",
  "/job-referral",
  "/ui-kit",
  "/vue-job-referral",
];

const screenshotViewports = [
  { name: "iphone15-simulator", width: 960, height: 980 },
  { name: "mobile-360", width: 360, height: 780 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
];

test.setTimeout(120_000);

test("screenshot smoke", async ({ page }) => {
  const outputDir = path.resolve("tests/screenshots");
  fs.mkdirSync(outputDir, { recursive: true });
  for (const viewport of screenshotViewports) {
    const viewportDir = path.join(outputDir, viewport.name);
    fs.mkdirSync(viewportDir, { recursive: true });
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const route of screenshotRoutes) {
      await page.goto(`/#${route}`);
      await waitForApp(page);
      const name = route.replace("/", "") || "home";
      await page.screenshot({
        path: path.join(viewportDir, `${name}.png`),
        fullPage: false,
      });
    }
  }
});
