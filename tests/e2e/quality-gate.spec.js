import { expect, test } from "@playwright/test";
import { collectConsoleErrors, ctaHiddenRoutes, expectNoAppHorizontalOverflow, routes, waitForApp } from "./helpers.js";

for (const route of routes) {
  test(`quality gate smoke ${route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await waitForApp(page);

    await expect(page.getByTestId("app-header").first()).toBeVisible();
    await expect(page.getByTestId("app-bottom-bar").first()).toBeVisible();
    if (!ctaHiddenRoutes.has(route)) {
      await expect(page.getByTestId("bottom-cta-job")).toBeVisible();
    }
    await expectNoAppHorizontalOverflow(page);

    const wrappedBottomLabels = await page.locator('[data-testid="app-bottom-bar"] .bottom-item > span').evaluateAll((labels) => (
      labels.filter((label) => label.getClientRects().length > 1).length
    ));
    expect(wrappedBottomLabels).toBe(0);
    expect(errors).toEqual([]);
  });
}
