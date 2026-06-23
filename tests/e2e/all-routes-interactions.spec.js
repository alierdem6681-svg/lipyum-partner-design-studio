import { expect, test } from "@playwright/test";
import { bottomBarHiddenRoutes, collectConsoleErrors, criticalRoutes, waitForApp } from "./helpers.js";

test("V10 sampled interaction on every critical route does not break routing", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  for (const route of criticalRoutes) {
    await page.goto(`/#${route}`);
    await waitForApp(page);
    await expect(page.getByTestId("app-header")).toBeVisible();

    const infoButton = page.getByTestId("header-info-button");
    if (await infoButton.count()) {
      await infoButton.first().click();
      const feedback = page.locator("#toast, [data-testid='app-sheet']");
      await expect(feedback.first()).toBeVisible();
    }

    if (bottomBarHiddenRoutes.has(route)) {
      await expect(page.getByTestId("app-bottom-bar")).toHaveCount(0);
    } else {
      await expect(page.getByTestId("bottom-tab-home")).toBeVisible();
    }
  }

  expect(errors).toEqual([]);
});
