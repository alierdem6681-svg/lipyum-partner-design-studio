import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const storageKey = "lipyum.performanceScore.tasks.v1";

async function resetPerformanceDemo(page) {
  await page.addInitScript((key) => window.localStorage.removeItem(key), storageKey);
}

test("home performance card opens the gamified performance score page", async ({ page }) => {
  await resetPerformanceDemo(page);
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  const card = page.getByTestId("home-performance-card");
  await expect(card).toBeVisible();
  await expect(card.getByText("Nedir?")).toHaveCount(0);
  await expect(page.getByTestId("home-performance-improve-button")).toContainText("Performansımı Artır");

  await page.getByTestId("home-performance-improve-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-score");
  await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
  await expect(page.getByTestId("performance-score-card")).toContainText("81,0");
  await expect(page.getByTestId("performance-main-task-button")).toBeVisible();
  expect(errors).toEqual([]);
});

test("old performance improve URL redirects to the performance score page", async ({ page }) => {
  await resetPerformanceDemo(page);
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/performance-improve");
  await waitForApp(page);

  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-score");
  await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
  await expect(page.getByTestId("performance-now-card")).toBeVisible();
  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

for (const viewport of [
  { width: 393, height: 852 },
  { width: 430, height: 932 },
]) {
  test(`performance score flow remains stable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await resetPerformanceDemo(page);
    const errors = await collectConsoleErrors(page);
    await page.setViewportSize(viewport);
    await page.goto("/#/performance-score");
    await waitForApp(page);
    await expect(page.getByTestId("app-header")).toBeVisible();
    await expect(page.getByTestId("app-bottom-bar")).toBeVisible();
    await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
    await expect(page.getByTestId("performance-score-card")).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}
