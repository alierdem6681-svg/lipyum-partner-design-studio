import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const criteria = [
  "profile",
  "reviews",
  "complaints",
  "response",
  "cancel",
  "activity",
  "wallet",
  "subscription",
];

test("home performance card opens the improve roadmap", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  const card = page.getByTestId("home-performance-card");
  await expect(card).toBeVisible();
  await expect(card.getByText("Nedir?")).toHaveCount(0);
  await expect(page.getByTestId("home-performance-milestones")).toContainText("85");
  await expect(page.getByTestId("home-performance-milestones")).toContainText("90");
  await expect(page.getByTestId("home-performance-milestones")).toContainText("95");
  await expect(page.getByTestId("home-performance-milestones")).toContainText("İyi");
  await expect(page.getByTestId("home-performance-milestones")).toContainText("Çok iyi");
  await expect(page.getByTestId("home-performance-milestones")).toContainText("Mükemmel");
  await expect(page.getByTestId("home-performance-improve-button")).toBeVisible();
  await expect(page.getByTestId("home-performance-improve-button")).toContainText("Performansımı Artır");

  await page.getByTestId("home-performance-improve-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-improve");
  await expect(page.getByTestId("performance-improve-page")).toBeVisible();
  expect(errors).toEqual([]);
});

test("performance improve page explains all scoring criteria", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/#/performance-improve");
  await waitForApp(page);

  const pageRoot = page.getByTestId("performance-improve-page");
  await expect(pageRoot).toContainText("81 / 100");
  await expect(pageRoot).toContainText("İyi");
  await expect(pageRoot).toContainText("Hedef: 85");
  await expect(pageRoot).toContainText("85 puana ulaştığında sana uygun işlerde daha güçlü görünürsün.");
  await expect(pageRoot).toContainText("Skorun; profil kaliten, müşteri deneyimi, aktiflik, bakiye ve abonelik durumuna göre hesaplanır.");

  await expect(page.locator('[data-testid^="performance-criterion-"]')).toHaveCount(8);
  for (const id of criteria) {
    const card = page.getByTestId(`performance-criterion-${id}`);
    await expect(card).toBeVisible();
    await expect(card).toContainText("Mevcut");
    await expect(card).toContainText("Hedef");
    await expect(card).toContainText("Skora katkı:");
    await expect(card).toContainText(/Tamamlandı|Geliştirilebilir|Eksik/);
  }

  await expect(page.getByTestId("performance-criterion-wallet")).toContainText("Bakiyenin bitmesi");
  await expect(page.getByTestId("performance-criterion-subscription")).toContainText("Ücretli abonelikler");
  await expect(page.getByTestId("performance-benefits")).toContainText("Yüksek performans skoru, uygun işlerde öncelikli değerlendirilmeni destekler.");
  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

for (const viewport of [
  { width: 393, height: 852 },
  { width: 430, height: 932 },
]) {
  test(`performance improve remains stable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.setViewportSize(viewport);
    await page.goto("/#/performance-improve");
    await waitForApp(page);
    await expect(page.getByTestId("app-header")).toBeVisible();
    await expect(page.getByTestId("app-bottom-bar")).toBeVisible();
    await expect(page.getByTestId("performance-improve-page")).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}
