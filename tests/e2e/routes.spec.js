import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, routes, waitForApp } from "./helpers.js";

for (const route of routes) {
  test(`route smoke ${route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await waitForApp(page);
    await expect(page.locator("#appRoot")).not.toBeEmpty();
    await expect(page.locator("#bottomNav")).toBeVisible();
    await expect(page.locator(".page-header, .app-header, .notifications-head, .back-head").first()).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}
