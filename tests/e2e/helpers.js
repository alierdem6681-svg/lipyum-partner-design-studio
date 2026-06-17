export const routes = [
  "/home",
  "/profile",
  "/notifications",
  "/support",
  "/referral",
  "/job-referral",
  "/reviews",
  "/wallet",
  "/leaderboard",
  "/packages",
  "/subscription",
  "/ui-kit",
  "/vue-job-referral",
];

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
