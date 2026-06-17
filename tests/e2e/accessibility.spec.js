import { expect, test } from "@playwright/test";
import { routes, waitForApp } from "./helpers.js";

test("core navigation controls expose accessible names", async ({ page }) => {
  await page.goto("/#/profile");
  await waitForApp(page);
  await expect(page.locator('[data-action="go-back"][aria-label="Geri dön"]').first()).toBeVisible();
  await expect(page.locator('[aria-label="İş Al"]').first()).toBeVisible();
});

test("bottom active tab exposes aria-current", async ({ page }) => {
  await page.goto("/#/home");
  await waitForApp(page);
  await expect(page.locator("#bottomNav [aria-current='page']")).toHaveCount(1);
});

for (const route of routes.slice(0, 6)) {
  test(`touch targets ${route}`, async ({ page }) => {
    await page.goto(`/#${route}`);
    await waitForApp(page);
    const tooSmall = await page.locator("button").evaluateAll((buttons) => buttons
      .filter((button) => {
        const rect = button.getBoundingClientRect();
        const visible = rect.width > 0 && rect.height > 0;
        return visible && (rect.width < 34 || rect.height < 34);
      })
      .map((button) => button.outerHTML.slice(0, 120)));
    expect(tooSmall).toEqual([]);
  });
}
