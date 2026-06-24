import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

async function expectBlankPerformancePage(page) {
  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByTestId("app-bottom-bar")).toBeVisible();
  await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
  await expect(page.getByTestId("performance-score-card")).toHaveCount(0);
  await expect(page.getByTestId("performance-priority-card")).toHaveCount(0);
  await expect(page.getByTestId("performance-criterion-row")).toHaveCount(0);
  await expect(page.getByTestId("performance-benefits-card")).toHaveCount(0);
  await expect(page.getByText("Gelişim merkezi")).toHaveCount(0);
  await expect(page.getByText("Öncelikli 3 hamle")).toHaveCount(0);
  await expect(page.getByText("Performans alanları")).toHaveCount(0);
  await expectNoAppHorizontalOverflow(page);
}

test("home performance CTA opens the blank performance improve page", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/#/home");
  await waitForApp(page);

  const performanceCard = page.getByTestId("home-performance-card");
  await expect(performanceCard.getByText("Nedir?")).toHaveCount(0);
  await expect(page.getByTestId("home-performance-improve-button")).toContainText("Performansımı Artır");

  await page.getByTestId("home-performance-improve-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-improve");
  await expectBlankPerformancePage(page);
  expect(errors).toEqual([]);
});

test("performance improve page is reset to a blank starting point", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/#/performance-improve");
  await waitForApp(page);

  await expectBlankPerformancePage(page);
  expect(errors).toEqual([]);
});

for (const viewport of [
  { width: 320, height: 568 },
  { width: 360, height: 780 },
  { width: 393, height: 852 },
  { width: 430, height: 932 },
]) {
  test(`blank performance improve page has no horizontal overflow at ${viewport.width}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.setViewportSize(viewport);
    await page.goto("/#/performance-improve");
    await waitForApp(page);

    await expectBlankPerformancePage(page);
    expect(errors).toEqual([]);
  });
}

for (const route of [
  "/performance-score/task/job-result",
  "/performance-score/tasks",
  "/performance-score/details",
  "/performance-score/success",
]) {
  test(`retired performance route redirects to blank performance page: ${route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await waitForApp(page);

    await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-score");
    await expectBlankPerformancePage(page);
    expect(errors).toEqual([]);
  });
}
