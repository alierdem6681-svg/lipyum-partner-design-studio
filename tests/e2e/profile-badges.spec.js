import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("profile summary hides public metrics and badge row", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/profile");
  await waitForApp(page);

  await expect(page.getByTestId("profile-menu-strength-summary")).toBeVisible();
  await expect(page.getByTestId("partner-public-metrics")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Ek rozetleri göster" })).toHaveCount(0);
  await expect(page.getByText("Yanıt Süresi")).toHaveCount(0);
  await expect(page.getByText("Favoriye Alanlar")).toHaveCount(0);
  await expect(page.getByText("Güvenilir")).toHaveCount(0);

  expect(errors).toEqual([]);
});
