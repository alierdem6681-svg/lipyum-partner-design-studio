import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("reviews filters and reply controls are interactive", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/reviews");
  await waitForApp(page);

  await expect(page.getByTestId("reviews-page")).toHaveCount(1);
  await page.locator('[data-review-filter="unanswered"]').click();
  await expect(page.locator('[data-review-filter="unanswered"]')).toHaveClass(/is-active/);
  await expect(page.getByTestId("review-card").first()).toBeVisible();
  await expect(page.getByTestId("review-reply-button").first()).toBeVisible();

  expect(errors).toEqual([]);
});

test("wallet load more reveals additional transaction cards", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/wallet");
  await waitForApp(page);

  await expect(page.getByTestId("wallet-page")).toHaveCount(1);
  const before = await page.getByTestId("wallet-transaction-card").count();
  await page.getByTestId("wallet-load-more").click();
  await expect.poll(() => page.getByTestId("wallet-transaction-card").count()).toBeGreaterThan(before);

  expect(errors).toEqual([]);
});

test("leaderboard selects and nearby rank window work", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/leaderboard");
  await waitForApp(page);

  await expect(page.getByTestId("leaderboard-page")).toHaveCount(1);
  await page.getByTestId("leaderboard-sector-select").selectOption("Klima Tamiri");
  await expect(page.getByTestId("leaderboard-sector-select")).toHaveValue("Klima Tamiri");
  await page.getByTestId("leaderboard-city-select").selectOption("Ankara");
  await expect(page.getByTestId("leaderboard-city-select")).toHaveValue("Ankara");
  await expect(page.getByTestId("leaderboard-rank-row")).toHaveCount(5);
  await expect(page.getByTestId("leaderboard-load-more")).toHaveCount(0);
  await expect(page.getByTestId("leaderboard-nearby-card")).not.toContainText("Sen SEN");
  await expect(page.getByTestId("leaderboard-nearby-card")).toContainText("#35");
  await expect(page.getByTestId("leaderboard-nearby-card")).toContainText("#39");

  expect(errors).toEqual([]);
});
