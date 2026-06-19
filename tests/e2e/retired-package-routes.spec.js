import { expect, test } from "@playwright/test";
import { waitForApp } from "./helpers.js";

const retiredRoutes = ["/packages", "/package-builder", "/package-checkout"];

async function expectSubscriptionHeader(page) {
  await expect(
    page.getByTestId("app-header").first().getByRole("heading", { name: "Aboneliğim" }),
  ).toBeVisible();
}

const runtimeScenarios = [
  { name: "default-vue", prefix: "", runtime: "vue" },
  { name: "legacy-rollback", prefix: "/?engine=legacy", runtime: "legacy" },
];

for (const engine of runtimeScenarios) {
  for (const route of retiredRoutes) {
    test(`${engine.name} retired ${route} redirects to subscription`, async ({ page }) => {
      await page.goto(`${engine.prefix}#${route}`);
      await waitForApp(page);
      await expect(page.locator("html")).toHaveAttribute("data-runtime", engine.runtime);
      await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/subscription");
      await expectSubscriptionHeader(page);
    });
  }
}

test("partner packages deep link redirects to subscription", async ({ page }) => {
  await page.goto("/partner/packages");
  await waitForApp(page);
  await expect(page.locator("html")).toHaveAttribute("data-runtime", "vue");
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/subscription");
  await expectSubscriptionHeader(page);
});
