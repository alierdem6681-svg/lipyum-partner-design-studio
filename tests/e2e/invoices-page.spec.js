import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

test("invoices page opens as a clean shell", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  await page.goto("/#/invoices");
  await waitForApp(page);

  await expect(page.getByTestId("invoices-page")).toBeVisible();
  await expect(page.getByTestId("invoices-page").locator(".v-empty-page-shell")).toBeVisible();

  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test("operation sidebar items are hidden while invoices route still opens directly", async ({ page }) => {
  await page.goto("/#/home");
  await waitForApp(page);

  await page.getByTestId("hamburger-button").click();
  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();
  await expect(page.getByTestId("sidebar-drawer").getByText("Operasyon")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Müşteri Yönetimi/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Faturalarım/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Dijital Servis Formu/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Teklif Oluştur/ })).toHaveCount(0);

  await page.goto("/#/invoices");
  await waitForApp(page);
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/invoices");
  await expect(page.getByTestId("invoices-page")).toBeVisible();
});
