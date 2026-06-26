import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

test("verifications page shows verified phone and three verification actions", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/verifications");
  await waitForApp(page);

  await expect(page.getByTestId("verifications-page")).toBeVisible();
  await expect(page.getByTestId("verified-phone-row")).toContainText("Cep telefonu numarası");
  await expect(page.getByTestId("verified-phone-row")).toContainText("Doğrulanmış");

  await expect(page.getByTestId("verification-action-email")).toContainText("Mail adresimi doğrula");
  await expect(page.getByTestId("verification-action-identity")).toContainText("TC kimlik numaramı doğrula");
  await expect(page.getByTestId("verification-action-tax")).toContainText("Vergi levhamı doğrula");

  await page.getByTestId("verification-action-tax-button").click();
  await expect(page.getByTestId("app-toast")).toContainText("Vergi levhası");

  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test("profile verifications shortcut opens the verifications page", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/profile");
  await waitForApp(page);

  await page.getByTestId("profile-menu-strength-summary").click();
  await page.getByTestId("profile-menu-card").filter({ hasText: "Doğrulamalar" }).click();

  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/verifications");
  await expect(page.getByTestId("verified-phone-row")).toContainText("Doğrulanmış");

  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});
