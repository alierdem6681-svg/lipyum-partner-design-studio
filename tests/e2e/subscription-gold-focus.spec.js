import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

async function resetSubscription(page) {
  await page.evaluate(() => {
    window.localStorage.removeItem("lipyum.subscription.directPurchase.v2");
  });
}

test("subscription Gold focus mobile paywall is selectable and routes to checkout", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/subscription");
  await resetSubscription(page);
  await page.reload();
  await waitForApp(page);

  await expect(page.getByTestId("subscription-page")).toBeVisible();
  await expect(page.getByTestId("subscription-gold-focus-view")).toBeVisible();
  await expect(page.getByTestId("subscription-gold-focus-hero")).toContainText("Daha güçlü görün");
  await expect(page.getByTestId("subscription-gold-focus-hero")).toContainText("Daha çok fırsat yakala");
  await expect(page.getByTestId("subscription-gold-focus-hero")).not.toContainText("Daha hızlı destek al");
  await expect(page.getByTestId("subscription-plan-row-plus")).toContainText("900 TL / ay");
  await expect(page.getByTestId("subscription-plan-row-gold")).toContainText("ÖNERİLEN");
  await expect(page.getByTestId("subscription-plan-row-gold")).toContainText("2.025 TL / ay");
  await expect(page.getByTestId("subscription-plan-row-vip")).toContainText("3.600 TL / ay");
  await expect(page.getByTestId("subscription-selected-plan-card")).toContainText("Sana en uygun plan");
  await expect(page.getByTestId("subscription-gold-focus-sticky-bar")).toHaveCount(0);
  await expect(page.getByTestId("subscription-gold-focus-submit")).toContainText("GOLD");
  await expect(page.getByTestId("subscription-status-button")).toBeVisible();
  await expect(page.getByText(/trial|free trial|ücretsiz deneme|ücretsiz dene|deneme süresi/i)).toHaveCount(0);

  await page.getByTestId("subscription-status-button").click();
  await expect(page.getByTestId("app-sheet")).toContainText("Aktif aboneliğin yok");
  await expect(page.getByTestId("app-sheet")).toContainText("Gold");
  await page.getByTestId("sheet-close-button").click();

  await page.getByTestId("subscription-plan-row-plus").click();
  await expect(page.getByTestId("subscription-selected-plan-card")).toContainText("Plus");
  await expect(page.getByTestId("subscription-gold-focus-submit")).toContainText("PLUS");

  await page.getByTestId("subscription-plan-row-vip").click();
  await expect(page.getByTestId("subscription-selected-plan-card")).toContainText("VIP");
  await expect(page.getByTestId("subscription-gold-focus-submit")).toContainText("VIP");

  await page.getByTestId("subscription-plan-row-gold").click();
  await page.getByTestId("subscription-gold-focus-billing-annual").click();
  await page.getByTestId("subscription-gold-focus-submit").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/subscription/checkout");
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("plan=gold");
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("billing=annual");

  expect(errors).toEqual([]);
});

test("subscription Gold focus responsive matrix has no horizontal overflow", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 360, height: 780 },
    { width: 393, height: 852 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/#/subscription");
    await resetSubscription(page);
    await page.reload();
    await waitForApp(page);
    await expect(page.getByTestId("subscription-gold-focus-view")).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
  }
  expect(errors).toEqual([]);
});

test("subscription Gold focus FAQ rows are not no-op", async ({ page }) => {
  await page.goto("/#/subscription");
  await resetSubscription(page);
  await page.reload();
  await waitForApp(page);

  const firstFaq = page.getByTestId("subscription-gold-focus-faq-row").first();
  await firstFaq.click();
  await expect(firstFaq).toContainText("Evet");
});

test("subscription Gold focus DOM does not render retired free paywall classes", async ({ page }) => {
  await page.goto("/#/subscription?subscriptionState=free");
  await resetSubscription(page);
  await page.reload();
  await waitForApp(page);

  for (const selector of [
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
    ".subscription-compare-link",
    ".subscription-trust-footer",
    ".subscription-faq-card",
    ".subscription-sticky-cta",
    ".subscription-flow",
  ]) {
    await expect(page.locator(selector)).toHaveCount(0);
  }
});
