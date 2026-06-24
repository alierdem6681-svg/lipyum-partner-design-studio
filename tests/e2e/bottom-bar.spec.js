import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

const tabCases = [
  ["bottom-tab-home", "/home"],
  ["bottom-tab-jobs", "/my-jobs"],
  ["bottom-tab-calendar", "/calendar"],
  ["bottom-tab-wallet", "/wallet"],
  ["bottom-cta-job", "/jobs"],
];

for (const [testId, expectedRoute] of tabCases) {
  test(`bottom bar ${testId} navigates to ${expectedRoute}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto("/#/home");
    await waitForApp(page);

    await expect(page.getByTestId("app-bottom-bar").first()).toBeVisible();
    await page.getByTestId(testId).click();
    await expect.poll(() => page.evaluate(() => window.location.hash)).toContain(expectedRoute);

    expect(errors).toEqual([]);
  });
}

test("bottom bar keeps a single active nav item", async ({ page }) => {
  await page.goto("/#/wallet");
  await waitForApp(page);
  await expect(page.locator('[data-testid="app-bottom-bar"]').first().locator("[aria-current='page']")).toHaveCount(1);
});
