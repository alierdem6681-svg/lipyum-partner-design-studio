import { expect, test } from "@playwright/test";

const activeRoutes = [
  "/profile",
  "/notifications",
  "/support",
  "/support/live",
  "/messages",
  "/reviews",
  "/leaderboard",
  "/subscription",
  "/referral",
  "/partners",
  "/referral-earnings",
  "/job-referral",
  "/bonus",
  "/performance-score",
  "/customers",
  "/invoices",
  "/income-expense",
  "/appointment-link",
  "/partner-card-preview",
];

for (const route of activeRoutes) {
  test(`V12-F active route renders as Vue content route for ${route}`, async ({ page }) => {
    await page.goto(`/?engine=vue#${route}`);
    await expect(page.locator("[data-testid='app-header']")).toHaveCount(1);
    await expect(page.locator("[data-testid='app-bottom-bar']")).toHaveCount(1);
    await expect(page.locator("[data-testid='clickable-outcome-summary']")).toBeVisible();
    await expect(page.getByText("compatibility bridge")).toHaveCount(0);
  });
}
