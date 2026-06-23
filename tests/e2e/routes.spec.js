import { expect, test } from "@playwright/test";
import { blankBottomRoutes, bottomBarHiddenRoutes, collectConsoleErrors, expectNoAppHorizontalOverflow, routes, waitForApp } from "./helpers.js";

for (const route of routes) {
  test(`route smoke ${route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await waitForApp(page);
    if (!blankBottomRoutes.has(route)) {
      await expect(page.locator("#appRoot")).not.toBeEmpty();
    }
    if (bottomBarHiddenRoutes.has(route)) {
      await expect(page.locator("#bottomNav")).toHaveCount(0);
    } else {
      await expect(page.locator("#bottomNav")).toBeVisible();
    }
    await expect(page.locator(".page-header, .app-header, .notifications-head, .back-head, .v-app-header").first()).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}
