import { expect, test } from "@playwright/test";
import { expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const storageKey = "lipyum.subscription.directPurchase.v2";
const freeRoute = "#/subscription?subscriptionState=free";

const forbiddenClasses = [
  ".subscription-free-card",
  ".subscription-hero-direct",
  ".subscription-section-head",
  ".subscription-billing-toggle",
  ".subscription-plan-selector",
  ".subscription-plan-option",
  ".subscription-selected-card",
  ".subscription-value-strip",
  ".subscription-social-proof",
  ".subscription-reason-card",
  ".subscription-faq-card",
  ".subscription-sticky-cta",
  ".subscription-flow",
];

const forbiddenTexts = [
  "Mevcut planın",
  "Daha güçlü görün.",
  "Daha hızlı destek al.",
  "Daha çok fırsat yakala.",
  "Sana en uygun plan",
  "Tüm planları karşılaştır",
  "Partnerler Gold'u tercih ediyor",
  "Bu plan neden sana uygun?",
  "Güvenli ve şeffaf",
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript((key) => window.localStorage.removeItem(key), storageKey);
});

test("free paywall renders only the reset shell", async ({ page }) => {
  await page.goto(freeRoute);
  await waitForApp(page);

  await expect(page.getByTestId("subscription-free-state")).toBeVisible();
  await expect(page.getByTestId("subscription-reset-shell")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Abonelik ekranı temizlendi" })).toBeVisible();
  await expect(page.getByText("Yeni mobil abonelik tasarımı temiz başlangıç üzerinden kurulacak.")).toBeVisible();

  for (const text of forbiddenTexts) {
    await expect(page.getByTestId("subscription-free-state").getByText(text, { exact: false })).toHaveCount(0);
  }

  for (const selector of forbiddenClasses) {
    await expect(page.locator(`[data-testid="subscription-free-state"] ${selector}`)).toHaveCount(0);
  }

  const bodyText = await page.getByTestId("subscription-free-state").innerText();
  expect(bodyText.toLocaleLowerCase("tr-TR")).not.toMatch(/trial|free trial|ücretsiz deneme|ücretsiz dene|deneme süresi/);
  await expectNoAppHorizontalOverflow(page);
});

for (const viewport of [
  { width: 320, height: 568 },
  { width: 360, height: 780 },
  { width: 393, height: 852 },
  { width: 430, height: 932 },
]) {
  test(`free paywall reset shell has no horizontal overflow at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto(freeRoute);
    await waitForApp(page);

    await expect(page.getByTestId("subscription-reset-shell")).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
  });
}
