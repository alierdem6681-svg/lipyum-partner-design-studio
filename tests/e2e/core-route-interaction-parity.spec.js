import { expect, test } from "@playwright/test";

test("V12 core route interactions are wired", async ({ page }) => {
  await page.goto("/?engine=vue#/home");
  await page.getByTestId("hamburger-button").click();
  await expect(page.getByRole("dialog", { name: "Lipyum Partner" })).toBeVisible();
  await page.getByLabel("Kapat").click();

  await page.getByTestId("notification-button").click();
  await expect(page).toHaveURL(/#\/notifications$/);

  await page.goto("/?engine=vue#/home");
  await page.getByTestId("bottom-cta-job").click();
  await expect(page).toHaveURL(/#\/jobs$/);

  await page.getByText("Detay").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
});
