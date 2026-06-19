import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("V12 jobs route is Vue-rendered and opens job detail sheet", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/jobs");
  await waitForApp(page);

  await expect(page.getByTestId("jobs-page")).toBeVisible();
  await expect(page.getByTestId("job-card")).toHaveCount(4);
  await page.getByRole("button", { name: "Havuz", exact: true }).click();
  await expect(page.getByTestId("job-card")).toHaveCount(1);
  await page.getByTestId("job-card").first().getByRole("button").click();
  await expect(page.getByTestId("sheet-close-button")).toBeVisible();

  expect(errors).toEqual([]);
});
