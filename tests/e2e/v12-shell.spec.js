import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("V12 shell boots one Vue root and exposes global chrome", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/");
  await waitForApp(page);

  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#/home");
  await expect.poll(() => page.evaluate(() => window.__LIPYUM_VUE_ROOT__)).toBe(true);
  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByTestId("app-bottom-bar")).toBeVisible();
  await expect(page.locator("#appRoot")).toContainText("Performans Skoru");

  await page.getByTestId("hamburger-button").click();
  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();
  await page.getByTestId("sidebar-close").click();
  await expect(page.getByTestId("sidebar-drawer")).toHaveCount(0);

  expect(errors).toEqual([]);
});
