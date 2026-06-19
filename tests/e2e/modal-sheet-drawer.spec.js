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
  await expect(page.getByTestId("partner-share-button")).toHaveCount(0);
  const previewButtonNameDelta = await page.evaluate(() => {
    const card = document.querySelector('[data-testid="partner-profile-card"]');
    const name = card?.querySelector(".partner-profile-name")?.getBoundingClientRect();
    const button = card?.querySelector('[data-testid="partner-card-preview-button"]')?.getBoundingClientRect();
    return name && button ? Math.abs(name.top - button.top) : 999;
  });
  expect(previewButtonNameDelta).toBeLessThanOrEqual(16);
  await page.getByTestId("partner-card-preview-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/partner-card-preview");
  await expect(page.getByTestId("partner-public-badge").first()).toBeVisible();
  await expect(page.getByTestId("partner-public-seal")).toHaveCount(0);
  await expect(page.getByTestId("partner-public-badge")).toContainText("Lipyum Gold Partner");
  await expect(page.getByTestId("partner-public-badge")).toContainText("Sonuç Bildiren");
  await expect(page.getByTestId("partner-public-badge")).toContainText("Randevu Düzenli");
  await expect(page.getByTestId("app-bottom-bar")).toBeHidden();
  await page.getByTestId("partner-preview-share").click();
  await expect(page.getByTestId("partner-share-whatsapp")).toBeVisible();
  await expect(page.getByTestId("partner-share-website")).toBeVisible();
  await expect(page.getByTestId("partner-share-social-post")).toBeVisible();
  await expect(page.getByTestId("partner-share-story")).toBeVisible();
  await page.getByTestId("sheet-close-button").click();
  await expect(page.getByTestId("partner-share-whatsapp")).toHaveCount(0);

  expect(errors).toEqual([]);
});
