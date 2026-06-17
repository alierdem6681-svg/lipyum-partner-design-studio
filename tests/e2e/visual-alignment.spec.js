import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

async function expectIconCentered(page, selector, label) {
  const delta = await page.locator(selector).first().evaluate((button) => {
    const icon = button.querySelector(".icon, svg");
    const buttonBox = button.getBoundingClientRect();
    const iconBox = icon?.getBoundingClientRect();
    if (!iconBox) return { missing: true };
    return {
      dx: Math.abs((buttonBox.left + buttonBox.width / 2) - (iconBox.left + iconBox.width / 2)),
      dy: Math.abs((buttonBox.top + buttonBox.height / 2) - (iconBox.top + iconBox.height / 2)),
    };
  });

  expect(delta.missing, `${label} icon should exist`).toBeFalsy();
  expect(delta.dx, `${label} icon x center`).toBeLessThanOrEqual(1.5);
  expect(delta.dy, `${label} icon y center`).toBeLessThanOrEqual(1.5);
}

test("icon-only buttons keep their icons optically centered", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await expectIconCentered(page, '[data-testid="hamburger-button"]', "hamburger");
  await expectIconCentered(page, '[data-testid="notification-button"]', "notification");
  await expectIconCentered(page, '[data-testid="profile-button"]', "profile");

  await page.getByRole("button", { name: /Krediye Çevir/ }).first().click();
  await expect(page.getByTestId("sheet-close-button")).toBeVisible();
  await expectIconCentered(page, '[data-testid="sheet-close-button"]', "sheet close");
  await page.getByTestId("sheet-close-button").click();
  await expect(page.getByTestId("sheet-close-button")).toHaveCount(0);

  await page.getByTestId("hamburger-button").click();
  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();
  await expectIconCentered(page, '[data-testid="sidebar-close"]', "drawer close");

  await page.goto("/#/profile");
  await waitForApp(page);
  await expectIconCentered(page, '[data-testid="back-button"]', "back");

  expect(errors).toEqual([]);
});
