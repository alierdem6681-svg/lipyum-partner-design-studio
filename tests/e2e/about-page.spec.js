import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

test("about page supports editable 500 character profile intro", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/about");
  await waitForApp(page);

  await expect(page.getByTestId("app-header")).toContainText("Hakkımızda");
  await expect(page.getByTestId("app-header")).toContainText("Düzenle");
  await expect(page.getByText("Firma Bilgileri")).toBeVisible();
  await expect(page.getByText("Kurumsal")).toBeVisible();
  await expect(page.getByTestId("about-edit-button")).toBeVisible();
  await expect(page.getByText("Kendinizi, deneyiminizi ve sunduğunuz hizmetleri kısaca tanıtın.")).toHaveCount(0);
  await expect(page.getByTestId("about-character-count")).toHaveCount(0);
  await expect(page.getByText("Tamamlanan iş")).toHaveCount(0);
  await expect(page.getByText("Güven notu")).toHaveCount(0);

  await page.getByTestId("about-edit-button").click();
  await expect(page.getByTestId("about-editor-form")).toBeVisible();

  await page.getByTestId("about-account-type-select").selectOption("Bireysel");
  await page.getByTestId("about-company-name-input").fill("Ahmet Kaya Servis");
  await page.getByTestId("about-company-address-input").fill("Atatürk Mah. 123 Sk. No:45 K:2 D:4, Çankaya / Ankara");
  await page.getByTestId("about-tax-number-input").fill("987 654 3210");
  const longText = "Sektör deneyimi ve müşteri iletişimi güçlü bir servis profili. ".repeat(12);
  await page.getByTestId("about-textarea").fill(longText);

  const savedText = await page.getByTestId("about-textarea").inputValue();
  expect(savedText.length).toBe(500);
  await expect(page.getByText("0 karakter kaldı")).toBeVisible();

  await page.getByTestId("about-save-button").click();
  await expect(page.getByTestId("about-character-count")).toHaveCount(0);
  await expect(page.getByText("Bireysel")).toBeVisible();
  await expect(page.getByText("Ahmet Kaya Servis")).toBeVisible();
  await expect(page.getByText("987 654 3210")).toBeVisible();
  await expect(page.getByText(savedText.slice(0, 50), { exact: false })).toBeVisible();
  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});
