import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

test("job referral dashboard and sell-job flow work", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/job-referral");
  await waitForApp(page);

  const referralPage = page.getByTestId("job-referral-page");
  await expect(referralPage).toBeVisible();
  await expect(page.getByTestId("app-header")).toContainText("İş gönder, kazancı sen al");
  await expect(referralPage.getByTestId("job-referral-earnings-card")).toContainText("Kazanç");
  await expect(referralPage.getByTestId("job-referral-earnings-card")).toContainText("Kesinleşen Kazanç");
  await expect(referralPage.getByTestId("job-referral-earnings-card")).toContainText("Çekilebilir Bakiye");
  await expect(referralPage.getByText("Çağrılar")).toHaveCount(0);
  await expect(referralPage.getByText("Uzman")).toHaveCount(0);
  await expect(referralPage.getByText("Kimler kazanabilir?")).toBeVisible();
  await expectNoAppHorizontalOverflow(page);

  await page.getByTestId("job-referral-withdraw-button").click();
  await expect(page.getByTestId("job-referral-withdraw-sheet")).toBeVisible();
  await page.getByTestId("job-referral-withdraw-amount").fill("0.5");
  await expect(page.getByTestId("job-referral-withdraw-submit")).toBeDisabled();
  await page.getByTestId("job-referral-withdraw-amount").fill("2500");
  await page.getByTestId("job-referral-withdraw-submit").click();
  await expect(page.locator("#toast")).toContainText("₺2.500 çekim talebi alındı.");

  await page.getByTestId("job-referral-open-flow").click();
  await expect(page.getByTestId("job-referral-flow")).toBeVisible();

  await page.getByTestId("job-referral-first-name").fill("Murat");
  await page.getByTestId("job-referral-last-name").fill("Kaya");
  await page.getByTestId("job-referral-phone").fill("05551234567");
  await page.getByTestId("job-referral-customer-next").click();

  await page.getByTestId("job-referral-sector-search").fill("Klima");
  await page.getByTestId("job-referral-sector-option").filter({ hasText: "Klima Tamiri" }).click();

  await page.getByTestId("job-referral-city-search").fill("Antalya");
  await page.getByTestId("job-referral-city-option").filter({ hasText: "Antalya" }).click();
  await page.getByTestId("job-referral-city-search").fill("Adıyaman");
  await expect(page.getByTestId("job-referral-location-next")).toBeDisabled();
  await page.getByTestId("job-referral-city-option").filter({ hasText: "Adıyaman" }).click();
  await page.getByTestId("job-referral-district").fill("Muratpaşa");
  await page.getByTestId("job-referral-location-next").click();

  await expect(page.getByText("Murat Kaya")).toBeVisible();
  await expect(page.getByText("Klima Tamiri")).toBeVisible();
  await expect(page.getByText("Adıyaman / Muratpaşa")).toBeVisible();
  await page.getByTestId("job-referral-submit").click();
  await expect(page.locator("#toast")).toContainText("İş satışı kaydı hazırlandı.");

  await page.getByTestId("header-info-button").click();
  await expect(page.getByTestId("info-score-list")).toBeVisible();
  await expect(page.getByTestId("app-sheet")).toContainText("İşi sen gönder, kazancı sen takip et");

  expect(errors).toEqual([]);
});
