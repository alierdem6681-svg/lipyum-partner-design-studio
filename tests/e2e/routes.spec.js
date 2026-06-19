import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, routes, waitForApp } from "./helpers.js";

test("root opens home route", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/");
  await waitForApp(page);

  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#/home");
  await expect(page.locator(".profile-screen, .profile-page")).toHaveCount(0);
  await expect(page.locator("#appRoot")).toContainText("Performans Skoru");

  expect(errors).toEqual([]);
});

for (const route of routes) {
  test(`route smoke ${route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await waitForApp(page);
    await expect(page.locator("#appRoot")).not.toBeEmpty();
    await expect(page.locator("#bottomNav")).toBeVisible();
    await expect(page.locator(".page-header, .app-header, .notifications-head, .back-head, .v-app-header").first()).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}
