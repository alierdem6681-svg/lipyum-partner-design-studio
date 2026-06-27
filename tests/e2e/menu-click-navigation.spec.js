import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("profile menu shortcuts navigate to their pages", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  await page.goto("/#/profile");
  await waitForApp(page);
  await page.getByTestId("profile-menu-strength-summary").click();

  await page.locator('[data-testid="profile-menu-card"][data-route="/verifications"]').click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/verifications");

  await page.goto("/#/profile");
  await waitForApp(page);
  await page.getByTestId("profile-menu-strength-summary").click();

  await page.locator('[data-testid="profile-menu-card"][data-route="/photo-gallery"]').click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/photo-gallery");

  await page.goto("/#/profile");
  await waitForApp(page);
  await page.getByTestId("profile-menu-strength-summary").click();
  await page.locator('[data-testid="profile-menu-card"][data-route="/services"]').click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/services");

  expect(errors).toEqual([]);
});

test("regions page renders route icons", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  await page.goto("/#/regions");
  await waitForApp(page);

  await expect(page.locator(".v-section-title")).toContainText("Aktif bölgeler");
  await expect(page.locator(".v-content-list-item__icon .v-icon")).toHaveCount(3);

  expect(errors).toEqual([]);
});

test("drawer partner referral shortcut navigates to referral page", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  await page.goto("/#/home");
  await waitForApp(page);
  await page.getByTestId("hamburger-button").click();
  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();

  await page.locator('[data-testid="sidebar-menu-item"][data-route="/referral"]').click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/referral");

  expect(errors).toEqual([]);
});
