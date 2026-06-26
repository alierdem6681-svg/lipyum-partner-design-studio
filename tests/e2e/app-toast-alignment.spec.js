import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("global toast stays centered inside the mobile app shell", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/verifications");
  await waitForApp(page);

  await page.getByTestId("verification-action-email-button").click();

  const toast = page.getByTestId("app-toast");
  await expect(toast).toContainText("Mail doğrulama");

  const geometry = await page.evaluate(() => {
    const screen = document.querySelector(".phone-screen")?.getBoundingClientRect();
    const toastBox = document.querySelector("[data-testid='app-toast']")?.getBoundingClientRect();
    if (!screen || !toastBox) return null;
    return {
      screenLeft: screen.left,
      screenRight: screen.right,
      screenCenter: screen.left + screen.width / 2,
      toastLeft: toastBox.left,
      toastRight: toastBox.right,
      toastCenter: toastBox.left + toastBox.width / 2,
    };
  });

  expect(geometry).not.toBeNull();
  expect(geometry.toastLeft).toBeGreaterThanOrEqual(geometry.screenLeft + 8);
  expect(geometry.toastRight).toBeLessThanOrEqual(geometry.screenRight - 8);
  expect(Math.abs(geometry.toastCenter - geometry.screenCenter)).toBeLessThanOrEqual(2);
  expect(errors).toEqual([]);
});
