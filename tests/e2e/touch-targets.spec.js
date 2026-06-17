import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

const criticalControls = [
  "hamburger-button",
  "notification-button",
  "profile-button",
  "back-button",
  "bottom-tab-home",
  "bottom-tab-jobs",
  "bottom-tab-calendar",
  "bottom-tab-wallet",
  "bottom-cta-job",
  "sheet-close-button",
  "sidebar-close",
];

async function expectTouchTarget(page, testId) {
  const locator = page.getByTestId(testId).first();
  if (!(await locator.count())) return;
  const box = await locator.boundingBox();
  if (!box) return;
  expect(box.width, `${testId} width`).toBeGreaterThanOrEqual(40);
  expect(box.height, `${testId} height`).toBeGreaterThanOrEqual(40);
}

test("V10 critical controls keep mobile touch targets", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  for (const testId of criticalControls) await expectTouchTarget(page, testId);

  await page.getByRole("button", { name: /Krediye Çevir/ }).first().click();
  await expect(page.getByTestId("sheet-close-button")).toBeVisible();
  await expectTouchTarget(page, "sheet-close-button");
  await page.getByTestId("sheet-close-button").click();

  await page.getByTestId("hamburger-button").click();
  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();
  await expectTouchTarget(page, "sidebar-close");

  expect(errors).toEqual([]);
});
