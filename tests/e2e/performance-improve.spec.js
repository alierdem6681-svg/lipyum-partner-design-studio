import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

function actionRow(page, id) {
  return page.locator(`[data-testid="performance-growth-action-card"][data-action-id="${id}"]`);
}

async function expectPerformanceImprovePage(page) {
  await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
  const performanceScore = page.getByTestId("performance-growth-score");
  await expect(performanceScore).toContainText("81");
  await expect(performanceScore.getByText("Sıradaki hedef: 85+")).toBeVisible();
  await expect(performanceScore.getByText("85+ seviyeye çık")).toHaveCount(0);
  await expect(performanceScore.getByText("Daha çok iş al")).toBeVisible();
  await expect(performanceScore.getByText("Daha ucuza iş al")).toBeVisible();
  await expect(page.getByText("Görev listesi")).toBeVisible();
  await expect(page.getByText("Skoru artıracak işlemler")).toHaveCount(0);
  await expect(page.getByText("Gelişim rehberi")).toHaveCount(0);
  await expect(page.getByText("Skor hedefleri")).toHaveCount(0);
  await expect(page.getByText("Puan kırılımı")).toHaveCount(0);
  await expect(page.getByTestId("performance-target-card")).toHaveCount(0);
  await expect(page.getByTestId("performance-growth-criterion-row")).toHaveCount(0);
  await expect(page.getByTestId("performance-growth-benefits")).toHaveCount(0);
  await expect(page.getByTestId("performance-score-badge")).toHaveCount(0);
  await expect(page.getByTestId("performance-rewards-button")).toBeVisible();
  await expect(page.getByTestId("performance-growth-action-card")).toHaveCount(9);
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
  await expect(page.getByTestId("home-performance-improve-button")).toContainText("Yükselt");

  await page.getByTestId("home-performance-improve-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-improve");
  await expectPerformanceImprovePage(page);
  expect(errors).toEqual([]);
});

test("performance improve page shows compact task rows and completed checks", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/performance-improve");
  await waitForApp(page);

  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByTestId("app-bottom-bar")).toHaveCount(0);
  await expectPerformanceImprovePage(page);
  await expect(page.getByText("Aboneliğini yükselt")).toBeVisible();
  await expect(page.getByText("İş sonucunu gir")).toBeVisible();
  await expect(page.getByText("İptal oranını düşür")).toBeVisible();
  await expect(page.getByText("Müşteri puanlamasını yükselt")).toBeVisible();
  await expect(page.getByText("Bakiyeni hazır tut")).toBeVisible();
  await expect(actionRow(page, "job_result")).toContainText("+4");
  await expect(actionRow(page, "profile_completion")).toBeDisabled();
  await expect(actionRow(page, "active_usage")).toBeDisabled();
  await expect(actionRow(page, "complaints")).toBeDisabled();
  expect(errors).toEqual([]);
});

test("performance improve task row opens an action sheet before navigation", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/performance-improve");
  await waitForApp(page);

  await actionRow(page, "job_result").click();
  await expect(page.getByTestId("performance-action-sheet")).toBeVisible();
  await expect(page.getByTestId("performance-action-sheet")).toContainText("+4 puan");
  await expect(page.getByTestId("performance-action-sheet")).toContainText("Ücret ve gider bilgisini gir");
  await page.getByRole("button", { name: "İşi Aç" }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/my-jobs");

  await page.goto("/#/performance-improve");
  await waitForApp(page);
  await actionRow(page, "reviews").click();
  await expect(page.getByTestId("performance-action-sheet")).toContainText("Memnun müşteriden yorum iste");

  expect(errors).toEqual([]);
});

test("performance improve rewards trophy opens badge advantage sheet", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/performance-improve");
  await waitForApp(page);

  await page.getByTestId("performance-rewards-button").click();
  const appSheet = page.getByTestId("app-sheet");
  const sheet = page.getByTestId("score-badge-advantages-sheet");
  await expect(appSheet).toBeVisible();
  await expect(appSheet).toContainText("Skor rozet avantajları");
  await expect(appSheet).toContainText("Skor yükseldikçe maliyetin düşer.");
  await expect(sheet).toBeVisible();
  await expect(page.getByTestId("score-badge-tier-card")).toHaveCount(3);
  await expect(sheet).toContainText("95+");
  await expect(sheet).toContainText("90+");
  await expect(sheet).toContainText("85+");
  await expect(sheet).toContainText("%50'ye kadar");
  await expect(sheet).toContainText("%30'a kadar");
  await expect(sheet).toContainText("%20'ye kadar");
  await expect(sheet).toContainText("x3'e kadar daha fazla iş");
  await expect(sheet).toContainText("x2'ye kadar daha fazla iş");
  await expect(page.getByTestId("score-badge-advantages-note")).toBeVisible();
  await page.getByTestId("sheet-close-button").click();
  await expect(sheet).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("performance improve renders completed score actions by default", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/performance-improve");
  await waitForApp(page);

  await expect(page.getByTestId("performance-growth-action-card")).toHaveCount(9);
  await expect(actionRow(page, "profile_completion")).toBeDisabled();
  await expect(actionRow(page, "active_usage")).toBeDisabled();
  await expect(actionRow(page, "complaints")).toBeDisabled();
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
