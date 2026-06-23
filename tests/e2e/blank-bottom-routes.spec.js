import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const blankRoutes = [
  { route: "/jobs", title: "İş Al", testId: "jobs-page", active: "bottom-cta-job" },
  { route: "/my-jobs", title: "İşler", testId: "my-jobs-page", active: "bottom-tab-jobs" },
  { route: "/calendar", title: "Randevu", testId: "calendar-page", active: "bottom-tab-calendar" },
  { route: "/wallet", title: "Cüzdan", testId: "wallet-page", active: "bottom-tab-wallet" },
];

const runtimeScenarios = [
  { name: "default-vue", prefix: "", runtime: "vue" },
];

for (const engine of runtimeScenarios) {
  for (const item of blankRoutes) {
    test(`${engine.name} ${item.route} renders only shell and blank main`, async ({ page }) => {
      const errors = await collectConsoleErrors(page);
      await page.goto(`${engine.prefix}#${item.route}`);
      await waitForApp(page);
      await expect(page.locator("html")).toHaveAttribute("data-runtime", engine.runtime);

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
