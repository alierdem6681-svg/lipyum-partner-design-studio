import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("V12 my jobs route is Vue-rendered with stable filters", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/my-jobs");
  await waitForApp(page);

  await expect(page.getByTestId("my-jobs-page")).toBeVisible();
  await page.getByRole("button", { name: "Tamamlananlar" }).click();
  await expect(page.getByTestId("my-job-card")).toContainText("Fırın tamiri");
  await page.getByTestId("my-job-card").first().getByRole("button").click();
  await expect(page.getByTestId("sheet-close-button")).toBeVisible();

  expect(errors).toEqual([]);
});
