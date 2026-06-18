import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("V11 notifications header uses a meaningful settings action", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/notifications");
  await waitForApp(page);

  const settingsButton = page.getByTestId("notification-settings-button");
  await expect(settingsButton).toBeVisible();
  await expect(settingsButton.locator("span")).toHaveCount(0);

  await settingsButton.click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/notification-settings");
  await expect(page.getByTestId("app-header")).toBeVisible();

  expect(errors).toEqual([]);
});
