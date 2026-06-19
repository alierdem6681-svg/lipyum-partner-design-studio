import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("V12 home is Vue-rendered and keeps critical actions", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await expect(page.getByTestId("home-status-card")).toBeVisible();
  await expect(page.getByTestId("home-performance-card")).toContainText("Performans Skoru");
  await expect(page.getByTestId("home-wallet-card")).toContainText("675");
  await expect(page.getByTestId("home-bonus-card")).toContainText("240");
  await expect(page.getByTestId("home-region-card")).toContainText("18");

  await page.getByRole("button", { name: /Krediye Çevir/ }).first().click();
  await expect(page.getByTestId("sheet-close-button")).toBeVisible();
  await page.getByTestId("sheet-close-button").click();
  await expect(page.getByTestId("sheet-close-button")).toHaveCount(0);

  await page.getByTestId("home-score-boost-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-score");

  expect(errors).toEqual([]);
});
