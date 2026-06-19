import { expect, test } from "@playwright/test";
import fs from "node:fs";
import { waitForApp } from "./helpers.js";

const contract = JSON.parse(fs.readFileSync("tests/product-scope/v12-e/PRODUCT_SCOPE_CONTRACT.json", "utf8"));

test("V12-E product scope contract matches visible navigation", async ({ page }) => {
  await page.goto("/#/home");
  await waitForApp(page);

  const bottom = page.getByTestId("app-bottom-bar").first();
  for (const item of contract.activeBottomNavigation) {
    await expect(bottom.getByText(item.label, { exact: true })).toBeVisible();
  }

  await page.getByTestId("hamburger-button").click();
  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();
  for (const label of contract.activeGrowthSidebar) {
    await expect(page.getByRole("button", { name: label })).toBeVisible();
  }
  for (const removed of contract.removedProducts) {
    await expect(page.getByText(removed, { exact: true })).toHaveCount(0);
  }
});

test("V12-E blank routes expose shell only", async ({ page }) => {
  for (const route of contract.blankRoutes) {
    await page.goto(`/#${route}`);
    await waitForApp(page);
    await expect(page.getByTestId("app-header").first()).toBeVisible();
    await expect(page.getByTestId("app-bottom-bar").first()).toBeVisible();
    await expect(page.locator("[data-blank-route='true']").first()).toBeVisible();
  }
});
