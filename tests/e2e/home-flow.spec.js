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

  await page.getByTestId("home-wallet-card").getByRole("button", { name: /Bakiye/ }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#/home");
  await expect(page.getByTestId("quick-topup-sheet")).toBeVisible();
  await expect(page.getByTestId("topup-package-option")).toHaveCount(5);
  await expect(page.getByTestId("quick-topup-total-credit")).toContainText("8.457");
  await page.getByTestId("quick-topup-submit").click();
  await expect(page.getByTestId("quick-topup-3d")).toBeVisible();
  await page.getByTestId("quick-topup-3d-confirm").click();
  await expect(page.getByTestId("quick-topup-success")).toBeVisible();
  await page.getByTestId("quick-topup-home").click();
  await expect(page.getByTestId("quick-topup-sheet")).toHaveCount(0);

  const performanceCard = page.getByTestId("home-performance-card");
  await expect(performanceCard.getByText("Nedir?")).toHaveCount(0);
  await expect(page.getByTestId("home-performance-improve-button")).toContainText("Performansımı Artır");
  await page.getByTestId("home-performance-improve-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-score");
  await expect(page.getByTestId("performance-score-flow-page")).toBeVisible();

  expect(errors).toEqual([]);
});

test("home region period filter updates active state, metrics and activity", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  const regionCard = page.getByTestId("home-region-card");
  const filterRail = page.getByTestId("home-region-filter");
  const today = page.getByTestId("home-region-filter-today");
  const yesterday = page.getByTestId("home-region-filter-yesterday");
  const activity = page.locator("[data-region-activity-text]");

  await expect(filterRail).toHaveClass(/filter-chip-rail/);
  await expect(today).toHaveAttribute("aria-pressed", "true");
  await expect(yesterday).toHaveAttribute("aria-pressed", "false");
  await expect(regionCard).toContainText("128");
  await expect(activity).toContainText("Mehmet Ali A.");

  await yesterday.click();
  await expect(today).toHaveAttribute("aria-pressed", "false");
  await expect(yesterday).toHaveAttribute("aria-pressed", "true");
  await expect(regionCard).toContainText("104");
  await expect(activity).toContainText("Aydın Ç.");

  await today.click();
  await expect(today).toHaveAttribute("aria-pressed", "true");
  await expect(yesterday).toHaveAttribute("aria-pressed", "false");
  await expect(regionCard).toContainText("128");
  await expect(activity).toContainText("Mehmet Ali A.");

  expect(errors).toEqual([]);
});
