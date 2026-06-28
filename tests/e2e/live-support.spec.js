import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const route = (path) => `/#${path}`;

test("live support opens, connects and handles chat actions", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto(route("/support/live"));
  await waitForApp(page);

  await expect(page.getByTestId("live-support-page")).toBeVisible();
  await expect(page.getByTestId("app-bottom-bar")).toHaveCount(0);
  await expect(page.getByTestId("live-support-title")).toHaveValue("İş sayıları hakkında destek");
  await expect(page.getByLabel("Gold öncelikli").getByText("Gold")).toBeVisible();

  await page.getByRole("button", { name: /Ödeme \/ bakiye/i }).click();
  await page.getByTestId("live-support-title").fill("Ödeme hakkında destek");
  await page.getByTestId("live-support-description").fill("Bakiye hareketim için canlı destek istiyorum.");
  await page.getByTestId("live-support-start").click();

  await expect(page.getByTestId("live-support-waiting")).toBeVisible();
  await expect(page.getByTestId("live-support-create-ticket")).toBeVisible();
  await expect(page.getByTestId("live-support-chat")).toBeVisible({ timeout: 7_000 });
  await expect(page.getByRole("button", { name: "Ödeme" })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Teknik sorun" }).click();
  await expect(page.getByRole("button", { name: "Teknik sorun" })).toHaveAttribute("aria-pressed", "true");

  await page.getByTestId("live-support-input").fill("Merhaba, destek alabilir miyim?");
  await page.getByTestId("live-support-send").click();
  await expect(page.getByText("Merhaba, destek alabilir miyim?")).toBeVisible();
  await expect(page.getByTestId("live-support-typing")).toBeVisible();

  await page.getByRole("button", { name: "Fotoğraf ekle" }).click();
  await expect(page.getByText("ekran-goruntusu.png")).toBeVisible();

  await page.getByTestId("live-support-end").click();
  await expect(page.getByTestId("live-support-ended")).toBeVisible();

  expect(errors).toEqual([]);
});

test("live support resolved state supports rating and reopen", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto(route("/support/live?liveSupportState=resolved"));
  await waitForApp(page);

  await expect(page.getByTestId("live-support-chat")).toBeVisible();
  await expect(page.getByText("Destek deneyiminizi değerlendirin")).toBeVisible();
  await page.getByRole("radio").nth(4).click();
  await page.getByPlaceholder("Kısa yorum ekleyin").fill("Hızlı destek aldım.");
  await page.getByRole("button", { name: /Yeniden aç/i }).click();
  await expect(page.getByTestId("live-support-chat").getByText("Talep yeniden açıldı.")).toBeVisible();

  expect(errors).toEqual([]);
});

for (const width of [320, 360, 393, 430, 768]) {
  test(`live support has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 852 });
    await page.goto(route("/support/live"));
    await waitForApp(page);
    await expectNoAppHorizontalOverflow(page);
  });
}
