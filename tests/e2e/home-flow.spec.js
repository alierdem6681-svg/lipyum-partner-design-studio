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

  await page.locator('button[data-screen="performanceScore"]').click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/performance-score");
  await expect(page.getByText("İş görünürlüğünü etkileyen kalite özeti.").first()).toBeVisible();

  expect(errors).toEqual([]);
});
