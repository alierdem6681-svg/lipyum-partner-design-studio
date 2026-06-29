import { expect, test } from "@playwright/test";

test.describe("Bottom Bar İşler menüsü", () => {
  test("İşler ekranı sade premium kart listesi ve lazy-load akışıyla açılır", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/?engine=vue#/my-jobs");

    await expect(page.getByTestId("app-header")).toBeVisible();
    await expect(page.getByRole("heading", { name: "İşler" })).toBeVisible();
    await expect(page.getByTestId("my-jobs-page")).toBeVisible();

    await expect(page.locator(".my-jobs-tabs")).toHaveCount(0);
    await expect(page.locator(".my-jobs-metrics")).toHaveCount(0);
    await expect(page.locator(".my-jobs-search-row")).toHaveCount(0);

    await expect(page.getByText("Müşteriyi Ara ve Randevu Ver")).toBeVisible();
    await expect(page.getByText("Klima Servisi").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /^Ara$/ }).first()).toBeVisible();
    await expect(page.getByTestId("my-jobs-card-482410")).toHaveCount(0);

    await page.evaluate(() => {
      const shell = document.querySelector(".v-shell__content");
      shell?.scrollTo(0, shell.scrollHeight);
    });
    await expect(page.getByTestId("my-jobs-card-482410")).toBeVisible();

    await page.getByTestId("my-jobs-card-482410").getByRole("button", { name: "Detay" }).click();
    await expect(page.getByTestId("my-jobs-detail-sheet")).toBeVisible();
    await expect(page.getByText("İş Detayı")).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});
