import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

test("invoices page lists invoices and manages invoice info", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  await page.goto("/#/invoices");
  await waitForApp(page);

  await expect(page.getByTestId("invoices-page")).toBeVisible();
  await expect(page.getByText("Faturalarını ve bilgilerini yönet")).toBeVisible();
  await expect(page.getByTestId("invoice-row")).toHaveCount(4);

  await page.getByRole("button", { name: "Fatura Bilgileri" }).click();
  await expect(page.getByTestId("invoice-settings")).toBeVisible();
  await expect(page.getByLabel("Fatura türü").getByRole("button", { name: "Bireysel" })).toBeVisible();
  await expect(page.getByLabel("Ad soyad")).toBeVisible();

  await page.getByRole("button", { name: "Kurumsal" }).click();
  await expect(page.getByLabel("Şirket ünvanı")).toBeVisible();
  await expect(page.getByLabel("Vergi no")).toBeVisible();

  await page.getByLabel("Şirket ünvanı").fill("Lipyum Teknoloji A.Ş.");
  await page.getByTestId("invoice-save-button").click();
  await expect(page.getByTestId("invoice-save-note")).toBeVisible();

  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test("sidebar includes Faturalarım and opens invoices route", async ({ page }) => {
  await page.goto("/#/home");
  await waitForApp(page);

  await page.getByTestId("hamburger-button").click();
  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();
  await page.getByRole("button", { name: /Faturalarım/ }).click();

  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/invoices");
  await expect(page.getByTestId("invoices-page")).toBeVisible();
});
