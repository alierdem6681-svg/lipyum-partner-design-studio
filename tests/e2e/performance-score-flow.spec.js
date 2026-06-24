import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const storageKey = "lipyum.performanceScore.tasks.v1";

async function resetPerformanceDemo(page) {
  await page.addInitScript((key) => {
    if (window.sessionStorage.getItem("performanceDemoResetDone")) return;
    window.localStorage.removeItem(key);
    window.sessionStorage.setItem("performanceDemoResetDone", "true");
  }, storageKey);
}

test("performance score page guides users through score tasks", async ({ page }) => {
  await resetPerformanceDemo(page);
  const errors = await collectConsoleErrors(page);
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/#/performance-score");
  await waitForApp(page);

  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByTestId("app-bottom-bar")).toBeVisible();
  await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
  await expect(page.getByTestId("performance-score-card")).toContainText("81,0");
  await expect(page.getByTestId("performance-now-card")).toContainText("Şimdi yap");
  await expect(page.getByTestId("performance-now-card")).toContainText("Son işin bilgilerini gir");
  await expect(page.getByTestId("performance-task-card")).toHaveCount(5);
  await expect(page.getByTestId("performance-task-detail")).toBeVisible();

  await page.getByTestId("performance-main-task-button").click();
  await expect(page.getByTestId("performance-score-feedback")).toContainText("82,2");
  await expect(page.getByTestId("performance-task-done")).toHaveCount(1);
  await expect(page.getByTestId("performance-score-card")).toContainText("82,2");

  await page.reload();
  await waitForApp(page);
  await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
  await expect(page.getByTestId("performance-score-card")).toContainText("82,2");
  await expect(page.getByTestId("performance-task-done")).toHaveCount(1);
  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

for (const route of [
  "/performance-score/task/job-result",
  "/performance-score/tasks",
  "/performance-score/details",
  "/performance-score/success",
]) {
  test(`retired performance route redirects to task page: ${route}`, async ({ page }) => {
    await resetPerformanceDemo(page);
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await waitForApp(page);

    await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-score");
    await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
    await expect(page.getByTestId("performance-now-card")).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}
