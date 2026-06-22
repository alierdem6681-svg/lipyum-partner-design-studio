import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const storageKey = "lipyum.performanceScoreDemo.v1";

async function resetPerformanceState(page) {
  await page.goto("/#/home");
  await page.evaluate((key) => window.localStorage.removeItem(key), storageKey);
}

async function fillJobResultForm(page) {
  await page.getByTestId("job-total-fee").fill("2450");
  await page.getByTestId("job-travel-fee").fill("150");
  await page.getByTestId("job-labor-fee").fill("1200");
  await page.getByTestId("job-material-fee").fill("1100");
  await page.getByTestId("job-result-description").fill("Arıza giderildi. Parça değiştirildi.");
  await page.getByTestId("job-before-photo").click();
  await page.getByTestId("job-after-photo").click();
  await page.getByTestId("job-customer-approval").click();
}

test("performance score flow updates score once and persists after refresh", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await resetPerformanceState(page);
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/#/performance-score");
  await waitForApp(page);

  await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
  await expect(page.getByTestId("performance-score-card")).toContainText("81,7");
  await expect(page.getByTestId("performance-score-card")).toContainText("Hedef 85");
  await expect(page.getByTestId("performance-score-card")).toContainText("3,3 puan kaldı");
  await expect(page.getByTestId("performance-now-card")).toContainText("Son işin bilgilerini gir");

  await page.getByTestId("performance-main-task-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-score/task/job-result");
  await expect(page.getByTestId("performance-task-page")).toBeVisible();
  await expect(page.getByTestId("job-submit")).toBeDisabled();

  await fillJobResultForm(page);
  await expect(page.getByTestId("job-submit")).toBeEnabled();
  await page.getByTestId("job-submit").click();

  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-score/success");
  await expect(page.getByTestId("performance-success-page")).toBeVisible();
  await expect(page.getByTestId("performance-success-page")).toContainText("+0,2 puan");
  await expect(page.getByTestId("performance-success-score")).toContainText("81,7 → 81,9");
  await expect(page.getByTestId("performance-success-score")).toContainText("3,1 puan kaldı");

  await page.goto("/#/performance-score/task/job-result");
  await fillJobResultForm(page);
  await page.getByTestId("job-submit").click();
  await expect(page.getByTestId("performance-success-score")).toContainText("81,7 → 81,9");

  await page.reload();
  await waitForApp(page);
  await expect(page.getByTestId("performance-success-score")).toContainText("81,9");
  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test("performance tasks, details and back routes work", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await resetPerformanceState(page);
  await page.goto("/#/performance-score");
  await waitForApp(page);

  await page.getByText("Tüm görevleri gör").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-score/tasks");
  await expect(page.getByTestId("performance-tasks-page")).toBeVisible();
  await expect(page.getByTestId("performance-task-row")).toHaveCount(3);

  await page.getByTestId("back-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-score");

  await page.getByText("Puanın nasıl hesaplanır?").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-score/details");
  await expect(page.getByTestId("performance-details-page")).toBeVisible();
  await expect(page.getByTestId("performance-detail-category")).toHaveCount(6);
  await page.getByText("İş sonucu ve mali şeffaflık").click();
  await expect(page.getByTestId("performance-details-page")).toContainText("Garanti belgesi");

  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

for (const viewport of [
  { width: 320, height: 568 },
  { width: 360, height: 780 },
  { width: 393, height: 852 },
  { width: 430, height: 932 },
]) {
  test(`performance flow has no horizontal overflow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await resetPerformanceState(page);
    await page.setViewportSize(viewport);
    await page.goto("/#/performance-score");
    await waitForApp(page);
    await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
    await expect(page.getByTestId("performance-main-task-button")).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}
