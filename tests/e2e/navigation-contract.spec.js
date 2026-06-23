import { expect, test } from "@playwright/test";
import { bottomBarHiddenRoutes, collectConsoleErrors, routes, waitForApp } from "./helpers.js";

test("core contract test ids are present on home", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  for (const testId of [
    "app-header",
    "hamburger-button",
    "notification-button",
    "profile-button",
    "app-bottom-bar",
    "bottom-tab-home",
    "bottom-tab-jobs",
    "bottom-tab-calendar",
    "bottom-tab-wallet",
    "bottom-cta-job",
  ]) {
    await expect(page.getByTestId(testId).first()).toBeVisible();
  }

  expect(errors).toEqual([]);
});

for (const route of routes) {
  test(`navigation contract bottom bar visibility on ${route}`, async ({ page }) => {
    await page.goto(`/#${route}`);
    await waitForApp(page);
    if (bottomBarHiddenRoutes.has(route)) {
      await expect(page.getByTestId("app-bottom-bar")).toHaveCount(0);
      return;
    }
    await expect(page.getByTestId("app-bottom-bar").first()).toBeVisible();
  });
}
