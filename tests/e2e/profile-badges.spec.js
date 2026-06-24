import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("profile +N badge expansion is one-way and route-local", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/profile");
  await waitForApp(page);

  await expect(page.getByRole("button", { name: "Ek rozetleri göster" })).toBeVisible();
  await expect(page.getByText("Çalışkan")).toHaveCount(0);

  await page.getByRole("button", { name: "Ek rozetleri göster" }).click();
  await expect(page.getByText("Çalışkan")).toBeVisible();
  await expect(page.getByText("Planlı Düzenli")).toBeVisible();
  await expect(page.getByRole("button", { name: "Ek rozetleri göster" })).toHaveCount(0);

  await page.evaluate(() => window.navigateToPage("/wallet"));
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/wallet");
  await page.evaluate(() => window.navigateToPage("/profile"));
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/profile");
  await expect(page.getByRole("button", { name: "Ek rozetleri göster" })).toBeVisible();

  expect(errors).toEqual([]);
});
