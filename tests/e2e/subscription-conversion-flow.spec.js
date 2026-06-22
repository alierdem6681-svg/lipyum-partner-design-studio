import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

async function openSubscription(page, state = "free") {
  await page.goto(`#/subscription?subscriptionState=${state}`);
  await waitForApp(page);
  await expect(page.getByTestId("subscription-page")).toBeVisible();
  await expect(page.getByTestId(`subscription-state-${state === "payment-issue" ? "payment-issue" : state}`)).toBeVisible();
}

async function expectSinglePrimaryCta(page) {
  await expect(page.getByTestId("subscription-primary-cta")).toHaveCount(1);
}

test.describe("subscription conversion flow", () => {
  test("free user sees focused plan options, transparent trial copy and comparison sheet", async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await openSubscription(page, "free");

    await expect(page.getByRole("heading", { name: "Aboneliğim" })).toBeVisible();
    await expect(page.getByText("Şu an Free")).toBeVisible();
    await expect(page.getByText("İş alma gücünü büyüt")).toBeVisible();
    await expect(page.getByTestId("subscription-option-plus")).toBeVisible();
    await expect(page.getByTestId("subscription-option-pro")).toBeVisible();
    await expect(page.getByTestId("subscription-option-vip")).toBeVisible();
    await expect(page.getByTestId("subscription-recommended-card")).toContainText("249 TL");
    await expect(page.getByText("30 gün ücretsiz. Sonrasında 249 TL/ay.")).toBeVisible();
    await expect(page.getByTestId("subscription-trial-timeline")).toContainText("28. gün");
    await expectSinglePrimaryCta(page);

    await page.getByTestId("subscription-option-vip").click();
    await expect(page.getByText("VIP PLANINI SEÇ")).toBeVisible();
    await page.getByTestId("subscription-option-plus").click();

    await page.getByTestId("subscription-compare-open").click();
    await expect(page.getByText("Planları Karşılaştır")).toBeVisible();
    await expect(page.getByTestId("subscription-billing-monthly")).toHaveClass(/is-active/);
    await expect(page.getByTestId("subscription-plan-pro")).toContainText("499 TL");
    await expect(page.getByTestId("subscription-plan-vip")).toContainText("899 TL");
    await page.getByTestId("subscription-billing-annual").click();
    await expect(page.getByTestId("subscription-plan-plus")).toContainText("2.388 TL");
    await page.getByTestId("subscription-compare-close").click();

    await expectNoAppHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });

  test("trial user sees remaining days and management actions", async ({ page }) => {
    await openSubscription(page, "trial");

    await expect(page.getByText(/Plus denemenin \d+ günü kaldı/)).toBeVisible();
    await expect(page.getByTestId("subscription-current-card")).toContainText("Plus");
    await expect(page.getByTestId("subscription-trial-manage")).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
  });

  test("active user can manage subscription and restore purchases", async ({ page }) => {
    await openSubscription(page, "active");

    await expect(page.getByTestId("subscription-current-card")).toContainText("Aktif");
    await expect(page.getByTestId("subscription-usage-card")).toContainText("Müşteri hizmetleri");
    await page.getByTestId("subscription-manage").click();
    await page.getByTestId("subscription-active-restore").click();
    await expectNoAppHorizontalOverflow(page);
  });

  test("canceled, payment issue and expired states expose the correct recovery CTA", async ({ page }) => {
    await openSubscription(page, "canceled");
    await expect(page.getByTestId("subscription-reactivate")).toBeVisible();

    await openSubscription(page, "payment-issue");
    await expect(page.getByText("Ödeme alınamadı")).toBeVisible();
    await expect(page.getByTestId("subscription-resolve-payment")).toBeVisible();

    await openSubscription(page, "expired");
    await expect(page.getByText("Plus avantajların sona erdi")).toBeVisible();
    await expect(page.getByTestId("subscription-return-plus")).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
  });

  for (const viewport of [
    { width: 320, height: 568 },
    { width: 360, height: 780 },
    { width: 393, height: 852 },
    { width: 430, height: 932 },
  ]) {
    test(`free conversion has no overflow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openSubscription(page, "free");
      await expect(page.getByTestId("subscription-primary-cta")).toBeVisible();
      await expectNoAppHorizontalOverflow(page);
    });
  }
});
