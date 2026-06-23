import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

async function resetWallet(page) {
  await page.evaluate(() => {
    window.localStorage.removeItem("lipyum.partner.wallet");
  });
}

test("wallet main, top-up, success, history and settings flow works", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/wallet");
  await resetWallet(page);
  await page.reload();
  await waitForApp(page);

  await expect(page.getByTestId("wallet-page")).toBeVisible();
  await expect(page.getByTestId("wallet-work-balance-card")).toContainText("İŞ BAKİYESİ");
  await expect(page.getByTestId("wallet-work-balance-card")).toContainText("₺675");
  await expect(page.getByTestId("wallet-bonus-balance-card")).toContainText("BONUS BAKİYESİ");
  await expect(page.getByTestId("wallet-bonus-balance-card")).toContainText("₺240");
  await expect(page.getByText("İş Bakiyesi + Bonus Bakiyesi")).toHaveCount(0);
  await page.getByTestId("wallet-info-button").click();
  await expect(page.getByTestId("app-sheet")).toContainText("Bonus bakiyesi");
  await page.getByTestId("sheet-close-button").click();

  await page.getByTestId("wallet-top-up-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/wallet/top-up");
  await expect(page.getByTestId("wallet-top-up-page")).toBeVisible();
  await page.getByTestId("wallet-top-up-amount").filter({ hasText: "₺500" }).click();
  await expect(page.getByTestId("wallet-bonus-toggle")).toHaveAttribute("aria-checked", "true");
  await expect(page.getByTestId("wallet-payment-summary")).toContainText("₺500");
  await expect(page.getByTestId("wallet-payment-summary")).toContainText("-₺120");
  await expect(page.getByTestId("wallet-payment-summary")).toContainText("₺380");
  await expect(page.getByTestId("wallet-top-up-submit")).toContainText("₺380 ÖDE");
  await expect(page.getByTestId("wallet-top-up-submit")).toContainText("₺500 BAKİYE YÜKLE");
  await page.getByTestId("wallet-top-up-submit").click();

  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/wallet/top-up/success");
  await expect(page.getByTestId("wallet-top-up-success-page")).toContainText("₺1.175");
  await expect(page.getByTestId("wallet-top-up-success-page")).toContainText("₺120");
  await page.getByRole("button", { name: "Cüzdana dön" }).click();

  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#/wallet");
  await expect(page.getByTestId("wallet-work-balance-card")).toContainText("₺1.175");
  await expect(page.getByTestId("wallet-bonus-balance-card")).toContainText("₺120");

  await page.getByRole("button", { name: "Tümünü gör" }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/wallet/history");
  await expect(page.getByTestId("wallet-history-page")).toBeVisible();
  await page.getByRole("tab", { name: "Yüklemeler" }).click();
  await expect(page.getByTestId("wallet-transaction-row").first()).toContainText("Bakiye yükleme");
  await page.getByTestId("wallet-transaction-row").first().getByRole("button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/wallet/transaction/");
  await expect(page.getByTestId("app-header")).toContainText("İşlem Detayı");
  await expect(page.getByTestId("wallet-transaction-detail-page")).toContainText("İşlem tutarı");

  await page.goto("/#/wallet/settings");
  await waitForApp(page);
  await expect(page.getByTestId("wallet-settings-page")).toBeVisible();
  await expect(page.getByTestId("wallet-low-balance-alert")).toContainText("Düşük Bakiye Uyarısı");
  await expect(page.getByTestId("wallet-auto-top-up")).toContainText("Kapalı");
  await page.getByTestId("wallet-auto-top-up").getByRole("switch").click();
  await expect(page.getByTestId("wallet-auto-top-up").getByRole("switch")).toHaveAttribute("aria-checked", "true");
  await expect(page.getByTestId("wallet-bonus-expiry-card")).toContainText("Bekleyen bonus");

  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test("wallet responsive matrix has no horizontal overflow", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 360, height: 780 },
    { width: 393, height: 852 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/#/wallet");
    await waitForApp(page);
    await expectNoAppHorizontalOverflow(page);
    await expect(page.getByTestId("wallet-work-balance-card")).toBeVisible();
  }
  expect(errors).toEqual([]);
});
