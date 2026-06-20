import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const criticalRoutes = [
  ["/home", "home-performance-card"],
  ["/profile", "profile-page"],
  ["/notifications", "notifications-page"],
  ["/support/new", "support-ticket-page"],
  ["/support/live", "live-support-page"],
  ["/reviews", "reviews-page"],
  ["/leaderboard", "leaderboard-page"],
  ["/subscription", "subscription-page"],
  ["/referral", "referral-page"],
  ["/partner-card-preview", "partner-card-preview-page"],
];

const blankRoutes = [
  ["/jobs", "jobs-page", "bottom-cta-job"],
  ["/my-jobs", "my-jobs-page", "bottom-tab-jobs"],
  ["/calendar", "calendar-page", "bottom-tab-calendar"],
  ["/wallet", "wallet-page", "bottom-tab-wallet"],
];

const retiredRoutes = ["/packages", "/package-builder", "/package-checkout", "/partner/packages"];

async function expectVueShell(page) {
  await waitForApp(page);
  await expect(page.locator("html")).toHaveAttribute("data-runtime", "vue");
  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByTestId("app-bottom-bar")).toBeVisible();
  await expectNoAppHorizontalOverflow(page);
}

test("boots Vue on normal URLs and does not expose legacy rollback", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await expectVueShell(page);

  await page.goto("/?engine=vue#/home");
  await expectVueShell(page);

  await page.goto("/?engine=legacy#/home");
  await expectVueShell(page);
  expect(errors).toEqual([]);
});

for (const [route, testId] of criticalRoutes) {
  test(`critical route opens in final Vue runtime: ${route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await expectVueShell(page);
    await expect(page.getByTestId(testId)).toBeVisible();
    expect(errors).toEqual([]);
  });
}

for (const [route, testId, activeTab] of blankRoutes) {
  test(`blank bottom route remains empty: ${route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await expectVueShell(page);
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
    await expectVueShell(page);
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
        notification: box('[data-testid="app-header"] [data-testid="notification-button"], [data-testid="app-header"] [data-testid="wallet-info-button"]'),
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
    await expectVueShell(page);
    await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/subscription");
    await expect(page.getByTestId("subscription-page")).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("profile badges and drawer actions stay usable", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/profile");
  await expectVueShell(page);
  const profileCard = page
    .getByTestId("partner-profile-card")
    .and(page.locator('[data-component="PartnerProfileCard"][data-profile-card-variant="page"]'));
  await expect(profileCard).toBeVisible();
  const profileName = await profileCard.locator("h3").textContent();
  const profileTier = await profileCard.locator(".partner-profile-tier").textContent();
  await expect(page.locator(".profile-menu-grid")).toBeVisible();
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
  await page.getByTestId("profile-photo-zoom").evaluate((input) => {
    input.value = "3";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.getByTestId("profile-photo-x").evaluate((input) => {
    input.value = "1";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.getByTestId("profile-photo-y").evaluate((input) => {
    input.value = "3";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.getByTestId("profile-photo-save").click();
  await expect(page.getByRole("dialog", { name: "Profil fotoğrafı" })).toHaveCount(0);
  const updatedAvatar = await profileCard.locator(".partner-profile-avatar-btn img").getAttribute("src");
  expect(updatedAvatar).not.toBe(initialAvatar);
  expect(updatedAvatar).toContain("data:image/jpeg");
  await expect(page.getByTestId("profile-preview-header-button")).toBeVisible();
  await page.getByTestId("profile-preview-header-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/partner-card-preview");

  await page.goto("/#/home");
  await expectVueShell(page);
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
  await expect(drawerCard.locator(".drawer-avatar, .drawer-badge, .drawer-rating, .drawer-mini-badge")).toHaveCount(0);
  await expect(drawerCard.getByTestId("partner-share-button")).toHaveCount(0);
  await expect(drawerCard.getByTestId("partner-preview-button")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("navigation and live support remain functional", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await expectVueShell(page);
  await page.evaluate(() => window.navigateToPage("/profile"));
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/profile");
  await page.evaluate(() => window.navigateToPage("/partner-card-preview"));
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/partner-card-preview");
  await page.goBack();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/profile");

  await page.goto("/#/support/live");
  await expectVueShell(page);
  await page.getByRole("button", { name: /Canl/i }).first().click();
  await expect(page.getByTestId("live-support-waiting").getByText(/Tahmini süre 2 dakika/i)).toBeVisible();
  expect(errors).toEqual([]);
});
