import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

async function expectPerformanceImprovePage(page) {
  await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
  await expect(page.getByTestId("performance-growth-score")).toContainText("81");
  await expect(page.getByTestId("performance-target-card")).toHaveCount(3);
  await expect(page.getByTestId("performance-growth-action-card")).toHaveCount(3);
  await expect(page.getByTestId("performance-growth-criterion-row")).toHaveCount(8);
  await expect(page.getByTestId("performance-growth-benefits")).toContainText("İş sayısı bölge, sektör ve talebe göre değişebilir.");
  await expect(page.getByText("Kesin daha fazla iş alırsın")).toHaveCount(0);
  await expectNoAppHorizontalOverflow(page);
}

test("home performance card opens performance improve page", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  const card = page.getByTestId("home-performance-card");
  await expect(card).toBeVisible();
  await expect(card.getByText("Nedir?")).toHaveCount(0);
  await expect(page.getByTestId("home-performance-improve-button")).toContainText("Performansımı Artır");

  await page.getByTestId("home-performance-improve-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-improve");
  await expectPerformanceImprovePage(page);
  expect(errors).toEqual([]);
});

test("performance improve page explains score, targets, actions and criteria", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/performance-improve");
  await waitForApp(page);

  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByTestId("app-bottom-bar")).toBeVisible();
  await expectPerformanceImprovePage(page);
  const targets = page.getByTestId("performance-target-card");
  await expect(targets.nth(0)).toContainText("85+");
  await expect(targets.nth(1)).toContainText("90+");
  await expect(targets.nth(2)).toContainText("95+");
  await expect(page.getByText("Bakiye durumu")).toBeVisible();
  await expect(page.getByText("Abonelik durumu", { exact: true })).toBeVisible();
  await expect(page.getByText("5 / 5 puan")).toBeVisible();
  expect(errors).toEqual([]);
});

test("performance improve action buttons navigate to real routes", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/performance-improve");
  await waitForApp(page);

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
  test(`performance improve page remains stable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.setViewportSize(viewport);
    await page.goto("/#/performance-improve");
    await waitForApp(page);

    await expectPerformanceImprovePage(page);
    expect(errors).toEqual([]);
  });
}
