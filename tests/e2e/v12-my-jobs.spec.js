import { expect, test } from "@playwright/test";

test.describe("Bottom Bar İşler menüsü", () => {
  test("V12-E İşler ekranı aksiyonlar, fırsatlar ve detay akışıyla açılır", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/?engine=vue#/my-jobs");

    await expect(page.getByTestId("app-header")).toBeVisible();
    await expect(page.getByRole("heading", { name: "İşler" })).toBeVisible();
    await expect(page.getByTestId("my-jobs-page")).toBeVisible();

    await expect(page.getByTestId("my-jobs-tab-actions")).toHaveClass(/is-active/);
    await expect(page.getByText("Müşteriyi Ara ve Randevu Ver")).toBeVisible();
    await expect(page.getByText("Klima Servisi").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /^Ara$/ }).first()).toBeVisible();

    await page.getByTestId("my-jobs-tab-opportunities").click();
    await expect(page.getByText("Size en uygun 8 iş bulundu")).toBeVisible();
    await expect(page.getByText("Yüksek Uyum %92")).toBeVisible();

    await page.getByRole("button", { name: "İncele" }).first().click();
    await expect(page.getByTestId("my-jobs-detail-sheet")).toBeVisible();
    await expect(page.getByText("Fırsat Detayı")).toBeVisible();
    await page.getByTestId("sheet-close-button").click();

    await page.getByTestId("my-jobs-tab-active").click();
    await expect(page.getByText("Devam Ediyor")).toBeVisible();
    await expect(page.getByRole("button", { name: /Aktif işi aç/ }).first()).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});
