import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

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
  await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
  expect(errors).toEqual([]);
});

test("performance improve page shows score, actions, criteria and benefits", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
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
  await expect(page.getByTestId("performance-benefits-card")).toContainText("Yüksek performans skoru");
  await expect(page.getByText("Kesin daha fazla iş alırsın")).toHaveCount(0);
  await expectNoAppHorizontalOverflow(page);
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

    await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();
    await expect(page.getByTestId("performance-priority-card")).toHaveCount(3);
    await expect(page.getByTestId("performance-criterion-row")).toHaveCount(8);
    await expectNoAppHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}
