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

test("Aboneliğim menu is retained with an empty content area", async ({ page }) => {
  await page.goto("#/home");
  await waitForApp(page);
  await expect(page.locator("html")).toHaveAttribute("data-runtime", "vue");
  await openSidebar(page);

  await expect(page.getByRole("button", { name: "Aboneliğim" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Paketler" })).toHaveCount(0);

  await page.getByRole("button", { name: "Aboneliğim" }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/subscription");
  await expectSubscriptionHeader(page);
  await expect(page.getByTestId("subscription-page")).toBeVisible();
  await expect(page.getByTestId("subscription-empty-state")).toBeVisible();
  await expect(page.getByText("Bu alan şu anda boş.")).toBeVisible();
  await expect(page.getByText(/Gold|Plus|VIP|plan|paket|ücretsiz|satın|ödeme/i)).toHaveCount(0);
});
