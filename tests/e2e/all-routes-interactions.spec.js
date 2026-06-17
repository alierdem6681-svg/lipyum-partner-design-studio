import { expect, test } from "@playwright/test";
import { collectConsoleErrors, criticalRoutes, waitForApp } from "./helpers.js";

test("V10 sampled interaction on every critical route does not break routing", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  for (const route of criticalRoutes) {
    await page.goto(`/#${route}`);
    await waitForApp(page);
    await expect(page.getByTestId("app-header")).toBeVisible();

    const infoButton = page.getByTestId("header-info-button");
    if (await infoButton.count()) {
      await infoButton.first().click();
      await expect(page.locator("#toast")).toBeVisible();
    }

    await expect(page.getByTestId("bottom-tab-home")).toBeVisible();
  }

  expect(errors).toEqual([]);
});
