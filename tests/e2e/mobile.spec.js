import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, routes, waitForApp } from "./helpers.js";

const viewports = [
  { width: 360, height: 780 },
  { width: 390, height: 844 },
  { width: 393, height: 852 },
  { width: 430, height: 932 },
];

for (const viewport of viewports) {
  for (const route of routes) {
    test(`mobile ${viewport.width}x${viewport.height} ${route}`, async ({ page }) => {
      const errors = await collectConsoleErrors(page);
      await page.setViewportSize(viewport);
      await page.goto(`/#${route}`);
      await waitForApp(page);
      await expect(page.locator("#bottomNav")).toBeVisible();
      await expectNoAppHorizontalOverflow(page);
      const twoLineLabels = await page.locator(".bottom-item > span").evaluateAll((labels) => (
        labels.filter((label) => label.getClientRects().length > 1).length
      ));
      expect(twoLineLabels).toBe(0);
      expect(errors).toEqual([]);
    });
  }
}
