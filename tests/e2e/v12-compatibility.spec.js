import { expect, test } from "@playwright/test";

const compatibilityRoutes = ["/wallet", "/profile", "/notifications", "/referral"];

for (const route of compatibilityRoutes) {
  test(`V12 compatibility bridge does not duplicate chrome for ${route}`, async ({ page }) => {
    await page.goto(`/?engine=vue#${route}`);
    await expect(page.locator("[data-testid='app-header']")).toHaveCount(1);
    await expect(page.locator("[data-testid='app-bottom-bar']")).toHaveCount(1);
    await expect(page.getByText("geçici compatibility bridge")).toBeVisible();
  });
}

