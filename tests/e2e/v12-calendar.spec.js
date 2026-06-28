import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

test("V12-E Vue calendar route renders the appointment menu", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/?engine=vue#/calendar");
  await waitForApp(page);
  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByTestId("app-header").getByRole("heading", { name: "Randevu", exact: true })).toBeVisible();
  await expect(page.getByTestId("calendar-page")).toBeVisible();
  await expect(page.getByTestId("appointment-hero")).toContainText("Bugün");
  await expect(page.getByTestId("appointment-hero")).toContainText("6 boş saat");
  await expect(page.getByTestId("appointment-services-panel")).toBeVisible();
  await expect(page.getByTestId("bottom-tab-calendar")).toHaveAttribute("aria-current", "page");
  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});
