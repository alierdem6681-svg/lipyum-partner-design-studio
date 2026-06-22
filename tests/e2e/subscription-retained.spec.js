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

test("subscription route is retained and sidebar has no package item", async ({ page }) => {
  await page.goto("#/home");
  await waitForApp(page);
  await expect(page.locator("html")).toHaveAttribute("data-runtime", "vue");
  await openSidebar(page);

  await expect(page.getByRole("button", { name: "Aboneliğim" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Paketler" })).toHaveCount(0);

  await page.getByRole("button", { name: "Aboneliğim" }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/subscription");
  await expectSubscriptionHeader(page);
});
