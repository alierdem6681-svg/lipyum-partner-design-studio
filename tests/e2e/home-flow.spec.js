import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("home critical actions open their mock destinations", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await page.getByRole("button", { name: /Krediye Çevir/ }).first().click();
  await expect(page.getByTestId("sheet-close-button")).toBeVisible();
  await page.getByTestId("sheet-close-button").click();
  await expect(page.getByTestId("sheet-close-button")).toHaveCount(0);

  const performanceCard = page.getByTestId("home-performance-card");
  await expect(performanceCard.getByText("Nedir?")).toHaveCount(0);
  await expect(page.getByTestId("home-performance-improve-button")).toContainText("Performansımı Artır");
  await page.getByTestId("home-performance-improve-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-improve");
  await expect(page.getByTestId("app-header")).toContainText("Performansımı Artır");

  expect(errors).toEqual([]);
});

test("home region period filter updates active state, metrics and activity", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  const regionCard = page.getByTestId("home-region-card");
  const today = page.getByTestId("home-region-filter-today");
  const yesterday = page.getByTestId("home-region-filter-yesterday");
  const activity = page.locator("[data-region-activity-text]");

  await expect(today).toHaveAttribute("aria-selected", "true");
  await expect(yesterday).toHaveAttribute("aria-selected", "false");
  await expect(regionCard).toContainText("128");
  await expect(activity).toContainText("Mehmet Ali A.");

  await yesterday.click();
  await expect(today).toHaveAttribute("aria-selected", "false");
  await expect(yesterday).toHaveAttribute("aria-selected", "true");
  await expect(regionCard).toContainText("104");
  await expect(activity).toContainText("Aydın Ç.");

  await today.click();
  await expect(today).toHaveAttribute("aria-selected", "true");
  await expect(yesterday).toHaveAttribute("aria-selected", "false");
  await expect(regionCard).toContainText("128");
  await expect(activity).toContainText("Mehmet Ali A.");

  expect(errors).toEqual([]);
});
