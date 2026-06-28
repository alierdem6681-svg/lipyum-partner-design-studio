import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

test("V12-E Vue jobs route renders İş Al opportunities", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/?engine=vue#/jobs");
  await waitForApp(page);

  await expect(page.getByTestId("jobs-page")).toBeVisible();
  await expect(page.getByRole("heading", { name: "İş Al" })).toBeVisible();
  await expect(page.getByText("Size uygun yeni işler")).toBeVisible();
  await expect(page.getByTestId("job-filter-all")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("job-filter-appointment")).toBeVisible();
  await expect(page.getByTestId("job-filter-quote")).toBeVisible();
  await expect(page.getByTestId("job-filter-waiting-purchase")).toBeVisible();

  await expect(page.getByTestId("job-card-job-0001")).toContainText("Klima bakımı");
  await expect(page.getByTestId("job-card-job-0001")).toContainText("İş sizin • müşteri aramanızı bekliyor");
  await expect(page.getByTestId("job-card-job-0001")).toContainText("3 dk önce");

  await page.getByTestId("job-filter-quote").click();
  await expect(page.getByTestId("job-card-job-0003")).toContainText("Teklif Ver");
  await expect(page.getByTestId("job-card-job-0003")).toContainText("6 firma teklif bekliyor");

  await page.getByTestId("job-filter-waiting-purchase").click();
  await expect(page.getByTestId("job-card-job-0004")).toContainText("İşi Satın Al");
  await expect(page.getByTestId("job-card-job-0004")).toContainText("Henüz sahiplenen olmadı");

  await page.getByTestId("job-filter-all").click();
  await page.getByRole("button", { name: /Sizi Bekliyor/ }).first().click();
  await expect(page.getByTestId("app-sheet")).toContainText("Müşteri sizi bekliyor");
  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});
