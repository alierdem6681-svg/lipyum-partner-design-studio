import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const blankRoutes = [
  { route: "/jobs", title: "İş Al", testId: "jobs-page", active: "bottom-cta-job" },
  { route: "/my-jobs", title: "İşler", testId: "my-jobs-page", active: "bottom-tab-jobs" },
  { route: "/calendar", title: "Randevu", testId: "calendar-page", active: "bottom-tab-calendar" },
  { route: "/wallet", title: "Cüzdan", testId: "wallet-page", active: "bottom-tab-wallet" },
];

for (const engine of ["legacy", "vue"]) {
  for (const item of blankRoutes) {
    test(`${engine} ${item.route} renders only shell and blank main`, async ({ page }) => {
      const errors = await collectConsoleErrors(page);
      const prefix = engine === "vue" ? "/?engine=vue" : "";
      await page.goto(`${prefix}#${item.route}`);
      await waitForApp(page);

      await expect(page.getByTestId("app-header").first()).toBeVisible();
      await expect(page.getByRole("heading", { name: item.title })).toBeVisible();
      await expect(page.getByTestId("app-bottom-bar").first()).toBeVisible();
      await expect(page.getByTestId(item.active)).toHaveAttribute("aria-current", "page");

      const main = page.getByTestId(item.testId).first();
      await expect(main).toBeVisible();
      await expect(main.locator("> *")).toHaveCount(0);
      await expect(main.locator("button, [role='button'], .ui-card, .v-card, .filter-chip, .v-filter-chip")).toHaveCount(0);
      await expectNoAppHorizontalOverflow(page);
      expect(errors).toEqual([]);
    });
  }
}
