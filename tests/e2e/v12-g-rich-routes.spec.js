import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const vueRoute = (route) => `/#${route}`;

const richRoutes = [
  { route: "/profile", testId: "profile-page" },
  { route: "/partner-card-preview", testId: "partner-card-preview-page" },
  { route: "/photo-gallery", testId: "photo-gallery-page" },
  { route: "/notifications", testId: "notifications-page" },
  { route: "/support", testId: "support-page" },
  { route: "/support/new", testId: "support-ticket-page" },
  { route: "/support/live", testId: "live-support-page" },
  { route: "/support/customer-service", testId: "customer-service-page" },
  { route: "/messages", testId: "messages-page" },
  { route: "/satisfaction", testId: "satisfaction-page" },
  { route: "/reviews", testId: "reviews-page" },
  { route: "/leaderboard", testId: "leaderboard-page" },
  { route: "/subscription", testId: "subscription-page" },
  { route: "/referral", testId: "referral-page" },
  { route: "/partners", testId: "referral-partners-page" },
  { route: "/referral/tasks", testId: "referral-tasks-page" },
  { route: "/referral/partners", testId: "referral-partners-page" },
  { route: "/referral/partner/demo", testId: "referral-partner-detail-page" },
  { route: "/referral-earnings", testId: "referral-earnings-page" },
  { route: "/job-referral", testId: "job-referral-page" },
];

async function expectCleanVueShell(page) {
  await waitForApp(page);
  await expect(page.locator("html")).toHaveAttribute("data-runtime", "vue");
  await expect(page.getByTestId("app-header")).toHaveCount(1);
  await expect(page.getByTestId("app-bottom-bar")).toHaveCount(1);
  await expect(page.getByTestId("clickable-outcome-summary")).toHaveCount(0);
  await expect(page.getByText(/compatibility bridge/i)).toHaveCount(0);
  await expect(page.getByText(/^(profile|support|growth|referral|finance)$/i)).toHaveCount(0);
  await expectNoAppHorizontalOverflow(page);
}

for (const item of richRoutes) {
  test(`V12-G rich route renders dedicated page for ${item.route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(vueRoute(item.route));
    await expectCleanVueShell(page);
    await expect(page.getByTestId(item.testId)).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("V12-G profile badges expand once and reset after route leave", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto(vueRoute("/profile"));
  await expectCleanVueShell(page);

  await expect(page.getByTestId("partner-profile-card")).toBeVisible();
  await expect(page.getByTestId("profile-badge-more")).toBeVisible();
  await page.getByTestId("profile-badge-more").click();
  await expect(page.getByTestId("profile-badge-more")).toHaveCount(0);

  await page.goto(vueRoute("/support"));
  await expectCleanVueShell(page);
  await page.goto(vueRoute("/profile"));
  await expectCleanVueShell(page);
  await expect(page.getByTestId("profile-badge-more")).toBeVisible();
  expect(errors).toEqual([]);
});

test("V12-G create ticket flow submits and resets", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto(vueRoute("/support/new"));
  await expectCleanVueShell(page);

  await expect(page.getByTestId("support-ticket-form")).toBeVisible();
  await page.getByTestId("support-ticket-category").selectOption("Teknik Sorun");
  await page.getByTestId("support-ticket-subject").fill("V12-G destek testi");
  await page.getByTestId("support-ticket-description").fill("Talep akisi test ediliyor.");
  await page.getByTestId("support-ticket-priority").selectOption("Oncelikli");
  await page.getByTestId("support-ticket-submit").click();
  await expect(page.getByTestId("support-ticket-success")).toBeVisible();
  await page.getByTestId("support-ticket-new").click();
  await expect(page.getByTestId("support-ticket-form")).toBeVisible();
  expect(errors).toEqual([]);
});

test("V12-G live support waits then opens branded chat", async ({ page }) => {
  test.setTimeout(20_000);
  const errors = await collectConsoleErrors(page);
  await page.goto(vueRoute("/support/live"));
  await expectCleanVueShell(page);

  await page.getByTestId("live-support-title").fill("V12-G canli destek");
  await page.getByTestId("live-support-description").fill("Temsilci baglanti akisi kontrol ediliyor.");
  await page.getByTestId("live-support-start").click();
  await expect(page.getByTestId("live-support-waiting")).toBeVisible();
  await expect(page.getByTestId("live-support-create-ticket")).toBeVisible();
  await expect(page.getByTestId("live-support-chat")).toBeVisible({ timeout: 7_000 });
  await expect(page.getByTestId("live-support-agent")).toBeVisible();

  await page.getByTestId("live-support-input").fill("Merhaba");
  await page.getByTestId("live-support-send").click();
  await expect(page.getByText("Merhaba")).toBeVisible();
  await expect(page.getByTestId("live-support-typing")).toBeVisible();
  await page.getByTestId("live-support-end").click();
  await expect(page.getByTestId("live-support-ended")).toBeVisible();
  expect(errors).toEqual([]);
});

test("V12-G customer service route exposes premium phone action", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto(vueRoute("/support/customer-service"));
  await expectCleanVueShell(page);

  await expect(page.getByTestId("customer-service-page")).toBeVisible();
  await expect(page.getByTestId("customer-service-phone-number")).toHaveText("444 23 68");
  await expect(page.getByTestId("customer-service-call")).toHaveAttribute("href", "tel:4442368");
  await expect(page.getByTestId("customer-service-upgrade")).toHaveCount(0);
  await expect(page.getByText(/paket/i)).toHaveCount(0);
  await expect(page.getByTestId("header-info-button")).toHaveCount(0);
  await expect(page.getByTestId("premium-member-icon")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("V12-G subscription plan selection updates active plan", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto(vueRoute("/subscription"));
  await expectCleanVueShell(page);

  await expect(page.getByTestId("subscription-page")).toBeVisible();
  await page.getByTestId("subscription-plan-plus").click();
  await expect(page.getByTestId("subscription-active-plan")).toContainText(/plus/i);
  await page.getByTestId("subscription-plan-pro").click();
  await expect(page.getByTestId("subscription-active-plan")).toContainText(/pro/i);
  expect(errors).toEqual([]);
});

test("V12-G referral list, detail and back stack work", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto(vueRoute("/referral"));
  await expectCleanVueShell(page);

  await page.getByTestId("referral-invite-button").click();
  await expect(page.locator("#toast")).toBeVisible();
  await page.getByTestId("referral-view-all").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/referral/partners");
  await page.getByTestId("referral-partner-card").first().click();
  await expect(page.getByTestId("referral-partner-detail-page")).toBeVisible();
  await page.getByTestId("back-button").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/referral/partners");
  expect(errors).toEqual([]);
});
