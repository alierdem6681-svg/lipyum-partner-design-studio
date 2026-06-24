import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

test("home performance CTA opens the improvement center", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/#/home");
  await waitForApp(page);

  const performanceCard = page.getByTestId("home-performance-card");
  await expect(performanceCard.getByText("Nedir?")).toHaveCount(0);
  await expect(page.getByTestId("home-performance-improve-button")).toContainText("Performansımı Artır");

  await page.getByTestId("home-performance-improve-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-improve");
  await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test("performance improvement page shows score, actions, criteria and safe benefits", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/#/performance-improve");
  await waitForApp(page);

  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByTestId("app-bottom-bar")).toBeVisible();
  await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
  await expect(page.getByTestId("performance-score-card")).toContainText("81");
  await expect(page.getByTestId("performance-score-card")).toContainText("4 puan kaldı");
  await expect(page.getByTestId("performance-priority-card")).toHaveCount(3);
  await expect(page.getByTestId("performance-criterion-row")).toHaveCount(8);
  await expect(page.getByTestId("performance-criteria-section")).toContainText("Bakiye durumu");
  await expect(page.getByTestId("performance-criteria-section")).toContainText("Abonelik durumu");
  await expect(page.getByTestId("performance-criteria-section")).toContainText("5 / 5");
  await expect(page.getByTestId("performance-benefits-card")).toContainText("İş sayısı bölge, sektör ve talebe göre değişebilir.");
  await expect(page.getByText("Kesin daha fazla iş alırsın")).toHaveCount(0);

  await page.getByTestId("performance-action-more_reviews").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/reviews");

  await page.goto("/#/performance-improve");
  await waitForApp(page);
  await page.getByTestId("performance-action-faster_response").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/notification-settings");

  await page.goto("/#/performance-improve");
  await waitForApp(page);
  await page.getByTestId("performance-action-ready_balance").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/wallet");

  expect(errors).toEqual([]);
});

for (const viewport of [
  { width: 320, height: 568 },
  { width: 360, height: 780 },
  { width: 393, height: 852 },
  { width: 430, height: 932 },
]) {
  test(`performance improvement page has no horizontal overflow at ${viewport.width}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.setViewportSize(viewport);
    await page.goto("/#/performance-improve");
    await waitForApp(page);

    await expect(page.getByTestId("performance-score-card")).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}

for (const route of [
  "/performance-score/task/job-result",
  "/performance-score/tasks",
  "/performance-score/details",
  "/performance-score/success",
]) {
  test(`retired performance route redirects to performance score page: ${route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await waitForApp(page);

    await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-score");
    await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}
