import { expect, test } from "@playwright/test";

test("V12-E Vue calendar route is intentionally blank and titled Randevu", async ({ page }) => {
  await page.goto("/?engine=vue#/calendar");
  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Randevu" })).toBeVisible();
  await expect(page.getByTestId("calendar-page")).toBeVisible();
  await expect(page.locator('[data-testid="calendar-page"] .v-card')).toHaveCount(0);
  await expect(page.locator('[data-testid="calendar-page"] button')).toHaveCount(0);
});
