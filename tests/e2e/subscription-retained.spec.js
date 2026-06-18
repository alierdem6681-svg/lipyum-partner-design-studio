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

for (const engine of ["legacy", "vue"]) {
  test(`${engine} subscription route is retained and sidebar has no package item`, async ({ page }) => {
    const prefix = engine === "vue" ? "/?engine=vue" : "";
    await page.goto(`${prefix}#/home`);
    await waitForApp(page);
    await openSidebar(page);

    await expect(page.getByRole("button", { name: "Aboneliğim" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Paketler" })).toHaveCount(0);

    await page.getByRole("button", { name: "Aboneliğim" }).click();
    await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/subscription");
    await expectSubscriptionHeader(page);
  });
}
