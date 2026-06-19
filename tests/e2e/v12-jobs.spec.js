import { expect, test } from "@playwright/test";

test("V12-E Vue jobs route is intentionally blank", async ({ page }) => {
  await page.goto("/?engine=vue#/jobs");
  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByRole("heading", { name: "İş Al" })).toBeVisible();
  await expect(page.getByTestId("jobs-page")).toBeVisible();
  await expect(page.locator('[data-testid="jobs-page"] .v-card')).toHaveCount(0);
  await expect(page.locator('[data-testid="jobs-page"] button')).toHaveCount(0);
});
