import { expect, test } from "@playwright/test";

test("V12 Vue home route exposes core actions without activating default cutover", async ({ page }) => {
  await page.goto("/?engine=vue#/home");
  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByText("Performans Skoru")).toBeVisible();
  await expect(page.getByTestId("home-performance-card")).toBeVisible();
  await expect(page.getByTestId("home-wallet-card")).toBeVisible();
  await expect(page.getByTestId("home-bonus-card")).toBeVisible();

  await page.getByRole("button", { name: /Krediye Çevir/ }).click();
  await expect(page.getByRole("dialog", { name: "Krediye Çevir" })).toBeVisible();
  await page.getByTestId("sheet-close-button").click();
  await expect(page.getByRole("dialog", { name: "Krediye Çevir" })).toBeHidden();

  await page.getByTestId("bottom-cta-job").click();
  await expect(page).toHaveURL(/#\/jobs$/);
});
