import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("five star satisfaction shows compliance-safe store review CTA", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/satisfaction");
  await waitForApp(page);

  await page.getByRole("button", { name: "5 yıldız" }).click();
  await expect(page.getByTestId("store-review-panel")).toBeVisible();
  await expect(page.getByText("Yorum yalnızca sen onaylarsan")).toBeVisible();
  await page.getByTestId("store-review-cta").click();
  await expect(page.getByTestId("store-review-success")).toBeVisible();

  expect(errors).toEqual([]);
});

test("low satisfaction creates a mock support feedback record", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/satisfaction");
  await waitForApp(page);

  await page.getByRole("button", { name: "4 yıldız" }).click();
  await expect(page.getByTestId("satisfaction-improvement-form")).toBeVisible();
  await page.getByTestId("satisfaction-reason").selectOption("Destek süreci");
  await page.getByTestId("satisfaction-comment").fill("Daha hızlı dönüş bekliyorum.");
  await page.getByTestId("satisfaction-submit").click();
  await expect(page.getByTestId("satisfaction-success")).toBeVisible();

  expect(errors).toEqual([]);
});
