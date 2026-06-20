import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

async function scrollNotificationsToBottom(page) {
  await page.locator("#appRoot").evaluate((root) => {
    root.scrollTop = root.scrollHeight;
  });
}

test("notifications actions sit directly under the header and keep settings navigation", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/notifications");
  await waitForApp(page);

  const header = page.getByTestId("app-header");
  const actions = page.locator(".notification-actions-bar");
  const settingsButton = actions.getByTestId("notification-settings-button");

  await expect(actions).toBeVisible();
  await expect(page.getByTestId("notifications-filter-all")).toBeVisible();
  await expect(page.getByTestId("notifications-mark-read")).toBeVisible();
  await expect(page.getByTestId("notifications-clear-all")).toBeVisible();
  await expect(settingsButton).toBeVisible();
  await expect(settingsButton.locator("span")).toHaveCount(0);

  const gap = await page.evaluate(() => {
    const headerRect = document.querySelector('[data-testid="app-header"]')?.getBoundingClientRect();
    const actionsRect = document.querySelector(".notification-actions-bar")?.getBoundingClientRect();
    if (!headerRect || !actionsRect) return Number.POSITIVE_INFINITY;
    return actionsRect.top - headerRect.bottom;
  });
  expect(gap).toBeLessThanOrEqual(14);

  await settingsButton.click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/notification-settings");
  await expect(page.getByTestId("app-header")).toBeVisible();

  expect(errors).toEqual([]);
});

test("notifications use 15 default items with lazy loading and list actions", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/notifications");
  await waitForApp(page);

  await expect(page.getByTestId("notification-card")).toHaveCount(5);

  await scrollNotificationsToBottom(page);
  await expect(page.getByTestId("notification-card")).toHaveCount(5);

  await page.getByTestId("notifications-filter-all").click();
  await expect.poll(() => page.getByTestId("notification-card").count()).toBeGreaterThanOrEqual(7);
  await expect.poll(() => page.getByTestId("notification-card").count()).toBeLessThan(15);

  for (let index = 0; index < 4; index += 1) {
    await scrollNotificationsToBottom(page);
    await page.waitForTimeout(120);
  }
  await expect(page.getByTestId("notification-card")).toHaveCount(15);

  await page.getByTestId("notifications-mark-read").click();
  await page.getByTestId("notifications-filter-all").click();
  await expect(page.getByTestId("notification-card")).toHaveCount(0);
  await expect(page.locator(".notification-empty")).toBeVisible();

  await page.getByTestId("notifications-filter-all").click();
  await expect.poll(() => page.getByTestId("notification-card").count()).toBeGreaterThanOrEqual(7);
  await expect.poll(() => page.getByTestId("notification-card").count()).toBeLessThan(15);
  await page.getByTestId("notifications-clear-all").click();
  await expect(page.getByTestId("notification-card")).toHaveCount(0);
  await expect(page.locator(".notification-empty")).toBeVisible();

  expect(errors).toEqual([]);
});
