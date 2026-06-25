import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

async function expectPerformanceImprovePage(page) {
  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByTestId("app-bottom-bar")).toBeVisible();
  await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
  await expect(page.getByTestId("performance-growth-score")).toContainText("81");
  await expect(page.getByTestId("performance-target-card")).toHaveCount(3);
  await expect(page.getByTestId("performance-growth-action-card")).toHaveCount(3);
  await expect(page.getByTestId("performance-growth-criterion-row")).toHaveCount(8);
  await expect(page.getByTestId("performance-growth-benefits")).toContainText("Yüksek performans skoru");
  await expect(page.getByText("Kesin daha fazla iş alırsın")).toHaveCount(0);
  await expectNoAppHorizontalOverflow(page);
}

test("home performance CTA opens the performance improve page", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/#/home");
  await waitForApp(page);

  const performanceCard = page.getByTestId("home-performance-card");
  await expect(performanceCard.getByText("Nedir?")).toHaveCount(0);
  await expect(page.getByTestId("home-performance-improve-button")).toContainText("Performansımı Artır");

  await page.getByTestId("home-performance-improve-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-improve");
  await expectPerformanceImprovePage(page);
  expect(errors).toEqual([]);
});

test("performance improve page supports the required criteria and targets", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/#/performance-improve");
  await waitForApp(page);

  await expectPerformanceImprovePage(page);
  await expect(page.getByText("Profil eksiksizliği")).toBeVisible();
  await expect(page.getByText("Müşteri yorumları")).toBeVisible();
  await expect(page.getByText("Müşteri şikayetleri")).toBeVisible();
  await expect(page.getByText("Müşteriye hızlı dönüş")).toBeVisible();
  await expect(page.getByText("İptal oranı")).toBeVisible();
  await expect(page.getByText("Aktif kullanım")).toBeVisible();
  await expect(page.getByText("Bakiye durumu")).toBeVisible();
  await expect(page.getByText("Abonelik durumu", { exact: true })).toBeVisible();
  await expect(page.getByText("5 / 5 puan")).toBeVisible();
  expect(errors).toEqual([]);
});

for (const viewport of [
  { width: 320, height: 568 },
  { width: 360, height: 780 },
  { width: 393, height: 852 },
  { width: 430, height: 932 },
]) {
  test(`performance improve page has no horizontal overflow at ${viewport.width}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.setViewportSize(viewport);
    await page.goto("/#/performance-improve");
    await waitForApp(page);

    await expectPerformanceImprovePage(page);
    expect(errors).toEqual([]);
  });
}

for (const route of [
  "/performance-score/task/job-result",
  "/performance-score/tasks",
  "/performance-score/details",
  "/performance-score/success",
]) {
  test(`retired performance route redirects to performance improve page: ${route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await waitForApp(page);

    await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-score");
    await expectPerformanceImprovePage(page);
    expect(errors).toEqual([]);
  });
}
