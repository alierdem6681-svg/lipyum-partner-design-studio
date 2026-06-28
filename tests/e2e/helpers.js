export const routes = [
  "/home",
  "/jobs",
  "/my-jobs",
  "/calendar",
  "/wallet",
  "/wallet/history",
  "/wallet/settings",
  "/profile",
  "/notifications",
  "/support",
  "/support/new",
  "/support/tickets",
  "/support/live",
  "/support/customer-service",
  "/satisfaction",
  "/messages",
  "/referral",
  "/job-referral",
  "/partners",
  "/customers",
  "/reviews",
  "/leaderboard",
  "/subscription",
  "/subscription/compare",
  "/subscription/checkout",
  "/bonus",
  "/performance-score",
  "/performance-improve",
  "/invoices",
  "/income-expense",
  "/appointment-link",
  "/about",
  "/verifications",
  "/photo-gallery",
  "/services",
  "/regions",
  "/working-hours",
  "/team",
  "/capacity",
  "/strategy",
  "/account-settings",
  "/notification-settings",
  "/contact-settings",
  "/partner-card-preview",
];

export const criticalRoutes = [
  "/home",
  "/my-jobs",
  "/calendar",
  "/wallet",
  "/profile",
  "/notifications",
  "/support",
  "/support/new",
  "/support/tickets",
  "/support/live",
  "/support/customer-service",
  "/satisfaction",
  "/referral",
  "/job-referral",
  "/reviews",
  "/leaderboard",
  "/subscription",
  "/performance-score",
  "/performance-improve",
  "/partner-card-preview",
];

export const ctaHiddenRoutes = new Set();

export const bottomBarHiddenRoutes = new Set([
  "/jobs",
  "/profile",
  "/support",
  "/support/new",
  "/support/tickets",
  "/support/live",
  "/support/customer-service",
  "/subscription",
  "/subscription/compare",
  "/subscription/checkout",
  "/wallet/top-up",
  "/wallet/top-up/success",
  "/performance-score",
  "/performance-improve",
  "/partner-card-preview",
]);

export const blankBottomRoutes = new Set([
  "/my-jobs",
  "/wallet",
  "/support/new",
  "/support/customer-service",
  "/invoices",
]);

export async function collectConsoleErrors(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  return errors;
}

export async function expectNoAppHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => {
    const root = document.querySelector("#appRoot");
    if (!root) return false;
    return root.scrollWidth > root.clientWidth + 1;
  });
  if (overflow) throw new Error("App scroll root has horizontal overflow");
}

export async function waitForApp(page) {
  await page.waitForSelector(".phone-screen", { state: "visible" });
  await page.waitForSelector("#appRoot", { state: "visible" });
}
