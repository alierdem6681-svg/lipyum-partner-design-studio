import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

async function scrollNotificationsToBottom(page) {
  await page.locator("#appRoot").evaluate((root) => {
    root.scrollTop = root.scrollHeight;
  });
}

test("notifications use wide filter pills and header settings navigation", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/notifications");
  await waitForApp(page);

  const header = page.getByTestId("app-header");
  const actions = page.locator(".notification-actions-bar");
  const headerSettingsButton = header.getByTestId("notification-settings-button");
  const pills = page.getByTestId("notifications-filter-pill");

  await expect(actions).toBeVisible();
  await expect(pills).toHaveCount(3);
  await expect(pills.nth(0)).toHaveText("Tümü");
  await expect(pills.nth(1)).toHaveText("Okunanlar");
  await expect(pills.nth(2)).toHaveText("Okunmayanlar");
  await expect(actions.getByTestId("notification-settings-button")).toHaveCount(0);
  await expect(headerSettingsButton).toBeVisible();

  const geometry = await page.evaluate(() => {
    const headerRect = document.querySelector('[data-testid="app-header"]')?.getBoundingClientRect();
    const actionsRect = document.querySelector(".notification-actions-bar")?.getBoundingClientRect();
    const pills = Array.from(document.querySelectorAll('[data-testid="notifications-filter-pill"]')).map((button) => ({
      text: button.textContent.trim(),
      width: button.getBoundingClientRect().width,
      scrollWidth: button.scrollWidth,
      clientWidth: button.clientWidth,
    }));
    return {
      gap: actionsRect && headerRect ? actionsRect.top - headerRect.bottom : 999,
      pills,
      overflow: document.querySelector("#appRoot").scrollWidth - document.querySelector("#appRoot").clientWidth,
    };
  });
  expect(geometry.gap).toBeLessThanOrEqual(14);
  expect(geometry.overflow).toBeLessThanOrEqual(1);
  expect(geometry.pills.every((pill) => pill.scrollWidth <= pill.clientWidth + 1)).toBeTruthy();

  await headerSettingsButton.click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/notification-settings");
  await expect(page.getByTestId("notification-settings-page")).toBeVisible();

  expect(errors).toEqual([]);
});

test("notifications filter all read and unread items with lazy loading", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/notifications");
  await waitForApp(page);

  await expect(page.getByTestId("notifications-filter-pill").nth(0)).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => page.getByTestId("notification-card").count()).toBeGreaterThanOrEqual(7);
  await expect.poll(() => page.getByTestId("notification-card").count()).toBeLessThan(15);

  for (let index = 0; index < 4; index += 1) {
    await scrollNotificationsToBottom(page);
    await page.waitForTimeout(120);
  }
  await expect(page.getByTestId("notification-card")).toHaveCount(15);

  await page.getByTestId("notifications-filter-pill").nth(2).click();
  await expect(page.getByTestId("notification-card")).toHaveCount(5);

  await page.getByTestId("notifications-filter-pill").nth(1).click();
  await expect.poll(() => page.getByTestId("notification-card").count()).toBeGreaterThanOrEqual(7);
  await expect.poll(() => page.getByTestId("notification-card").count()).toBeLessThanOrEqual(10);

  expect(errors).toEqual([]);
});

test("notification settings expose switchers and locked notification types", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/notification-settings");
  await waitForApp(page);

  await expect(page.getByTestId("notification-settings-page")).toBeVisible();
  await expect(page.getByTestId("notification-setting-row")).toHaveCount(10);
  await expect(page.getByTestId("notification-setting-switch")).toHaveCount(10);

  await expect(page.locator('[data-setting-id="new-job"]')).toContainText("Yeni iş bildirimi");
  await expect(page.locator('[data-setting-id="new-job"]')).toContainText("(kapatılamaz)");
  await expect(page.locator('[data-setting-id="new-job"] [data-testid="notification-setting-switch"]')).toBeDisabled();
  await expect(page.locator('[data-setting-id="balance-end"]')).toContainText("Bakiye bitişi");
  await expect(page.locator('[data-setting-id="balance-end"]')).toContainText("(kapatılamaz)");
  await expect(page.locator('[data-setting-id="balance-end"] [data-testid="notification-setting-switch"]')).toBeDisabled();

  const leaderboardSwitch = page.locator('[data-setting-id="leaderboard"] [data-testid="notification-setting-switch"]');
  await expect(leaderboardSwitch).toHaveAttribute("aria-checked", "false");
  await leaderboardSwitch.click();
  await expect(leaderboardSwitch).toHaveAttribute("aria-checked", "true");

  const labelsOverflow = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".notification-setting-copy strong")).some(
      (node) => node.scrollWidth > node.clientWidth + 1,
    ),
  );
  expect(labelsOverflow).toBeFalsy();
  expect(errors).toEqual([]);
});
