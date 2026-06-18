import { expect, test } from "@playwright/test";

const coreRoutes = ["/home", "/jobs", "/my-jobs", "/calendar"];

for (const route of coreRoutes) {
  test(`V12 visual smoke ${route}`, async ({ page }) => {
    await page.goto(`/?engine=vue#${route}`);
    await expect(page.locator("[data-testid='app-header']")).toBeVisible();
    await expect(page.locator("[data-testid='app-bottom-bar']")).toBeVisible();
    await expect(page).toHaveScreenshot(`v12-${route.replace("/", "").replace(/\//g, "__")}-393x852.png`, {
      animations: "disabled",
      maxDiffPixelRatio: 0.01,
    });
  });
}
