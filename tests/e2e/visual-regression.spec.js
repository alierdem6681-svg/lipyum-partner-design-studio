import { expect, test } from "@playwright/test";
import { bottomBarHiddenRoutes, collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const visualRoutes = [
  "/home",
  "/profile",
  "/notifications",
  "/support/new",
  "/support/live",
  "/referral",
  "/subscription",
  "/partner-card-preview",
];

test("V10 visual smoke keeps core screens framed and nonblank", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  for (const route of visualRoutes) {
    await page.goto(`/#${route}`);
    await waitForApp(page);
    await expect(page.getByTestId("app-header")).toBeVisible();
    if (bottomBarHiddenRoutes.has(route)) {
      await expect(page.getByTestId("app-bottom-bar")).toHaveCount(0);
    } else {
      await expect(page.getByTestId("app-bottom-bar")).toBeVisible();
    }
    await expectNoAppHorizontalOverflow(page);

    const contentHeight = await page.locator("#appRoot").evaluate((root) => root.scrollHeight);
    expect(contentHeight, `${route} should have visible content`).toBeGreaterThan(180);
  }

  expect(errors).toEqual([]);
});
