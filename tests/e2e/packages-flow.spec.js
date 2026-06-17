import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("growth package builder and checkout mock flow is clickable", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/packages");
  await waitForApp(page);

  await expect(page.getByText("Hemen Kazanmaya Başlayın")).toBeVisible();
  await page.getByRole("button", { name: /Hemen Kazanmaya Başla/ }).click();
  await expect(page.getByText("1/3 • Sektör seç")).toBeVisible();

  await page.getByRole("button", { name: "Devam Et" }).click();
  await expect(page.getByText("2/3 • İl seç")).toBeVisible();
  await page.getByRole("button", { name: "Devam Et" }).click();
  await expect(page.getByText("3/3 • İlçe seç")).toBeVisible();
  await page.getByRole("button", { name: "Ödeme Özetine Geç" }).click();
  await expect(page.getByText("Ödemeyi Tamamla")).toBeVisible();
  await page.getByRole("button", { name: /Ödemeyi Tamamla/ }).click();
  await expect(page.getByText("Paket ödeme adımı hazırlandı")).toBeVisible();

  expect(errors).toEqual([]);
});
