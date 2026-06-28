import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const route = (path) => `/#${path}`;

test("live support opens, connects and handles chat actions", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto(route("/support/live"));
  await waitForApp(page);

  await expect(page.getByTestId("live-support-page")).toBeVisible();
  await expect(page.getByTestId("app-bottom-bar")).toHaveCount(0);
  await expect(page.getByTestId("live-support-plan")).toBeVisible();
  await expect(page.getByTestId("live-support-plan-service")).toBeVisible();
  await expect(page.getByText("Ortalama yanıt süresi 2 dk")).toBeVisible();
  await expect(page.getByTestId("live-support-title")).toHaveCount(0);
  await expect(page.getByTestId("live-support-description")).toHaveCount(0);
  await expect(page.locator(".live-support-start-grid")).toHaveCount(0);
  await expect(page.locator(".live-support-start-form")).toHaveCount(0);
  await expect(page.locator(".live-support-open-ticket")).toHaveCount(0);
  await expect(page.locator(".live-support-status-strip")).toHaveCount(0);
  await expect(page.locator(".live-support-context-card")).toHaveCount(0);
  await expect(page.locator(".live-support-topic-strip")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Fotoğraf ekle" })).toHaveCount(0);

  await page.getByTestId("live-support-start").click();

  await expect(page.getByTestId("live-support-waiting")).toBeVisible();
  await expect(page.getByTestId("live-support-create-ticket")).toBeVisible();
  await expect(page.getByTestId("live-support-chat")).toBeVisible({ timeout: 7_000 });
  await expect(page.locator(".live-support-status-strip")).toHaveCount(0);
  await expect(page.locator(".live-support-context-card")).toHaveCount(0);
  await expect(page.locator(".live-support-topic-strip")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Fotoğraf ekle" })).toHaveCount(0);
  await expect(page.getByTestId("live-support-end")).toBeVisible();

  await page.getByTestId("live-support-input").fill("Merhaba, destek alabilir miyim?");
  await page.getByTestId("live-support-send").click();
  await expect(page.getByText("Merhaba, destek alabilir miyim?")).toBeVisible();
  await expect(page.getByTestId("live-support-typing")).toBeVisible();

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
