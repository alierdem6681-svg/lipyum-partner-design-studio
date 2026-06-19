import { expect, test } from "@playwright/test";
import { waitForApp } from "./helpers.js";

async function openSidebar(page) {
  await page.getByTestId("hamburger-button").click();
  await expect(
    page.getByTestId("sidebar-drawer").or(page.getByRole("dialog", { name: "Lipyum Partner" })).first(),
  ).toBeVisible();
}

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
  test(`${engine.name} subscription route is retained and sidebar has no package item`, async ({ page }) => {
    await page.goto(`${engine.prefix}#/home`);
    await waitForApp(page);
    await expect(page.locator("html")).toHaveAttribute("data-runtime", engine.runtime);
    await openSidebar(page);

    await expect(page.getByRole("button", { name: "Aboneliğim" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Paketler" })).toHaveCount(0);

    await page.getByRole("button", { name: "Aboneliğim" }).click();
    await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/subscription");
    await expectSubscriptionHeader(page);
  });
}
