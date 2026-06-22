import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

test("job referral dashboard and sell-job flow work", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/job-referral");
  await waitForApp(page);

  const referralPage = page.getByTestId("job-referral-page");
  await expect(referralPage).toBeVisible();
  await expect(referralPage.getByText("Cüzdan")).toBeVisible();
  await expect(referralPage.getByText("İş Sat, Para Kazan!")).toBeVisible();
  await expectNoAppHorizontalOverflow(page);

  await page.getByTestId("job-referral-open-flow").click();
  await expect(page.getByTestId("job-referral-flow")).toBeVisible();
  await page.getByTestId("job-referral-start").click();

  await page.getByTestId("job-referral-first-name").fill("Murat");
  await page.getByTestId("job-referral-last-name").fill("Kaya");
  await page.getByTestId("job-referral-customer-next").click();

  await page.getByTestId("job-referral-sector-search").fill("Klima");
  await page.getByTestId("job-referral-sector-option").filter({ hasText: "Klima Tamiri" }).click();

  await page.getByTestId("job-referral-city-search").fill("Antalya");
  await page.getByTestId("job-referral-city-option").filter({ hasText: "Antalya" }).click();

  await expect(page.getByText("Murat Kaya")).toBeVisible();
  await expect(page.getByText("Klima Tamiri")).toBeVisible();
  await expect(page.getByText("Antalya")).toBeVisible();
  await page.getByTestId("job-referral-submit").click();
  await expect(page.locator("#toast")).toContainText("İş yönlendirme taslağı hazırlandı.");

  expect(errors).toEqual([]);
});
