import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

async function openSidebar(page) {
  await page.getByTestId("hamburger-button").click();
  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();
}

async function expectHash(page, route) {
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain(route);
}

test("sidebar and profile expose support ticket flow", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await openSidebar(page);
  await page.getByRole("button", { name: "Talep Oluştur" }).click();
  await expectHash(page, "/support/new");
  await expect(page.getByTestId("support-ticket-page")).toBeVisible();
  await expect(page.getByTestId("app-bottom-bar")).toHaveCount(0);

  await page.goto("/#/profile");
  await waitForApp(page);
  await page.getByTestId("profile-menu-strength-summary").click();
  await page.getByRole("button", { name: "Destek Talebi" }).click();
  await expectHash(page, "/support");
  await expect(page.getByTestId("support-ticket-page")).toBeVisible();

  expect(errors).toEqual([]);
});

test("create ticket form changes by category and submits to success", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/support");
  await waitForApp(page);

  await expect(page.getByTestId("support-ticket-form")).toBeVisible();
  await expect(page.getByTestId("support-character-counter")).toContainText("0 / 500");

  await page.getByTestId("support-category-payment_wallet").click();
  await expect(page.getByTestId("support-related-select")).toContainText("Bakiye");

  await page.getByTestId("support-description").fill("Bakiye hareketimde kontrol edilmesi gereken bir konu var.");
  await expect(page.getByTestId("support-character-counter")).toContainText("57 / 500");

  await page.getByTestId("support-attachment-add").click();
  await page.getByTestId("support-ticket-submit").click();
  await expectHash(page, "/support/success/");
  await expect(page.getByTestId("support-ticket-success-page")).toBeVisible();
  await page.getByTestId("support-success-view-ticket").click();
  await expectHash(page, "/support/tickets/");
  await expect(page.getByTestId("support-ticket-detail-page")).toBeVisible();

  expect(errors).toEqual([]);
});

test("ticket list filters, searches and opens detail", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/support/tickets");
  await waitForApp(page);

  await expect(page.getByTestId("support-ticket-list-page")).toBeVisible();
  await page.getByRole("tab", { name: "Yanıtlandı" }).click();
  await expect(page.getByTestId("support-ticket-card")).toHaveCount(1);

  await page.getByRole("tab", { name: "Tümü" }).click();
  await page.getByTestId("support-ticket-search").fill("2476");
  await expect(page.getByTestId("support-ticket-card")).toHaveCount(1);
  await page.getByTestId("support-ticket-card").first().click();
  await expectHash(page, "/support/tickets/");
  await expect(page.getByTestId("support-ticket-detail-page")).toBeVisible();

  expect(errors).toEqual([]);
});

test("detail reply and resolved state work", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/support/tickets/lp-2481");
  await waitForApp(page);

  await page.getByTestId("support-ticket-reply-input").fill("Bilgi için teşekkürler, sonucu bekliyorum.");
  await page.getByTestId("support-ticket-reply-submit").click();
  await expect(page.getByTestId("support-ticket-thread")).toContainText("Bilgi için teşekkürler");

  await page.getByTestId("support-ticket-resolve").click();
  await expect(page.getByTestId("support-ticket-detail-page")).toContainText("Çözüldü");

  expect(errors).toEqual([]);
});

for (const width of [320, 360, 393, 430, 768]) {
  test(`support ticket flow has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 852 });
    await page.goto("/#/support");
    await waitForApp(page);
    await expectNoAppHorizontalOverflow(page);
  });
}
