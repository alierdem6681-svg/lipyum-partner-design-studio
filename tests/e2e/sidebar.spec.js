import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

async function openSidebar(page) {
  await page.getByTestId("hamburger-button").click();
  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();
}

test("hamburger opens and close button closes sidebar", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await openSidebar(page);
  await expect(page.getByTestId("sidebar-upgrade-banner")).toBeVisible();
  await expect(page.locator(".drawer-work-status-card")).toHaveCount(0);
  await expect(page.getByTestId("sidebar-upgrade-banner")).toContainText("Müşterilere Plus olarak görün");
  await expect(page.getByTestId("sidebar-upgrade-banner")).toContainText("Yükselt");
  const geometry = await page.evaluate(() => {
    const drawer = document.querySelector('[data-testid="sidebar-drawer"]')?.getBoundingClientRect();
    const banner = document.querySelector('[data-testid="sidebar-upgrade-banner"]')?.getBoundingClientRect();
    const close = document.querySelector('[data-testid="sidebar-close"]')?.getBoundingClientRect();
    return {
      closeIsRightOfBanner: close.left > banner.right,
      closeNearDrawerRight: drawer.right - close.right <= 14,
    };
  });
  expect(geometry).toEqual({ closeIsRightOfBanner: true, closeNearDrawerRight: true });
  await page.getByTestId("sidebar-close").click();
  await expect(page.getByTestId("sidebar-drawer")).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("sidebar overlay click closes drawer", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await openSidebar(page);
  await page.evaluate(() => document.querySelector('[data-testid="sidebar-overlay"]')?.click());
  await expect(page.getByTestId("sidebar-drawer")).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("sidebar routes kazanc ortakligi items and closes after navigation", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await openSidebar(page);
  await page.getByRole("button", { name: "Partner Davet Programı" }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/referral");
  await expect(page.getByTestId("sidebar-drawer")).toHaveCount(0);

  await page.goto("/#/home");
  await waitForApp(page);
  await openSidebar(page);
  await page.getByRole("button", { name: "İş Yönlendirme Programı" }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/job-referral");
  await expect(page.getByTestId("sidebar-drawer")).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("account transactions stay out of sidebar and wallet route stays clean", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await openSidebar(page);
  await expect(page.getByTestId("sidebar-drawer").getByText("Hesap Hareketleri")).toHaveCount(0);
  await page.getByTestId("sidebar-close").click();

  await page.goto("/#/wallet");
  await waitForApp(page);
  await expect(page.getByTestId("wallet-info-button")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Tümünü gör" })).toHaveCount(0);
  await expect(page.locator("#bottomNav")).toBeVisible();

  expect(errors).toEqual([]);
});

test("sidebar has V10 support entries without duplicate sticky support card", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await openSidebar(page);
  await expect(page.getByRole("button", { name: "Yardım ve Destek" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Talep Oluştur" })).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Canlı Destek" })).toHaveCount(1);
  await expect(page.getByRole("button", { name: /Müşteri Hizmetleri/ })).toHaveCount(1);
  await expect(page.locator(".drawer-support-card")).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("customer service sidebar item opens support page", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await openSidebar(page);
  await page.getByRole("button", { name: /Müşteri Hizmetleri/ }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/support/customer-service");
  await expect(page.getByTestId("sidebar-drawer")).toHaveCount(0);
  await expect(page.getByTestId("customer-service-page")).toBeVisible();
  await expect(page.getByTestId("customer-service-phone-number")).toHaveCount(0);
  await expect(page.getByTestId("customer-service-call")).toHaveCount(0);
  await expect(page.getByTestId("customer-service-upgrade")).toHaveCount(0);

  expect(errors).toEqual([]);
});
