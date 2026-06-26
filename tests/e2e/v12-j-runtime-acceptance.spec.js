import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const blankRoutes = [
  { route: "/jobs", testId: "jobs-page", active: "bottom-cta-job" },
  { route: "/my-jobs", testId: "my-jobs-page", active: "bottom-tab-jobs" },
  { route: "/calendar", testId: "calendar-page", active: "bottom-tab-calendar" },
];

const dedicatedRoutes = [
  { route: "/home", testId: "home-performance-card" },
  { route: "/about", testId: "route--about" },
  { route: "/profile", testId: "profile-page" },
  { route: "/partner-card-preview", testId: "partner-card-preview-page" },
  { route: "/photo-gallery", testId: "photo-gallery-page" },
  { route: "/services", testId: "services-page" },
  { route: "/notifications", testId: "notifications-page" },
  { route: "/support", testId: "support-page" },
  { route: "/support/new", testId: "support-ticket-page" },
  { route: "/support/live", testId: "live-support-page" },
  { route: "/support/customer-service", testId: "customer-service-page" },
  { route: "/messages", testId: "messages-page" },
  { route: "/wallet", testId: "wallet-page" },
  { route: "/wallet/history", testId: "wallet-history-page" },
  { route: "/wallet/settings", testId: "wallet-settings-page" },
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

const dataDrivenRoutes = [
  "/regions",
  "/working-hours",
  "/team",
  "/capacity",
  "/strategy",
  "/account-settings",
  "/notification-settings",
  "/contact-settings",
  "/bonus",
  "/performance-score",
  "/customers",
  "/invoices",
  "/income-expense",
  "/appointment-link",
];

const retiredRoutes = ["/packages", "/package-builder", "/package-checkout", "/partner/packages"];
const responsiveRoutes = [
  "/home",
  "/profile",
  "/notifications",
  "/support/new",
  "/support/live",
  "/reviews",
  "/leaderboard",
  "/subscription",
  "/referral",
  "/partner-card-preview",
];
const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 780 },
  { width: 393, height: 852 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
];

async function expectDefaultVueShell(page, route = "") {
  await waitForApp(page);
  await expect(page.locator("html")).toHaveAttribute("data-runtime", "vue");
  await expect(page.getByTestId("app-header").first()).toBeVisible();
  if (route === "/support/customer-service") {
    await expect(page.getByTestId("app-bottom-bar")).toHaveCount(0);
  } else {
    await expect(page.getByTestId("app-bottom-bar").first()).toBeVisible();
  }
  await expect(page.getByTestId("clickable-outcome-summary")).toHaveCount(0);
  await expectNoAppHorizontalOverflow(page);
}

test("normal URL boots Vue and explicit rollback boots legacy", async ({ page }) => {
  await page.goto("/#/home");
  await expectDefaultVueShell(page);

  await page.goto("/?engine=vue#/home");
  await expectDefaultVueShell(page);

  await page.goto("/?engine=legacy#/home");
  await waitForApp(page);
  await expect(page.locator("html")).toHaveAttribute("data-runtime", "legacy");
});

for (const item of dedicatedRoutes) {
  test(`default Vue dedicated route ${item.route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${item.route}`);
    await expectDefaultVueShell(page, item.route);
    await expect(page.getByTestId(item.testId).first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}

for (const route of dataDrivenRoutes) {
  test(`default Vue data-driven route ${route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await expectDefaultVueShell(page);
    await expect(page.locator("main.v-page").first()).toBeVisible();
    await expect(page.getByText(/Clickable coverage/i)).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

for (const item of blankRoutes) {
  test(`default Vue blank bottom route ${item.route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${item.route}`);
    await expectDefaultVueShell(page);
    await expect(page.getByTestId(item.active)).toHaveAttribute("aria-current", "page");
    const main = page.getByTestId(item.testId).first();
    await expect(main).toBeVisible();
    await expect(main.locator("> *")).toHaveCount(0);
    await expect(main.locator("button, [role='button'], .ui-card, .v-card, .filter-chip, .v-filter-chip")).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

for (const route of retiredRoutes) {
  test(`default Vue retired route ${route} redirects to subscription`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await expectDefaultVueShell(page);
    await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/subscription");
    await expect(page.getByTestId("subscription-page")).toBeVisible();
    expect(errors).toEqual([]);
  });
}

for (const viewport of viewports) {
  for (const route of responsiveRoutes) {
    test(`V12-J responsive ${route} at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      const errors = await collectConsoleErrors(page);
      await page.setViewportSize(viewport);
      await page.goto(`/#${route}`);
      await expectDefaultVueShell(page);
      const wrapOrClip = await page.evaluate(() => {
        const controls = Array.from(document.querySelectorAll(".v-bottom__label, .v-btn, .score-info-btn, .region-day-tabs button"));
        return controls
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);
            if (rect.width <= 0 || rect.height <= 0 || style.visibility === "hidden") return false;
            const lineHeight = Number.parseFloat(style.lineHeight) || 16;
            const tooTall = rect.height > lineHeight * 2.4 && !element.classList.contains("v-btn");
            const clipped = element.scrollWidth > element.clientWidth + 8 && style.overflow !== "hidden";
            return tooTall || clipped;
          })
          .map((element) => element.textContent?.trim() || element.getAttribute("data-testid") || element.outerHTML.slice(0, 80));
      });
      expect(wrapOrClip).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}
