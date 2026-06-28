import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const blankRoutes = [];

const runtimeScenarios = [
  { name: "default-vue", prefix: "", runtime: "vue" },
];

test("default-vue /my-jobs renders the İşler product screen", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("#/my-jobs");
  await waitForApp(page);
  await expect(page.locator("html")).toHaveAttribute("data-runtime", "vue");
  await expect(page.getByTestId("app-header").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "İşler" })).toBeVisible();
  await expect(page.getByTestId("app-bottom-bar").first()).toBeVisible();
  await expect(page.getByTestId("bottom-tab-jobs")).toHaveAttribute("aria-current", "page");
  await expect(page.getByTestId("my-jobs-page")).toBeVisible();
  await expect(page.getByTestId("my-jobs-tab-actions")).toHaveClass(/is-active/);
  await expect(page.getByText("Müşteriyi Ara ve Randevu Ver")).toBeVisible();
  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

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
