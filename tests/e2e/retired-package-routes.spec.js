import { expect, test } from "@playwright/test";
import { waitForApp } from "./helpers.js";

const retiredRoutes = ["/packages", "/package-builder", "/package-checkout"];

async function expectSubscriptionHeader(page) {
  await expect(
    page.getByTestId("app-header").first().getByRole("heading", { name: "Aboneliğim" }),
  ).toBeVisible();
}

for (const engine of ["legacy", "vue"]) {
  for (const route of retiredRoutes) {
    test(`${engine} retired ${route} redirects to subscription`, async ({ page }) => {
      const prefix = engine === "vue" ? "/?engine=vue" : "";
      await page.goto(`${prefix}#${route}`);
      await waitForApp(page);
      await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/subscription");
      await expectSubscriptionHeader(page);
    });
  }
}

test("partner packages deep link redirects to subscription", async ({ page }) => {
  await page.goto("/partner/packages");
  await waitForApp(page);
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/subscription");
  await expectSubscriptionHeader(page);
});
