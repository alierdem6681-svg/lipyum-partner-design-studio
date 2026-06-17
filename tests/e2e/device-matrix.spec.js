import { expect, test } from "@playwright/test";
import { collectConsoleErrors, criticalRoutes, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

test.describe.configure({ timeout: 120_000 });

const devices = [
  { name: "iphone-se", width: 320, height: 568 },
  { name: "iphone-mini", width: 375, height: 812 },
  { name: "iphone-15", width: 393, height: 852 },
  { name: "iphone-pro-max", width: 430, height: 932 },
  { name: "pixel-compact", width: 360, height: 780 },
  { name: "pixel-large", width: 412, height: 915 },
  { name: "tablet", width: 768, height: 1024 },
];

for (const device of devices) {
  test(`device matrix ${device.name}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.setViewportSize({ width: device.width, height: device.height });

    for (const route of criticalRoutes) {
      await page.goto(`/#${route}`);
      await waitForApp(page);
      await expect(page.getByTestId("app-header").first()).toBeVisible();
      await expect(page.getByTestId("app-bottom-bar").first()).toBeVisible();
      await expectNoAppHorizontalOverflow(page);

      const headerBox = await page.getByTestId("app-header").first().boundingBox();
      expect(headerBox, `${route} header box`).toBeTruthy();
      expect(headerBox.height, `${route} header height on ${device.name}`).toBeGreaterThanOrEqual(44);

      const wrappedButtons = await page.locator("button").evaluateAll((buttons) => buttons
        .filter((button) => {
          const text = (button.textContent || "").trim();
          const rect = button.getBoundingClientRect();
          return text && rect.width > 0 && rect.height > 0 && button.getClientRects().length > 1;
        })
        .map((button) => button.textContent.trim()));
      expect(wrappedButtons).toEqual([]);
    }

    expect(errors).toEqual([]);
  });
}
