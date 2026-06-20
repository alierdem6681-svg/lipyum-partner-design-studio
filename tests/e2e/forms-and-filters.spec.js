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

test("wallet follows V12-E blank route scope", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/wallet");
  await waitForApp(page);

  const main = page.getByTestId("wallet-page");
  await expect(main).toHaveCount(1);
  await expect(main).toBeVisible();
  await expect(main.locator(".card, .filter-chip, [data-testid='wallet-transaction-card']")).toHaveCount(0);
  await expect(main.getByRole("button")).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("leaderboard selects and nearby rank window work", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/leaderboard");
  await waitForApp(page);

  await expect(page.getByTestId("leaderboard-page")).toHaveCount(1);
  await expect(page.getByTestId("leaderboard-sector-select")).toHaveValue("Beyaz Eşya Tamiri");
  await expect(page.getByTestId("leaderboard-city-select")).toHaveValue("");
  await page.getByTestId("leaderboard-sector-select").selectOption("Klima Tamiri");
  await expect(page.getByTestId("leaderboard-sector-select")).toHaveValue("Klima Tamiri");
  await expect(page.getByTestId("leaderboard-city-select")).toHaveValue("");
  await page.getByTestId("leaderboard-city-select").selectOption("Ankara");
  await expect(page.getByTestId("leaderboard-city-select")).toHaveValue("Ankara");
  await expect(page.getByTestId("leaderboard-sector-select")).toHaveValue("");
  await expect(page.getByTestId("leaderboard-sector-select")).toContainText("Sektör Ligi");
  await page.getByTestId("leaderboard-sector-select").selectOption("Kombi Servisi");
  await expect(page.getByTestId("leaderboard-sector-select")).toHaveValue("Kombi Servisi");
  await expect(page.getByTestId("leaderboard-city-select")).toHaveValue("");
  await expect(page.getByTestId("leaderboard-city-select")).toContainText("Şehir Ligi");
  await expect(page.getByTestId("leaderboard-rank-row")).toHaveCount(5);
  await expect(page.getByTestId("leaderboard-load-more")).toHaveCount(0);
  await expect(page.getByTestId("leaderboard-nearby-card")).not.toContainText("Sen SEN");
  await expect(page.getByTestId("leaderboard-nearby-card")).toContainText("#35");
  await expect(page.getByTestId("leaderboard-nearby-card")).toContainText("#39");
  await expect(page.getByTestId("leaderboard-hero-card")).not.toContainText("2 güçlü iş daha seni vitrine taşır");
  await expect(page.getByTestId("leaderboard-hero-card")).not.toContainText("sıra hedef");
  await expect(page.getByTestId("leaderboard-top-rankers-card")).not.toContainText("Haftanın vitrini");
  await expect(page.getByTestId("leaderboard-top-rankers-card")).not.toContainText("Haftanın lideri");
  await expect(page.getByTestId("leaderboard-top-rankers-card").locator("img")).toHaveCount(3);
  await expect(page.getByTestId("leaderboard-rewards-card")).toContainText("Haftalık ödül havuzu");
  await expect(page.getByTestId("leaderboard-rewards-card")).not.toContainText("Sıralamada yüksel, bonusu ve özel rozeti kap.");

  await page.getByTestId("app-header").getByTestId("header-info-button").click();
  await expect(page.locator('[role="dialog"]')).toContainText("Liderlik tablosu");
  await expect(page.locator('[role="dialog"]')).toContainText("Haftanın Liderleri Nasıl Belirlenir?");
  await expect(page.getByTestId("info-score-list")).toBeVisible();
  await expect(page.getByTestId("info-score-item")).toHaveCount(5);
  await expect(page.locator('[role="dialog"]')).toContainText("Tamamlanan iş");
  await expect(page.locator('[role="dialog"]')).toContainText("+10 puan");
  await expect(page.locator('[role="dialog"]')).toContainText("Müşteri şikayeti");
  await expect(page.locator('[role="dialog"]')).toContainText("-5 puan");

  expect(errors).toEqual([]);
});
