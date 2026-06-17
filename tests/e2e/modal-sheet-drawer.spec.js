import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("V10 sheet, drawer and partner share panel open and close cleanly", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await page.getByRole("button", { name: /Krediye Çevir/ }).first().click();
  await expect(page.getByTestId("sheet-close-button")).toBeVisible();
  await page.getByTestId("sheet-close-button").click();
  await expect(page.getByTestId("sheet-close-button")).toHaveCount(0);

  await page.getByTestId("hamburger-button").click();
  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();
  await page.getByTestId("sidebar-close").click();
  await expect(page.getByTestId("sidebar-drawer")).toHaveCount(0);

  await page.goto("/#/profile");
  await waitForApp(page);
  await page.getByTestId("partner-share-button").click();
  await expect(page.getByTestId("partner-public-badge").first()).toBeVisible();
  await expect(page.getByTestId("partner-copy-link")).toBeVisible();
  await page.getByTestId("sheet-close-button").click();
  await expect(page.getByTestId("partner-copy-link")).toHaveCount(0);

  expect(errors).toEqual([]);
});
