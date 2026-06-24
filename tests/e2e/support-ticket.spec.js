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

  await expect(page.getByTestId("support-ticket-page")).toBeVisible();
  await expect(page.getByTestId("support-ticket-form")).toHaveCount(0);
  await expect(page.getByTestId("support-ticket-submit")).toHaveCount(0);

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
  await expect(page.getByTestId("live-support-title")).toHaveCount(0);
  await expect(page.getByTestId("live-support-start")).toHaveCount(0);

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
  await expect(page.getByTestId("customer-service-phone-number")).toHaveCount(0);
  await expect(page.getByTestId("customer-service-call")).toHaveCount(0);
  await expect(page.getByTestId("customer-service-upgrade")).toHaveCount(0);

  expect(errors).toEqual([]);
});
