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
];

test("screenshot smoke", async ({ page }) => {
  const outputDir = path.resolve("tests/screenshots");
  fs.mkdirSync(outputDir, { recursive: true });
  await page.setViewportSize({ width: 393, height: 852 });
  for (const route of screenshotRoutes) {
    await page.goto(`/#${route}`);
    await waitForApp(page);
    const name = route.replace("/", "") || "home";
    await page.screenshot({
      path: path.join(outputDir, `${name}.png`),
      fullPage: false,
    });
  }
});
