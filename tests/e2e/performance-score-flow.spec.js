import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

test("performance score page is an empty reset surface", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/#/performance-score");
  await waitForApp(page);

  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByTestId("app-bottom-bar")).toBeVisible();
  await expect(page.getByTestId("performance-score-empty-page")).toBeVisible();
  await expect(page.locator("[data-testid='performance-score-card']")).toHaveCount(0);
  await expect(page.locator("[data-testid='performance-now-card']")).toHaveCount(0);
  await expect(page.locator("[data-testid='performance-main-task-button']")).toHaveCount(0);
  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

for (const route of [
  "/performance-score/task/job-result",
  "/performance-score/tasks",
  "/performance-score/details",
  "/performance-score/success",
]) {
  test(`retired performance route redirects to empty page: ${route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await waitForApp(page);

    await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-score");
    await expect(page.getByTestId("performance-score-empty-page")).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}
