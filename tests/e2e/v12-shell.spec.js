import { expect, test } from "@playwright/test";

const routes = ["/home", "/jobs", "/my-jobs", "/calendar"];

for (const route of routes) {
  test(`V12 shell has one header, one bottom bar and no horizontal overflow on ${route}`, async ({ page }) => {
    await page.goto(`/?engine=vue#${route}`);
    await expect(page.locator(".phone-screen")).toBeVisible();
    await expect(page.locator("#appRoot")).toBeVisible();
    await expect(page.locator("[data-testid='app-header']")).toHaveCount(1);
    await expect(page.locator("[data-testid='app-bottom-bar']")).toHaveCount(1);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow).toBe(false);
  });
}

test("V12 drawer opens and closes from the shared AppHeader", async ({ page }) => {
  await page.goto("/?engine=vue#/home");
  await page.getByTestId("hamburger-button").click();
  await expect(page.getByRole("dialog", { name: "Lipyum Partner" })).toBeVisible();
  await page.getByLabel("Kapat").click();
  await expect(page.getByRole("dialog", { name: "Lipyum Partner" })).toBeHidden();
});

