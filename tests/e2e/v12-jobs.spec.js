import { expect, test } from "@playwright/test";

test("V12 Vue jobs route opens job detail sheet", async ({ page }) => {
  await page.goto("/?engine=vue#/jobs");
  await expect(page.getByRole("heading", { name: "İş Al" })).toBeVisible();
  await expect(page.getByTestId("job-card")).toHaveCount(3);
  await page.getByRole("button", { name: "Detay" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

