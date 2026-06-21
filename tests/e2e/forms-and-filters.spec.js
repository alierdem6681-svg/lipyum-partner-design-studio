import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("reviews filters, inline reply, report confirmation and lazy loading are interactive", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/reviews");
  await waitForApp(page);

  await expect(page.getByTestId("reviews-page")).toHaveCount(1);
  await expect(page.getByTestId("review-card")).toHaveCount(4);
  await expect(page.locator(".lazy-load-button")).toHaveCount(0);
  await expect(page.locator(".review-service-tag-v4")).toHaveCount(0);
  await expect(page.getByText("Klima Tamiri")).toHaveCount(0);
  await expect(page.getByText("Kombi Bakımı")).toHaveCount(0);
  await expect(page.locator(".review-summary-growth")).toContainText("+18 yorum");

  const filterState = await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('[data-testid="reviews-filter-chip"]'));
    const boxes = chips.map((chip) => chip.getBoundingClientRect());
    return {
      labels: chips.map((chip) => chip.textContent.trim().replace(/\s+/g, " ")),
      gaps: boxes.slice(1).map((box, index) => Math.round(box.left - boxes[index].right)),
      filterToListGap: Math.round(
        document.querySelector(".review-list-v4").getBoundingClientRect().top -
          document.querySelector(".reviews-filter-rail").getBoundingClientRect().bottom,
      ),
    };
  });
  expect(filterState.labels).toEqual(["Tümü", "Yanıtlanmamış", "5 Puan", "4 Puan", "3 Puan", "2 Puan", "1 Puan"]);
  expect(filterState.gaps.every((gap) => gap >= 8)).toBe(true);
  expect(filterState.filterToListGap).toBeGreaterThanOrEqual(10);

  await page.locator('[data-review-filter="unanswered"]').click();
  await expect(page.locator('[data-review-filter="unanswered"]')).toHaveClass(/is-active/);
  await expect(page.getByTestId("review-card").first()).toBeVisible();
  await page.getByTestId("review-reply-button").first().click();
  await expect(page.getByTestId("review-reply-editor")).toBeVisible();
  await page.getByTestId("review-reply-textarea").fill("Nazik geri bildiriminiz için teşekkür ederiz. Ekibimiz süreci takip ediyor.");
  await page.getByTestId("review-reply-submit").click();
  await expect(page.getByTestId("review-reply-editor")).toHaveCount(0);
  await page.locator('[data-review-filter="all"]').click();
  await expect(page.getByTestId("review-card").filter({ hasText: "Senin yanıtın" }).first()).toBeVisible();

  await page.getByTestId("review-report-button").first().click();
  await expect(page.getByTestId("onay-modal")).toBeVisible();
  await expect(page.getByTestId("onay-modal")).toContainText("Yorum bildirilsin mi?");
  await page.getByTestId("onay-modal-cancel").click();
  await expect(page.getByTestId("onay-modal")).toHaveCount(0);

  await page.locator('[data-review-filter="all"]').click();
  await page.getByTestId("reviews-load-sentinel").scrollIntoViewIfNeeded();
  await expect.poll(() => page.getByTestId("review-card").count()).toBeGreaterThan(4);

  await page.getByTestId("app-header").getByTestId("header-info-button").click();
  await expect(page.locator('[role="dialog"]')).toContainText("Müşteri yorumları");
  await expect(page.locator('[role="dialog"]')).toContainText("kısa, nazik ve çözüm odaklı");
  await expect(page.locator('[role="dialog"]')).toContainText("Daha fazla olumlu yorum");

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

test("leaderboard selects, spacing, rewards and score info follow the closed-week contract", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/leaderboard");
  await waitForApp(page);

  await expect(page.getByTestId("leaderboard-page")).toHaveCount(1);
  await expect(page.getByTestId("app-header")).toContainText("Liderlik Tablosu");
  await expect(page.getByTestId("app-header")).toContainText("8-14 Haziran 2026 haftası");
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
  await expect(page.getByTestId("leaderboard-hero-card")).not.toContainText("Bu haftaki");
  await expect(page.getByTestId("leaderboard-hero-card")).not.toContainText("İlk 20’ye çok yakınsın");
  await expect(page.getByTestId("leaderboard-hero-card")).not.toContainText("Düzenli iş takibi ve güçlü puan seni öne çıkarır");
  await expect(page.getByTestId("leaderboard-hero-card")).not.toContainText("sıra hedef");
  await expect(page.getByTestId("leaderboard-top-rankers-card")).not.toContainText("Haftanın vitrini");
  await expect(page.getByTestId("leaderboard-top-rankers-card")).not.toContainText("Haftanın lideri");
  await expect(page.getByTestId("leaderboard-top-rankers-card").locator("img")).toHaveCount(3);
  await expect(page.getByTestId("leaderboard-rewards-card")).toContainText("Haftalık ödül havuzu");
  await expect(page.getByTestId("leaderboard-rewards-card")).not.toContainText("Kazanılacak ödüller");
  await expect(page.getByTestId("leaderboard-rewards-card")).not.toContainText("Sıralamada yüksel, bonusu ve özel rozeti kap.");
  await expect(page.locator(".reward-path-rank")).toHaveCount(0);

  const leaderboardLayout = await page.evaluate(() => {
    const pageRoot = document.querySelector('[data-testid="leaderboard-page"]');
    const children = Array.from(pageRoot?.children || []);
    const gaps = children.slice(1).map((node, index) => {
      const previous = children[index].getBoundingClientRect();
      const current = node.getBoundingClientRect();
      return Math.round(current.top - previous.bottom);
    });
    const medalIssues = Array.from(document.querySelectorAll(".top-ranker")).map((node) => {
      const card = node.getBoundingClientRect();
      const medal = node.querySelector(".top-ranker-medal")?.getBoundingClientRect();
      return {
        visible: !!medal && medal.width >= 20 && medal.height >= 20,
        insideCard: !!medal && medal.left >= card.left && medal.top >= card.top && medal.right <= card.right && medal.bottom <= card.bottom,
      };
    });
    return { gaps, medalIssues };
  });
  expect(leaderboardLayout.gaps.every((gap) => gap >= 12)).toBe(true);
  expect(leaderboardLayout.medalIssues.every((item) => item.visible && item.insideCard)).toBe(true);

  await page.getByTestId("app-header").getByTestId("header-info-button").click();
  await expect(page.locator('[role="dialog"]')).toContainText("Liderlik tablosu");
  await expect(page.locator('[role="dialog"]')).toContainText("Haftanın Liderleri Nasıl Belirlenir?");
  await expect(page.getByTestId("info-score-list")).toBeVisible();
  await expect(page.getByTestId("info-score-item")).toHaveCount(6);
  await expect(page.locator('[role="dialog"]')).toContainText("Tamamlanan iş");
  await expect(page.locator('[role="dialog"]')).toContainText("+10 puan");
  await expect(page.locator('[role="dialog"]')).toContainText("Müşteri şikayeti");
  await expect(page.locator('[role="dialog"]')).toContainText("-5 puan");
  await expect(page.locator('[role="dialog"]')).toContainText("Bakiye durumu");
  await expect(page.locator('[role="dialog"]')).toContainText("Bakiye bitmesine rağmen 24 saatten uzun süre yüklenmediğinde");
  await expect(page.locator('[role="dialog"]')).toContainText("-10 puan");

  expect(errors).toEqual([]);
});
