import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

for (const route of ["/wallet", "/profile", "/notifications", "/support", "/referral", "/packages"]) {
  test(`V12 compatibility bridge renders ${route} inside Vue shell`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await waitForApp(page);

    await expect(page.getByTestId("app-header")).toBeVisible();
    await expect(page.getByTestId("app-bottom-bar")).toBeVisible();
    await expect(page.getByTestId("legacy-content-bridge")).toBeVisible();
    await expect(page.locator("#appRoot")).not.toBeEmpty();

    expect(errors).toEqual([]);
  });
}
