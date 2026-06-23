import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

async function openSidebar(page) {
  await page.getByTestId("hamburger-button").click();
  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();
}

test("sidebar support group opens create ticket flow", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await openSidebar(page);
  await expect(page.getByText("Davet ettiğin partnerlerin")).toHaveCount(0);
  await expect(page.getByText("Servis talebi gönder, iş gerçekleşirse")).toHaveCount(0);
  await page.getByRole("button", { name: "Talep Oluştur" }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/support/new");

  await expect(page.getByTestId("support-ticket-form")).toBeVisible();
  await expect(page.getByText("Hızlı destek talebi")).toHaveCount(0);
  await expect(page.getByTestId("support-ticket-subject")).toHaveCount(0);
  await page.getByTestId("support-ticket-category").selectOption("Sistem ile ilgili konular");
  await expect(page.getByTestId("support-ticket-category")).toContainText("Şikayet bildirmek istiyorum");
  await expect(page.getByTestId("support-ticket-description")).toHaveAttribute(
    "placeholder",
    "Profilime daha fazla bölge eklemek için yardım istiyorum.",
  );
  await page.getByTestId("support-ticket-description").focus();
  await expect(page.getByTestId("support-ticket-description")).toHaveAttribute("placeholder", "");
  await page.getByTestId("support-ticket-description").fill("Mock talep oluşturma akışı kontrol ediliyor.");
  await expect(page.getByTestId("support-ticket-character-count")).toContainText("456 karakter kaldı");
  await page.getByTestId("support-ticket-priority").selectOption("Acil");
  await expect(page.getByTestId("support-ticket-priority")).toContainText("Kritik");
  await expect(page.getByTestId("support-ticket-image-upload")).toBeVisible();
  await expect(page.getByTestId("support-ticket-file-upload")).toBeVisible();
  await page.getByTestId("support-ticket-submit").click();
  await expect(page.getByTestId("support-ticket-success")).toBeVisible();
  await expect(page.getByTestId("support-ticket-success").getByText("LP-000123")).toBeVisible();
  await page.getByTestId("support-ticket-new").click();
  await expect(page.getByTestId("support-ticket-form")).toBeVisible();

  await page.getByTestId("back-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/home");
  expect(errors).toEqual([]);
});

test("sidebar support group opens live support flow", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await openSidebar(page);
  await page.getByRole("button", { name: "Canlı Destek" }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/support/live");
  await expect(page.getByTestId("live-support-page")).toBeVisible();
  await page.getByTestId("live-support-title").fill("Canlı destek testi");
  await page.getByTestId("live-support-description").fill("Temsilci bağlantı durumunu kontrol etmek istiyorum.");
  await page.getByTestId("live-support-start").click();
  await expect(page.getByRole("heading", { name: "Temsilci bağlanıyor" })).toBeVisible();

  expect(errors).toEqual([]);
});

test("sidebar support group opens customer service flow", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await openSidebar(page);
  await page.getByRole("button", { name: /Müşteri Hizmetleri/ }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/support/customer-service");
  await expect(page.getByTestId("customer-service-page")).toBeVisible();
  await expect(page.getByTestId("customer-service-phone-number")).toHaveText("444 23 68");
  await expect(page.getByTestId("customer-service-call")).toBeVisible();
  await expect(page.getByTestId("customer-service-call")).toHaveAttribute("href", "tel:4442368");
  await expect(page.getByTestId("customer-service-upgrade")).toHaveCount(0);

  expect(errors).toEqual([]);
});
