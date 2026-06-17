import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("V10 back stack survives deeper product routes", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await page.evaluate(() => window.navigateToPage("/profile"));
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/profile");
  await page.evaluate(() => window.navigateToPage("/partner-card-preview"));
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/partner-card-preview");
  await page.getByTestId("back-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/profile");

  await page.evaluate(() => window.navigateToPage("/support/new"));
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/support/new");
  await page.evaluate(() => window.navigateToPage("/support/live"));
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/support/live");
  await page.getByTestId("back-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/support/new");

  expect(errors).toEqual([]);
});
