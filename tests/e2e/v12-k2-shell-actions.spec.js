import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("Vue preview header actions produce outcomes", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  await page.goto("/?engine=vue#/notifications");
  await waitForApp(page);
  await page.locator('[data-testid="app-header"] [data-testid="notification-settings-button"]').click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/notification-settings");

  await page.goto("/?engine=vue#/wallet");
  await waitForApp(page);
  await page.locator('[data-testid="app-header"] [data-testid="wallet-info-button"]').click();
  await expect(page.locator(".v-sheet-copy")).toContainText("Kredilerini");
  await page.keyboard.press("Escape").catch(() => {});

  await page.goto("/?engine=vue#/reviews");
  await waitForApp(page);
  await page.locator('[data-testid="app-header"] [data-testid="header-info-button"]').click();
  await expect(page.locator(".v-sheet-copy")).toContainText("Lipyum Partner");

  await page.goto("/?engine=vue#/home");
  await waitForApp(page);
  await page.locator('[data-action="credit"]').first().click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/wallet");

  await page.goto("/?engine=vue#/home");
  await waitForApp(page);
  await page.locator('[data-action="workPlan"]').first().click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/working-hours");

  expect(errors).toEqual([]);
});

test("Vue preview navigation bridge and browser back keep deterministic stack", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  await page.goto("/?engine=vue#/home");
  await waitForApp(page);
  await expect(page.evaluate(() => typeof window.navigateToPage)).resolves.toBe("function");

  await page.evaluate(() => window.navigateToPage("/profile"));
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/profile");
  await page.evaluate(() => window.navigateToPage("/partner-card-preview"));
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/partner-card-preview");

  await page.goBack();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/profile");
  await page.getByTestId("back-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/home");
  await expect.poll(() => page.evaluate(() => window.location.hash)).not.toContain("/partner-card-preview");

  await page.goto("/?engine=vue#/referral/partner/demo");
  await waitForApp(page);
  await page.getByTestId("back-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/referral/partners");

  expect(errors).toEqual([]);
});
