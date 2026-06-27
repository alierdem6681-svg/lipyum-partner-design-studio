import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

test("services page lets partner search, add and remove services", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/#/services");
  await waitForApp(page);

  await expect(page.getByTestId("services-page")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Hizmetlerim" })).toBeVisible();
  await expect(page.getByTestId("services-search-input")).toBeVisible();
  await expect(page.getByText("Seçili Hizmetlerim (4)")).toBeVisible();
  await expect(page.getByTestId("selected-service-chip")).toHaveCount(4);

  await page.getByTestId("services-search-input").fill("Klima");
  await expect(page.getByRole("button", { name: "Klima Tamiri hizmetini ekle" })).toBeVisible();
  await page.getByRole("button", { name: "Klima Tamiri hizmetini ekle" }).click();
  await expect(page.getByText("Seçili Hizmetlerim (5)")).toBeVisible();
  await expect(page.getByRole("button", { name: "Klima Tamiri hizmetini kaldır" })).toBeVisible();

  await page.getByRole("button", { name: "Klima Tamiri hizmetini kaldır" }).click();
  await expect(page.getByText("Seçili Hizmetlerim (4)")).toBeVisible();

  await page.getByTestId("services-edit-button").click();
  await expect(page.getByTestId("services-search-input")).toBeFocused();
  await expect(page.getByTestId("services-info-card")).toBeVisible();
  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});
