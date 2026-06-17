import { expect, test } from "@playwright/test";
import { waitForApp } from "./helpers.js";

test("back button returns through navigation stack", async ({ page }) => {
  await page.goto("/#/home");
  await waitForApp(page);
  await page.evaluate(() => window.navigateToPage("/profile"));
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/profile");
  await page.evaluate(() => window.navigateToPage("/photo-gallery"));
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/photo-gallery");
  await page.locator('[data-action="go-back"]').first().click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/profile");
});

test("direct route back falls back to home", async ({ page }) => {
  await page.goto("/#/profile");
  await waitForApp(page);
  await page.locator('[data-action="go-back"]').first().click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/home");
});
