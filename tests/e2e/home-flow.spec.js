import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("home critical actions open their mock destinations", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await page.locator('[data-open="bonus-convert"]').click();
  await expect(page.getByTestId("quick-bonus-sheet")).toBeVisible();
  await expect(page.getByTestId("bonus-mode-topup")).toHaveAttribute("aria-checked", "true");
  await expect(page.getByTestId("bonus-mode-cash")).toContainText("%32");
  await expect(page.getByTestId("bonus-package-option")).toHaveCount(3);
  await expect(page.getByTestId("bonus-total-credit")).toContainText("8.697");
  await page.getByTestId("bonus-convert-submit").click();
  await expect(page.getByTestId("bonus-3d-step")).toBeVisible();
  await page.getByTestId("bonus-3d-confirm").click();
  await expect(page.getByTestId("bonus-convert-success")).toBeVisible();
  await page.getByTestId("bonus-convert-home").click();
  await expect(page.getByTestId("quick-bonus-sheet")).toHaveCount(0);

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
  await expect(page.getByTestId("performance-score-empty-page")).toBeVisible();

  expect(errors).toEqual([]);
});

test("home bonus conversion supports cash wallet fallback", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await page.locator('[data-open="bonus-convert"]').click();
  await page.getByTestId("bonus-mode-cash").click();
  await expect(page.getByTestId("bonus-cash-panel")).toBeVisible();
  await expect(page.getByTestId("bonus-cash-panel")).toContainText("%32");
  await expect(page.getByTestId("bonus-cash-panel")).toContainText("₺76,80");
  await page.getByTestId("bonus-convert-submit").click();
  await expect(page.getByTestId("bonus-cash-confirm")).toBeVisible();
  await page.getByTestId("bonus-cash-confirm-button").click();
  await expect(page.getByTestId("bonus-convert-success")).toBeVisible();

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
