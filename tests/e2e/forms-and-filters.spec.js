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
    const rail = document.querySelector('[data-testid="reviews-filter-chips"]');
    const chips = Array.from(document.querySelectorAll('[data-testid="reviews-filter-chip"]'));
    const boxes = chips.map((chip) => chip.getBoundingClientRect());
    return {
      hasSharedRail: rail?.classList.contains("filter-chip-rail"),
      labels: chips.map((chip) => chip.textContent.trim().replace(/\s+/g, " ")),
      gaps: boxes.slice(1).map((box, index) => Math.round(box.left - boxes[index].right)),
      filterToListGap: Math.round(
        document.querySelector(".review-list-v4").getBoundingClientRect().top -
          rail.getBoundingClientRect().bottom,
      ),
    };
  });
  expect(filterState.hasSharedRail).toBe(true);
  expect(filterState.labels).toEqual(["Tümü", "Yanıtlanmamış", "5 Puan", "4 Puan", "3 Puan", "2 Puan", "1 Puan"]);
  expect(filterState.gaps.every((gap) => gap >= 8)).toBe(true);
  expect(filterState.filterToListGap).toBeGreaterThanOrEqual(10);
  await expect(page.locator('[data-testid="reviews-filter-chip"] .filter-chip-dot')).toHaveCount(0);

  await expect(page.getByTestId("review-card").first()).toContainText("Elif Yılmaz");
  const firstCardActionState = await page.getByTestId("review-card").first().evaluate((card) => {
    const report = card.querySelector('[data-testid="review-report-button"]')?.getBoundingClientRect();
    const reply = card.querySelector('[data-testid="review-reply-button"]')?.getBoundingClientRect();
    const name = card.querySelector(".review-card-head strong")?.getBoundingClientRect();
    const date = card.querySelector(".review-card-actions small")?.getBoundingClientRect();
    return {
      reportLeft: Math.round(report?.left || 0),
      replyLeft: Math.round(reply?.left || 0),
      centerDelta: Math.abs(Math.round((report?.top || 0) + (report?.height || 0) / 2 - ((reply?.top || 0) + (reply?.height || 0) / 2))),
      dateNameTopDelta: Math.abs(Math.round((date?.top || 0) - (name?.top || 0))),
    };
  });
  expect(firstCardActionState.reportLeft).toBeLessThan(firstCardActionState.replyLeft);
  expect(firstCardActionState.centerDelta).toBeLessThanOrEqual(1);
  expect(firstCardActionState.dateNameTopDelta).toBeLessThanOrEqual(2);

  const satisfactionGaugeState = await page.evaluate(() => {
    const meter = document.querySelector(".review-summary-meter");
    const unit = meter?.querySelector("small")?.textContent?.trim();
    const value = meter?.querySelector("strong")?.textContent?.trim();
    const box = meter?.getBoundingClientRect();
    return { value, unit, width: Math.round(box?.width || 0), height: Math.round(box?.height || 0) };
  });
  expect(satisfactionGaugeState.value).toBe("92");
  expect(satisfactionGaugeState.unit).toBe("puan");
  expect(satisfactionGaugeState.width).toBeGreaterThanOrEqual(96);
  expect(satisfactionGaugeState.height).toBeGreaterThanOrEqual(96);

  const repliedCard = page.getByTestId("review-card").filter({ hasText: "Murat Kaya" });
  await expect(repliedCard.getByTestId("review-reply-button")).toHaveCount(0);
  await expect(repliedCard.getByTestId("review-report-button")).toHaveCount(0);
  await expect(repliedCard.locator(".review-replied-pill")).toHaveCount(0);
  await expect(repliedCard.getByTestId("review-edit-reply-button")).toBeVisible();
  await expect(repliedCard.getByTestId("review-edit-reply-button")).not.toContainText("Düzenle");
  await repliedCard.getByTestId("review-edit-reply-button").click();
  await expect(repliedCard.getByTestId("review-reply-editor")).toBeVisible();
  await expect(repliedCard.getByTestId("review-reply-textarea")).toHaveValue(/Geri bildiriminiz/);
  await repliedCard.getByTestId("review-reply-textarea").fill("Geri bildiriminiz için teşekkür ederiz. Ekibimiz not aldı.");
  await repliedCard.getByTestId("review-reply-submit").click();
  await expect(repliedCard.getByText("Ekibimiz not aldı.")).toBeVisible();
  await expect(repliedCard.getByTestId("review-edit-reply-button")).toBeVisible();

  await page.locator('[data-filter="unanswered"]').click();
  await expect(page.locator('[data-filter="unanswered"]')).toHaveClass(/is-active/);
  await expect(page.getByTestId("review-card").first()).toBeVisible();
  await page.getByTestId("review-reply-button").first().click();
  await expect(page.getByTestId("review-reply-editor")).toBeVisible();
  await page.getByTestId("review-reply-textarea").fill("Nazik geri bildiriminiz için teşekkür ederiz. Ekibimiz süreci takip ediyor.");
  await page.getByTestId("review-reply-submit").click();
  await expect(page.getByTestId("review-reply-editor")).toHaveCount(0);
  await page.locator('[data-filter="all"]').click();
  await expect(page.getByTestId("review-card").filter({ hasText: "Senin yanıtın" }).first()).toBeVisible();

  await page.getByTestId("review-report-button").first().click();
  await expect(page.getByTestId("onay-modal")).toBeVisible();
  await expect(page.getByTestId("onay-modal")).toContainText("Yorum bildirilsin mi?");
  await page.getByTestId("onay-modal-cancel").click();
  await expect(page.getByTestId("onay-modal")).toHaveCount(0);

  await page.locator('[data-filter="all"]').click();
  await page.getByTestId("reviews-load-sentinel").scrollIntoViewIfNeeded();
  await expect.poll(() => page.getByTestId("review-card").count()).toBeGreaterThan(4);

  await page.getByTestId("app-header").getByTestId("header-info-button").click();
  await expect(page.locator('[role="dialog"]')).toContainText("Müşteri yorumları");
  await expect(page.locator('[role="dialog"]')).toContainText("Hızlı yanıt, daha güçlü güven.");
  await expect(page.getByTestId("info-score-item")).toHaveCount(4);
  await expect(page.locator('[role="dialog"]')).toContainText("Kısa yaz");
  await expect(page.locator('[role="dialog"]')).toContainText("Nazik kal");
  await expect(page.locator('[role="dialog"]')).toContainText("İyi yorumu büyüt");
  await expect(page.locator('[role="dialog"]')).toContainText("Uzun açıklama yerine net ve sakin yanıt kullan.");

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
  await expect(page.getByTestId("leaderboard-top-rankers-league")).toHaveText("Kombi Servisi Ligi");
  await page.getByTestId("leaderboard-city-select").selectOption("Kayseri");
  await expect(page.getByTestId("leaderboard-city-select")).toHaveValue("Kayseri");
  await expect(page.getByTestId("leaderboard-sector-select")).toHaveValue("");
  await expect(page.getByTestId("leaderboard-top-rankers-league")).toHaveText("Kayseri Ligi");
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
  await expect(page.getByTestId("leaderboard-top-rankers-card")).toContainText("₺3.000");
  await expect(page.getByTestId("leaderboard-top-rankers-card")).toContainText("₺1.000");
  await expect(page.getByTestId("leaderboard-rewards-card")).toContainText("Haftalık ödül havuzu");
  await expect(page.getByTestId("leaderboard-rewards-card")).toContainText("₺11.000 Bonus");
  await expect(page.getByTestId("leaderboard-rewards-card")).toContainText("₺3.000 Bonus");
  await expect(page.getByTestId("leaderboard-rewards-card")).toContainText("₺1.000 Bonus");
  await expect(page.getByTestId("leaderboard-rewards-card")).toContainText("₺500 Bonus");
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
    const topRankersIndex = children.findIndex((node) => node.getAttribute("data-testid") === "leaderboard-top-rankers-card");
    const heroIndex = children.findIndex((node) => node.getAttribute("data-testid") === "leaderboard-hero-card");
    return { gaps, medalIssues, topRankersIndex, heroIndex };
  });
  expect(leaderboardLayout.gaps.every((gap) => gap >= 12)).toBe(true);
  expect(leaderboardLayout.medalIssues.every((item) => item.visible && item.insideCard)).toBe(true);
  expect(leaderboardLayout.topRankersIndex).toBe(1);
  expect(leaderboardLayout.heroIndex).toBe(2);

  await page.getByTestId("app-header").getByTestId("header-info-button").click();
  await expect(page.locator('[role="dialog"]')).toContainText("Liderlik tablosu");
  await expect(page.locator('[role="dialog"]')).toContainText("Haftanın Liderleri Nasıl Belirlenir?");
  const sheetMetrics = await page.getByTestId("app-sheet").evaluate((sheet) => {
    const sheetBox = sheet.getBoundingClientRect();
    const body = sheet.querySelector(".v-app-sheet__body");
    const bodyStyle = body ? window.getComputedStyle(body) : null;
    return {
      height: Math.round(sheetBox.height),
      bottomGap: Math.round(window.innerHeight - sheetBox.bottom),
      bodyScrollHeight: body?.scrollHeight || 0,
      bodyClientHeight: body?.clientHeight || 0,
      scrollbarWidth: bodyStyle?.scrollbarWidth,
    };
  });
  expect(sheetMetrics.height).toBeGreaterThanOrEqual(720);
  expect(sheetMetrics.bottomGap).toBeLessThanOrEqual(1);
  expect(sheetMetrics.bodyScrollHeight).toBeLessThanOrEqual(sheetMetrics.bodyClientHeight + 1);
  expect(sheetMetrics.scrollbarWidth).toBe("none");
  const sheetBodyStyle = await page.getByTestId("app-sheet").locator(".v-app-sheet__body").evaluate((node) => {
    const style = window.getComputedStyle(node);
    return { scrollbarWidth: style.scrollbarWidth, msOverflowStyle: style.msOverflowStyle };
  });
  expect(sheetBodyStyle.scrollbarWidth).toBe("none");
  await expect(page.getByTestId("info-score-list")).toBeVisible();
  await expect(page.getByTestId("info-score-item")).toHaveCount(6);
  await expect(page.locator('[role="dialog"]')).toContainText("Tamamlanan iş");
  await expect(page.locator('[role="dialog"]')).toContainText("+10 puan");
  await expect(page.locator('[role="dialog"]')).toContainText("Müşteri şikayeti");
  await expect(page.locator('[role="dialog"]')).toContainText("-5 puan");
  await expect(page.locator('[role="dialog"]')).toContainText("Bakiye durumu");
  await expect(page.locator('[role="dialog"]')).toContainText("Bakiye bitmesine rağmen 24 saatten uzun süre yüklenmediğinde");
  await expect(page.locator('[role="dialog"]')).toContainText("-10 puan");
  await page.getByTestId("app-sheet-overlay").click({ position: { x: 8, y: 8 } });
  await expect(page.getByTestId("app-sheet")).toHaveCount(0);

  expect(errors).toEqual([]);
});
