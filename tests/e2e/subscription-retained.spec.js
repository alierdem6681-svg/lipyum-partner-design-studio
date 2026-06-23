import { expect, test } from "@playwright/test";
import { waitForApp } from "./helpers.js";

async function openSidebar(page) {
  await page.getByTestId("hamburger-button").click();
  await expect(
    page.getByTestId("sidebar-drawer").or(page.getByRole("dialog", { name: "Lipyum Partner" })).first(),
  ).toBeVisible();
}

test("Aboneliğim menu opens the direct purchase subscription page", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.removeItem("lipyum.subscription.directPurchase"));
  await page.goto("#/home");
  await waitForApp(page);
  await expect(page.locator("html")).toHaveAttribute("data-runtime", "vue");
  await openSidebar(page);

  await expect(page.getByRole("button", { name: "Aboneliğim" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Paketler" })).toHaveCount(0);

  await page.getByRole("button", { name: "Aboneliğim" }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/subscription");
  await expect(page.getByTestId("subscription-page")).toBeVisible();
  await expect(page.getByTestId("subscription-free-state")).toBeVisible();
  await expect(page.getByTestId("subscription-plan-gold")).toBeVisible();
  await expect(page.getByTestId("subscription-plan-plus")).toBeVisible();
  await expect(page.getByTestId("subscription-plan-vip")).toBeVisible();
  await expect(page.getByText(/deneme|ücretsiz dene|30 gün/i)).toHaveCount(0);
});
