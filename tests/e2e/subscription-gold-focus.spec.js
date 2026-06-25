import { expect, test } from "@playwright/test";
import { expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const storageKey = "lipyum.subscription.directPurchase.v2";

test.beforeEach(async ({ page }) => {
  await page.addInitScript((key) => window.localStorage.removeItem(key), storageKey);
});

test("Gold focused subscription paywall is selectable and transparent", async ({ page }) => {
  await page.goto("#/subscription");
  await waitForApp(page);

  await expect(page.getByTestId("subscription-gold-focus-view")).toBeVisible();
  await expect(page.getByTestId("subscription-gold-focus-hero")).toContainText("Daha güçlü görün.");
  await expect(page.getByTestId("subscription-plan-gold")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByTestId("selected-plan-card")).toContainText("Lipyum Gold");
  await expect(page.getByTestId("selected-plan-cta")).toContainText("GOLD'A GEÇ");

  await page.getByTestId("subscription-plan-vip").click();
  await expect(page.getByTestId("selected-plan-card")).toContainText("Lipyum VIP");
  await expect(page.getByTestId("selected-plan-cta")).toContainText("VIP'E GEÇ");

  await page.getByTestId("billing-annual").click();
  await expect(page.getByTestId("selected-plan-card")).toContainText("34.860 TL / yıl");

  await page.getByTestId("subscription-plan-gold").click();
  await page.getByTestId("subscription-sticky-cta").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/subscription/checkout");
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("plan=gold");
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("billing=annual");
});

for (const viewport of [
  { width: 320, height: 568 },
  { width: 360, height: 780 },
  { width: 393, height: 852 },
  { width: 430, height: 932 },
]) {
  test(`Gold focused subscription has no horizontal overflow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("#/subscription");
    await waitForApp(page);
    await expect(page.getByTestId("subscription-gold-focus-view")).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
  });
}
