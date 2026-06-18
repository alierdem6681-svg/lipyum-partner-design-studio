import { expect, test } from "@playwright/test";

test("V12-E Vue my-jobs route is intentionally blank and titled İşler", async ({ page }) => {
  await page.goto("/?engine=vue#/my-jobs");
  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByRole("heading", { name: "İşler" })).toBeVisible();
  await expect(page.getByTestId("my-jobs-page")).toBeVisible();
  await expect(page.locator('[data-testid="my-jobs-page"] .v-card')).toHaveCount(0);
  await expect(page.locator('[data-testid="my-jobs-page"] button')).toHaveCount(0);
});
