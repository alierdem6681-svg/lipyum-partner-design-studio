export const routes = [
  "/home",
  "/jobs",
  "/my-jobs",
  "/calendar",
  "/wallet",
  "/profile",
  "/notifications",
  "/support",
  "/support/new",
  "/support/live",
  "/satisfaction",
  "/messages",
  "/referral",
  "/job-referral",
  "/partners",
  "/customers",
  "/reviews",
  "/leaderboard",
  "/packages",
  "/subscription",
  "/package-builder",
  "/package-checkout",
  "/bonus",
  "/performance-score",
  "/invoices",
  "/income-expense",
  "/appointment-link",
  "/about",
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
  "/ui-kit",
  "/vue-job-referral",
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
  "/support/live",
  "/satisfaction",
  "/referral",
  "/job-referral",
  "/reviews",
  "/leaderboard",
  "/packages",
  "/subscription",
  "/partner-card-preview",
];

export const ctaHiddenRoutes = new Set(["/package-checkout"]);

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
