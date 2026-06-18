import { expect, test } from "@playwright/test";
import { waitForApp } from "./helpers.js";

test("bottom labels use V12-E product names", async ({ page }) => {
  await page.goto("/#/home");
  await waitForApp(page);

  const bottom = page.getByTestId("app-bottom-bar").first();
  await expect(bottom.getByText("Ana Sayfa")).toBeVisible();
  await expect(bottom.getByText("İşler", { exact: true })).toBeVisible();
  await expect(bottom.getByText("İş Al", { exact: true })).toBeVisible();
  await expect(bottom.getByText("Randevu", { exact: true })).toBeVisible();
  await expect(bottom.getByText("Cüzdan", { exact: true })).toBeVisible();
  await expect(bottom.getByText("İşlerim")).toHaveCount(0);
  await expect(bottom.getByText("Takvim")).toHaveCount(0);
});

test("Vue bottom labels are sourced from the same V12-E names", async ({ page }) => {
  await page.goto("/?engine=vue#/home");
  await waitForApp(page);

  const bottom = page.getByTestId("app-bottom-bar").first();
  await expect(bottom.getByText("İşler", { exact: true })).toBeVisible();
  await expect(bottom.getByText("Randevu", { exact: true })).toBeVisible();
  await expect(bottom.getByText("İşlerim")).toHaveCount(0);
  await expect(bottom.getByText("Takvim")).toHaveCount(0);
});
