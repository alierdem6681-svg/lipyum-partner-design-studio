import { expect, test } from "@playwright/test";
import { collectConsoleErrors, criticalRoutes, waitForApp } from "./helpers.js";

test("V10 headers are visible, stable and keep a right-side action slot", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  const heights = [];

  for (const route of criticalRoutes) {
    await page.goto(`/#${route}`);
    await waitForApp(page);
    const header = page.getByTestId("app-header");
    await expect(header, `${route} header`).toBeVisible();

    const audit = await header.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const rightAction = element.querySelector('[data-testid="notification-button"], [data-testid="header-info-button"], [data-testid="profile-button"], [data-testid="notification-options-button"], [data-testid="notification-settings-button"], [data-testid="wallet-info-button"], .header-actions button, .page-header-action, .icon-btn[data-action]');
      const title = element.querySelector("h1, h2");
      const titleStyle = title ? window.getComputedStyle(title) : null;
      const titleLineHeight = titleStyle ? (parseFloat(titleStyle.lineHeight) || parseFloat(titleStyle.fontSize) * 1.2) : 0;
      return {
        height: Math.round(box.height),
        rightAction: Boolean(rightAction),
        titleWrapped: title ? title.getBoundingClientRect().height > titleLineHeight * 1.45 : false,
      };
    });

    expect(audit.height, `${route} header height`).toBeGreaterThanOrEqual(50);
    expect(audit.height, `${route} header height`).toBeLessThanOrEqual(112);
    expect(audit.rightAction, `${route} right action`).toBeTruthy();
    expect(audit.titleWrapped, `${route} title wrapping`).toBeFalsy();
    heights.push(audit.height);
  }

  expect(Math.max(...heights) - Math.min(...heights), "header height spread").toBeLessThanOrEqual(54);
  expect(errors).toEqual([]);
});
