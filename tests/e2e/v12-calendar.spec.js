import { expect, test } from "@playwright/test";

test("V12 Vue calendar route renders day filters and appointment cards", async ({ page }) => {
  await page.goto("/?engine=vue#/calendar");
  await expect(page.getByRole("heading", { name: "Takvim" })).toBeVisible();
  await expect(page.getByText("Bugünkü Randevular")).toBeVisible();
  await expect(page.getByText("Ayşe Hanım")).toBeVisible();
  await page.getByRole("button", { name: /QR Göster/ }).click();
  await expect(page.getByRole("dialog", { name: "QR Göster" })).toBeVisible();
});
