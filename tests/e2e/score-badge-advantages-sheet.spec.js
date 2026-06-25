import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

async function openSheet(page) {
  await page.goto(`/#/performance-improve?scoreBadgeAdvantages=1&t=${Date.now()}`);
  await waitForApp(page);
  const sheet = page.getByTestId("score-badge-advantages-sheet");
  if (await sheet.isVisible().catch(() => false)) return;
  const trigger = page.getByTestId("performance-rewards-button");
  await trigger.click();
}

test("score badge advantages premium sheet renders exact copy and closes", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await openSheet(page);

  const sheet = page.getByTestId("score-badge-advantages-sheet");
  const appSheet = page.getByTestId("app-sheet");
  await expect(sheet).toBeVisible();
  await expect(appSheet).toContainText("Skor rozet avantajları");
  await expect(appSheet).toContainText("Skor yükseldikçe maliyetin düşer.");

  await expect(page.getByTestId("score-badge-tier-card")).toHaveCount(3);
  await expect(page.getByTestId("score-badge-tier-card").nth(0)).toContainText("EFSANE");
  await expect(page.getByTestId("score-badge-tier-card").nth(0)).toContainText("95+");
  await expect(page.getByTestId("score-badge-tier-card").nth(0)).toContainText("%50'ye kadar");
  await expect(page.getByTestId("score-badge-tier-card").nth(0)).toContainText("x3'e kadar daha fazla iş");

  await expect(page.getByTestId("score-badge-tier-card").nth(1)).toContainText("GÜÇLÜ");
  await expect(page.getByTestId("score-badge-tier-card").nth(1)).toContainText("90+");
  await expect(page.getByTestId("score-badge-tier-card").nth(1)).toContainText("%30'a kadar");
  await expect(page.getByTestId("score-badge-tier-card").nth(1)).toContainText("x2'ye kadar daha fazla iş");

  await expect(page.getByTestId("score-badge-tier-card").nth(2)).toContainText("YÜKSEK");
  await expect(page.getByTestId("score-badge-tier-card").nth(2)).toContainText("85+");
  await expect(page.getByTestId("score-badge-tier-card").nth(2)).toContainText("%20'ye kadar");
  await expect(page.getByTestId("score-badge-tier-card").nth(2)).toContainText("Daha çok iş fırsatında güçlü görünüm");

  await expect(page.getByTestId("score-badge-advantages-note")).toContainText(
    "İndirim ve iş fırsatı etkisi bölge, sektör, talep yoğunluğu ve aktif çalışma davranışına göre değişebilir.",
  );

  await expectNoAppHorizontalOverflow(page);
  await page.getByTestId("sheet-close-button").click();
  await expect(sheet).toBeHidden();
  expect(errors).toEqual([]);
});

test("score badge advantages sheet is responsive and horizontally safe", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 360, height: 780 },
    { width: 393, height: 852 },
    { width: 430, height: 932 },
  ]) {
    await page.setViewportSize(viewport);
    await openSheet(page);
    await expect(page.getByTestId("score-badge-advantages-sheet")).toBeVisible();
    const overflow = await page.evaluate(() => {
      const sheet = document.querySelector('[data-testid="score-badge-advantages-sheet"]');
      if (!sheet) return true;
      return sheet.scrollWidth > sheet.clientWidth + 1;
    });
    expect(overflow).toBe(false);
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("score-badge-advantages-sheet")).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});
