import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("V12 calendar route is Vue-rendered and opens appointment detail", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/calendar");
  await waitForApp(page);

  await expect(page.getByTestId("calendar-page")).toBeVisible();
  await expect(page.getByTestId("appointment-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Yarın" }).click();
  await expect(page.getByTestId("appointment-card")).toHaveCount(1);
  await page.getByTestId("appointment-card").first().getByRole("button").click();
  await expect(page.getByTestId("sheet-close-button")).toBeVisible();

  expect(errors).toEqual([]);
});
