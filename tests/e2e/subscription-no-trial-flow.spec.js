import { expect, test } from "@playwright/test";
import { expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const storageKey = "lipyum.subscription.directPurchase.v2";

async function resetSubscription(page) {
  await page.addInitScript((key) => window.localStorage.removeItem(key), storageKey);
}

test.describe("subscription direct purchase flow", () => {
  test.beforeEach(async ({ page }) => {
    await resetSubscription(page);
  });

  test("free state is reset and has no demo offer", async ({ page }) => {
    await page.goto("#/subscription");
    await waitForApp(page);

    await expect(page.getByTestId("subscription-free-state")).toBeVisible();
    await expect(page.getByTestId("subscription-reset-shell")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Abonelik ekranı temizlendi" })).toBeVisible();
    await expect(page.getByText("Yeni mobil abonelik tasarımı temiz başlangıç üzerinden kurulacak.")).toBeVisible();
    await expect(page.getByText(/deneme|ücretsiz dene|30 gün/i)).toHaveCount(0);
    await expect(page.getByTestId("subscription-plan-gold")).toHaveCount(0);
    await expect(page.getByTestId("selected-plan-card")).toHaveCount(0);
    await expect(page.getByTestId("subscription-sticky-cta")).toHaveCount(0);
    await expectNoAppHorizontalOverflow(page);
  });

  test("comparison and checkout allow direct plan selection", async ({ page }) => {
    await page.goto("#/subscription/compare");
    await waitForApp(page);

    await expect(page.getByTestId("subscription-compare-page")).toBeVisible();
    await expect(page.getByTestId("compare-plan-gold")).toBeVisible();
    await expect(page.getByTestId("compare-plan-plus")).toBeVisible();
    await expect(page.getByTestId("compare-plan-vip")).toBeVisible();

    await page.getByTestId("compare-select-vip").click();
    await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/subscription/checkout");
    await expect(page.getByTestId("subscription-checkout-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Lipyum VIP" })).toBeVisible();
    await expect(page.getByTestId("subscription-checkout-page").getByText("Bugün ödenecek")).toBeVisible();
    await expect(page.getByTestId("subscription-checkout-page").getByText("3.486 TL", { exact: true })).toBeVisible();
    await expect(page.getByText("Ödeme sonrası hemen aktif").first()).toBeVisible();
    await expect(page.getByText("Her ay aynı tarihte otomatik yenilenir")).toBeVisible();

    await page.getByTestId("confirm-purchase").click();
    await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/subscription");
    await expect(page.getByTestId("subscription-active-state")).toBeVisible();
    await expect(page.getByTestId("active-subscription-card")).toContainText("Lipyum VIP");
    await expect(page.getByTestId("manage-subscription")).toBeVisible();
  });

  test("active, canceled, payment issue, expired and restore states work", async ({ page }) => {
    await page.goto("#/subscription?subscriptionState=active&plan=plus");
    await waitForApp(page);
    await expect(page.getByTestId("subscription-active-state")).toBeVisible();
    await expect(page.getByTestId("restore-purchases")).toBeVisible();
    await page.getByTestId("subscription-plan-gold").click();
    await expect(page.getByTestId("plan-change-card")).toBeVisible();
    await page.getByTestId("change-plan-cta").click();
    await expect(page.getByTestId("active-subscription-card")).toContainText("Lipyum Gold");

    await page.goto("#/subscription?subscriptionState=canceled&plan=plus");
    await expect(page.getByTestId("subscription-canceled-state")).toBeVisible();
    await page.getByTestId("reactivate-subscription").click();
    await expect(page.getByTestId("subscription-active-state")).toBeVisible();

    await page.goto("#/subscription?subscriptionState=payment-issue&plan=plus");
    await expect(page.getByTestId("subscription-payment-issue-state")).toBeVisible();
    await page.getByTestId("resolve-payment-issue").click();
    await expect(page.getByTestId("subscription-active-state")).toBeVisible();

    await page.goto("#/subscription?subscriptionState=expired");
    await expect(page.getByTestId("subscription-expired-state")).toBeVisible();
    await expect(page.getByTestId("return-to-plus")).toBeVisible();
  });

  test("customer service route stays available after content reset", async ({ page }) => {
    await page.goto("#/subscription?subscriptionState=active&plan=vip");
    await waitForApp(page);
    await expect(page.getByTestId("subscription-active-state")).toBeVisible();
    await expect(page.getByTestId("active-subscription-card")).toContainText("Lipyum VIP");
    await page.evaluate(() => {
      window.location.hash = "/support/customer-service";
    });
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#/support/customer-service");
    await expect(page.getByTestId("customer-service-page")).toBeVisible();
    await expect(page.getByText("Mevcut destek seviyen: telefon ve öncelikli destek.")).toHaveCount(0);
    await expect(page.getByText("Telefon ve öncelikli destek hakkın aktif.")).toHaveCount(0);
  });

  for (const viewport of [
    { width: 320, height: 568 },
    { width: 360, height: 780 },
    { width: 393, height: 852 },
    { width: 430, height: 932 },
  ]) {
    test(`subscription page has no horizontal overflow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("#/subscription");
      await waitForApp(page);
      await expect(page.getByTestId("subscription-reset-shell")).toBeVisible();
      await expectNoAppHorizontalOverflow(page);
    });
  }
});
