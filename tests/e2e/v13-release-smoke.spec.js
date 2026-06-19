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
  await expect(page.getByTestId("partner-profile-card")).toBeVisible();
  await expect(page.locator(".profile-menu-grid")).toBeVisible();

  await page.goto("/#/home");
  await expectVueShell(page);
  await page.getByTestId("hamburger-button").click();
  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();
  await expect(page.getByTestId("partner-share-button").first()).toBeVisible();
  await expect(page.getByTestId("partner-preview-button").first()).toBeVisible();
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
