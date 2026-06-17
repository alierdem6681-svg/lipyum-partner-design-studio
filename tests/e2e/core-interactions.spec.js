import { expect, test } from "@playwright/test";
import { collectConsoleErrors, routes, waitForApp } from "./helpers.js";

test("header notification and profile actions navigate", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await page.getByTestId("notification-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/notifications");

  await page.goto("/#/home");
  await waitForApp(page);
  await page.getByTestId("profile-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/profile");

  expect(errors).toEqual([]);
});

test("back contract follows stack and direct fallback", async ({ page }) => {
  await page.goto("/#/home");
  await waitForApp(page);
  await page.evaluate(() => window.navigateToPage("/profile"));
  await page.evaluate(() => window.navigateToPage("/photo-gallery"));
  await page.getByTestId("back-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/profile");

  await page.goto("/#/profile");
  await waitForApp(page);
  await page.getByTestId("back-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/home");
});

for (const route of routes) {
  test(`app header is visible on ${route}`, async ({ page }) => {
    await page.goto(`/#${route}`);
    await waitForApp(page);
    await expect(page.getByTestId("app-header").first()).toBeVisible();
  });
}
