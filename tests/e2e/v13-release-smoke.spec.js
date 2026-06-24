import { expect, test } from "@playwright/test";
import { bottomBarHiddenRoutes, collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const criticalRoutes = [
  ["/home", "home-performance-card"],
  ["/profile", "profile-page"],
  ["/notifications", "notifications-page"],
  ["/support/new", "support-ticket-page"],
  ["/support/live", "live-support-page"],
  ["/reviews", "reviews-page"],
  ["/leaderboard", "leaderboard-page"],
  ["/subscription", "subscription-page"],
  ["/performance-score", "performance-score-flow-page"],
  ["/referral", "referral-page"],
  ["/partner-card-preview", "partner-card-preview-page"],
  ["/wallet", "wallet-page"],
];

const blankRoutes = [
  ["/jobs", "jobs-page", "bottom-cta-job"],
  ["/my-jobs", "my-jobs-page", "bottom-tab-jobs"],
  ["/calendar", "calendar-page", "bottom-tab-calendar"],
];

const retiredRoutes = ["/packages", "/package-builder", "/package-checkout", "/partner/packages"];

async function expectVueShell(page, route = "/home") {
  await waitForApp(page);
  await expect(page.locator("html")).toHaveAttribute("data-runtime", "vue");
  await expect(page.getByTestId("app-header")).toBeVisible();
  if (bottomBarHiddenRoutes.has(route)) {
    await expect(page.getByTestId("app-bottom-bar")).toHaveCount(0);
  } else {
    await expect(page.getByTestId("app-bottom-bar")).toBeVisible();
  }
  await expectNoAppHorizontalOverflow(page);
}

test("boots Vue on normal URLs and does not expose legacy rollback", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/");
  await expectVueShell(page, "/home");
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#/home");

  await page.goto("/#/home");
  await expectVueShell(page, "/home");

  await page.goto("/?engine=vue#/home");
  await expectVueShell(page, "/home");

  await page.goto("/?engine=legacy#/home");
  await expectVueShell(page, "/home");
  expect(errors).toEqual([]);
});

for (const [route, testId] of criticalRoutes) {
  test(`critical route opens in final Vue runtime: ${route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await expectVueShell(page, route);
    await expect(page.getByTestId(testId)).toBeVisible();
    expect(errors).toEqual([]);
  });
}

for (const [route, testId, activeTab] of blankRoutes) {
  test(`blank bottom route remains empty: ${route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await expectVueShell(page, route);
    await expect(page.getByTestId(testId)).toBeVisible();
    await expect(page.getByTestId(activeTab)).toHaveAttribute("aria-current", "page");
    await expect(page.getByTestId(testId).locator("> *")).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

test("home and bottom routes share the same shell geometry", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  async function readShell(route) {
    await page.goto(`/#${route}`);
    await expectVueShell(page, route);
    return page.evaluate(() => {
      const box = (selector) => {
        const node = document.querySelector(selector);
        const rect = node?.getBoundingClientRect();
        return rect
          ? {
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            }
          : null;
      };
      const ctaStyle = getComputedStyle(document.querySelector('[data-testid="bottom-cta-job"] .cta-lightning-wrap'));
      const ctaButton = document.querySelector('[data-testid="bottom-cta-job"]')?.getBoundingClientRect();
      const bottom = document.querySelector('[data-testid="app-bottom-bar"]')?.getBoundingClientRect();
      return {
        header: box('[data-testid="app-header"]'),
        hamburger: box('[data-testid="hamburger-button"]'),
        notification: box('[data-testid="app-header"] [data-testid="notification-button"], [data-testid="app-header"] [data-testid="wallet-info-button"], [data-testid="app-header"] [data-testid="account-transactions-header-button"]'),
        profile: box('[data-testid="profile-button"]'),
        cta: box('[data-testid="bottom-cta-job"] .cta-lightning-wrap'),
        ctaRadius: ctaStyle.borderRadius,
        ctaCenterDelta: Math.abs((ctaButton.left + ctaButton.width / 2) - (bottom.left + bottom.width / 2)),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
  }

  const home = await readShell("/home");
  const routes = ["/my-jobs", "/calendar", "/wallet"];

  for (const route of routes) {
    const current = await readShell(route);
    expect(current.header, `${route} header`).toEqual(home.header);
    expect(current.hamburger, `${route} hamburger`).toEqual(home.hamburger);
    expect(current.cta, `${route} CTA`).toEqual(home.cta);
    expect(current.ctaRadius, `${route} CTA radius`).toBe(home.ctaRadius);
    expect(current.ctaCenterDelta, `${route} CTA center`).toBeLessThanOrEqual(1);
    expect(current.overflow, `${route} overflow`).toBeLessThanOrEqual(1);
  }

  expect(errors).toEqual([]);
});

for (const route of retiredRoutes) {
  test(`retired package route redirects to subscription: ${route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await expectVueShell(page, "/subscription");
    await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/subscription");
    await expect(page.getByTestId("subscription-page")).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("partner card preview uses share button and channel options", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/partner-card-preview");
  await expectVueShell(page, "/partner-card-preview");

  await expect(page.getByTestId("partner-card-preview-page")).toBeVisible();
  await expect(page.getByTestId("app-header")).toContainText("Profil Kartı");
  await expect(page.getByTestId("app-header")).toContainText("Bilgiler, rozetler ve daha fazlası");
  await expect(page.getByTestId("app-bottom-bar")).toHaveCount(0);
  await expect(page.getByTestId("partner-embed-panel")).toHaveCount(0);
  await expect(page.getByTestId("partner-share-options")).toHaveCount(0);
  await expect(page.getByTestId("partner-preview-share-button")).toHaveCount(0);
  await expect(page.getByTestId("partner-preview-header-share")).toBeVisible();
  await expect(page.getByTestId("partner-share-button")).toHaveCount(0);
  await expect(page.getByTestId("partner-preview-button")).toHaveCount(0);
  await expect(page.getByTestId("profile-badge-more")).toHaveCount(0);
  await expect(page.getByTestId("partner-public-metrics")).toBeVisible();
  await expect(page.getByTestId("partner-public-metric-response")).toContainText("Yanıt Süresi");
  await expect(page.getByTestId("partner-public-metric-response")).toContainText("Genelde <2 dk");
  await expect(page.getByTestId("partner-public-metric-jobs")).toContainText("İş Sayısı");
  await expect(page.getByTestId("partner-public-metric-jobs")).toContainText("428");
  await expect(page.getByTestId("partner-preview-service-summary")).toBeVisible();
  await expect(page.getByTestId("partner-preview-service-summary")).not.toContainText("Ahmet Kaya");
  await expect(page.getByTestId("partner-preview-service-summary")).not.toContainText("hizmet bilgileri");
  await expect(page.getByTestId("partner-preview-edit-details")).toHaveCount(0);
  await expect(page.getByTestId("partner-preview-detail-services")).toContainText("Hizmetler");
  await expect(page.getByTestId("partner-preview-detail-services")).toContainText("Klima bakım");
  await expect(page.getByTestId("partner-preview-detail-services")).toContainText("+7 Hizmet");
  await expect(page.getByTestId("partner-preview-detail-regions")).toContainText("Hizmet Bölgeleri");
  await expect(page.getByTestId("partner-preview-detail-regions")).toContainText("Beşiktaş");
  await expect(page.getByTestId("partner-preview-detail-regions")).toContainText("+18 Bölge");
  await expect(page.getByTestId("partner-preview-detail-hours")).toContainText("Çalışma Saatleri");
  await expect(page.getByTestId("partner-preview-detail-hours")).toContainText("Hafta içi ve cumartesi");
  await expect(page.getByTestId("partner-preview-detail-hours")).toContainText("08:00 - 21:00");
  await expect(page.getByTestId("partner-preview-reviews")).toBeVisible();
  await expect(page.getByTestId("partner-preview-review-row")).toHaveCount(4);
  await expect(page.getByTestId("partner-preview-reviews")).toContainText("Müşteri Yorumları");
  await expect(page.getByTestId("partner-preview-reviews")).toContainText("Emre T.");
  await expect(page.getByTestId("partner-preview-reviews")).toContainText("Seda K.");
  await expect(page.getByTestId("partner-preview-sticky-actions")).toBeVisible();
  await expect(page.getByTestId("partner-preview-action-offer")).toContainText("Teklif Al");
  await expect(page.getByTestId("partner-preview-action-appointment")).toContainText("Randevu Al");
  await expect(page.getByTestId("partner-preview-action-message")).toContainText("Mesaj Yaz");

  await page.getByTestId("partner-preview-header-share").click();
  await expect(page.getByTestId("partner-share-options")).toBeVisible();
  await expect(page.getByTestId("partner-share-option-whatsapp")).toContainText("Whatsapp");
  await expect(page.getByTestId("partner-share-option-website")).toContainText("Web Sitesi");
  await expect(page.getByTestId("partner-share-option-instagram")).toContainText("Instagram");
  await expect(page.getByTestId("partner-share-option-facebook")).toContainText("Facebook");
  await expect(page.getByTestId("partner-share-option-tiktok")).toContainText("Tik Tok");
  await expect(page.getByTestId("partner-share-option-x")).toContainText("X");
  await expect(page.getByTestId("partner-share-option-thread")).toContainText("Thread");
  await expect(page.getByTestId("partner-share-short-link")).toContainText("lipyum.com/f54s3f2");
  await expect(page.getByTestId("partner-share-qr")).toBeVisible();

  await page.getByTestId("partner-share-suboption-whatsapp-birine-gonder").click();
  await expect(page.locator("#toast")).toContainText("Whatsapp - Birine gönder hazırlandı.");
  expect(errors).toEqual([]);
});

test("profile badges and drawer actions stay usable", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/profile");
  await expectVueShell(page, "/profile");
  const profileCard = page
    .getByTestId("partner-profile-card")
    .and(page.locator('[data-component="PartnerProfileCard"][data-profile-card-variant="page"]'));
  await expect(profileCard).toBeVisible();
  const profileName = await profileCard.locator("h3").textContent();
  const profileTier = await profileCard.locator(".partner-profile-tier").textContent();
  await expect(page.getByTestId("profile-work-status-card")).toBeVisible();
  await expect(page.getByTestId("profile-work-status-toggle")).toBeVisible();
  await expect(page.getByTestId("profile-menu-strength-summary")).toBeVisible();
  await expect(page.getByTestId("profile-menu-card")).toHaveCount(0);
  await page.getByTestId("profile-menu-strength-summary").click();
  await expect(page.getByTestId("profile-menu-list")).toBeVisible();
  await expect(page.getByTestId("profile-menu-card")).toHaveCount(8);
  const profileGridGeometry = await page.evaluate(() => {
    const profile = document.querySelector('[data-testid="partner-profile-card"]')?.getBoundingClientRect();
    const list = document.querySelector('[data-testid="profile-menu-list"]')?.getBoundingClientRect();
    const cards = Array.from(document.querySelectorAll('[data-testid="profile-menu-card"]')).map((item) =>
      item.getBoundingClientRect(),
    );
    const maxTitleLines = Math.max(...Array.from(document.querySelectorAll(".profile-menu-row__title")).map((label) => {
      const style = window.getComputedStyle(label);
      const lineHeight = Number.parseFloat(style.lineHeight) || Number.parseFloat(style.fontSize) * 1.2;
      return label.getBoundingClientRect().height / lineHeight;
    }));
    const statuses = Array.from(document.querySelectorAll(".profile-menu-row__status")).map((item) =>
      item.textContent.trim(),
    );
    const workStatus = document.querySelector('[data-testid="profile-work-status-card"]')?.getBoundingClientRect();
    const summary = document.querySelector('[data-testid="profile-menu-strength-summary"]')?.getBoundingClientRect();
    return {
      cardCount: cards.length,
      statusCount: statuses.length,
      statuses,
      listLeftDelta: profile && list ? Math.abs(profile.left - list.left) : 999,
      listRightDelta: profile && list ? Math.abs(profile.right - list.right) : 999,
      firstCardLeftDelta: profile && cards[0] ? Math.abs(profile.left - cards[0].left) : 999,
      firstCardRightDelta: profile && cards[0] ? Math.abs(profile.right - cards[0].right) : 999,
      cardSpread: cards.length ? Math.max(...cards.map((card) => card.width)) - Math.min(...cards.map((card) => card.width)) : 999,
      maxTitleLines,
      workStatusWidthDelta: profile && workStatus ? Math.abs(profile.width - workStatus.width) : 999,
      workStatusTopGap: profile && workStatus ? Math.round(workStatus.top - profile.bottom) : 999,
      summaryAfterWorkStatusGap: workStatus && summary ? Math.round(summary.top - workStatus.bottom) : 999,
      summaryWidthDelta: profile && summary ? Math.abs(profile.width - summary.width) : 999,
      summaryTopGap: profile && summary ? Math.round(summary.top - profile.bottom) : 999,
      summaryText: document.querySelector('[data-testid="profile-menu-strength-summary"]')?.textContent ?? "",
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  expect(profileGridGeometry.cardCount).toBe(8);
  expect(profileGridGeometry.statusCount).toBe(8);
  expect(profileGridGeometry.statuses).toEqual(expect.arrayContaining(["Tamam", "+4 puan", "Eksik", "+2 puan", "Yeni"]));
  expect(profileGridGeometry.listLeftDelta).toBeLessThanOrEqual(2);
  expect(profileGridGeometry.listRightDelta).toBeLessThanOrEqual(2);
  expect(profileGridGeometry.firstCardLeftDelta).toBeLessThanOrEqual(2);
  expect(profileGridGeometry.firstCardRightDelta).toBeLessThanOrEqual(2);
  expect(profileGridGeometry.cardSpread).toBeLessThanOrEqual(1);
  expect(profileGridGeometry.maxTitleLines).toBeLessThanOrEqual(1.15);
  expect(profileGridGeometry.workStatusWidthDelta).toBeLessThanOrEqual(2);
  expect(profileGridGeometry.workStatusTopGap).toBeGreaterThanOrEqual(8);
  expect(profileGridGeometry.workStatusTopGap).toBeLessThanOrEqual(18);
  expect(profileGridGeometry.summaryAfterWorkStatusGap).toBeGreaterThanOrEqual(8);
  expect(profileGridGeometry.summaryAfterWorkStatusGap).toBeLessThanOrEqual(14);
  expect(profileGridGeometry.summaryWidthDelta).toBeLessThanOrEqual(2);
  expect(profileGridGeometry.summaryTopGap).toBeGreaterThanOrEqual(76);
  expect(profileGridGeometry.summaryTopGap).toBeLessThanOrEqual(92);
  expect(profileGridGeometry.summaryText).toContain("Profil Gücünüz");
  expect(profileGridGeometry.summaryText).toContain("+28");
  expect(profileGridGeometry.overflow).toBeLessThanOrEqual(1);
  await expect(page.locator(".profile-strength-card")).toHaveCount(0);
  await expect(page.getByTestId("header-info-button")).toHaveCount(0);
  await expect(page.getByTestId("partner-share-button")).toHaveCount(0);
  await expect(page.getByTestId("partner-preview-button")).toHaveCount(0);
  const initialAvatar = await profileCard.locator(".partner-profile-avatar-btn img").getAttribute("src");
  await profileCard.getByTestId("partner-profile-avatar-button").click();
  await expect(page.getByTestId("profile-photo-editor")).toBeVisible();
  await page.getByTestId("profile-photo-file-input").setInputFiles({
    name: "avatar.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADUlEQVR42mP8z8BQDwAFgwJ/l4D3HgAAAABJRU5ErkJggg==",
      "base64",
    ),
  });
  await expect(page.locator(".profile-photo-editor-preview")).toBeVisible();
  await expect(page.getByTestId("profile-photo-crop-area")).toBeVisible();
  await expect(page.locator(".profile-photo-controls input")).toHaveCount(0);
  await page.getByTestId("profile-photo-zoom-in").click();
  await page.getByTestId("profile-photo-zoom-in").click();
  await expect(page.locator(".profile-photo-zoom-label")).toContainText("4/5");
  await page.getByTestId("profile-photo-crop-area").dragTo(page.getByTestId("profile-photo-crop-area"), {
    sourcePosition: { x: 110, y: 110 },
    targetPosition: { x: 72, y: 138 },
  });
  await page.getByTestId("profile-photo-center").click();
  await expect(page.locator(".profile-photo-zoom-label")).toContainText("2/5");
  await page.getByTestId("profile-photo-save").click();
  await expect(page.getByRole("dialog", { name: "Profil fotoğrafı" })).toHaveCount(0);
  const updatedAvatar = await profileCard.locator(".partner-profile-avatar-btn img").getAttribute("src");
  expect(updatedAvatar).not.toBe(initialAvatar);
  expect(updatedAvatar).toContain("data:image/jpeg");
  await expect(page.getByTestId("profile-preview-header-button")).toBeVisible();
  await page.getByTestId("profile-preview-header-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/partner-card-preview");

  await page.goto("/#/home");
  await expectVueShell(page, "/home");
  await page.getByTestId("hamburger-button").click();
  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();
  const drawerCard = page
    .getByTestId("partner-profile-card")
    .and(page.locator('[data-component="PartnerProfileCard"][data-profile-card-variant="drawer"]'));
  await expect(drawerCard).toBeVisible();
  await expect(drawerCard.locator("h3")).toHaveText(profileName.trim());
  await expect(drawerCard.locator(".partner-profile-tier")).toContainText(profileTier.trim());
  await expect(drawerCard.locator(".partner-profile-avatar-btn img")).toBeVisible();
  await expect(drawerCard.locator(".partner-profile-avatar-btn img")).toHaveAttribute("src", updatedAvatar);
  await expect(page.locator(".drawer-work-status-card")).toHaveCount(0);
  await expect(drawerCard.locator(".drawer-avatar, .drawer-badge, .drawer-rating, .drawer-mini-badge")).toHaveCount(0);
  await expect(drawerCard.getByTestId("partner-share-button")).toHaveCount(0);
  await expect(drawerCard.getByTestId("partner-preview-button")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("navigation and cleared support routes remain functional", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await expectVueShell(page, "/home");
  await page.evaluate(() => window.navigateToPage("/profile"));
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/profile");
  await page.evaluate(() => window.navigateToPage("/partner-card-preview"));
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/partner-card-preview");
  await page.goBack();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/profile");

  await page.goto("/#/support/live");
  await expectVueShell(page, "/support/live");
  await expect(page.getByTestId("live-support-page")).toBeVisible();
  await expect(page.getByTestId("header-info-button")).toHaveCount(0);
  expect(errors).toEqual([]);
});
