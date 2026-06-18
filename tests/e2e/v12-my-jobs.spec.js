import { expect, test } from "@playwright/test";

test("V12 Vue my-jobs route keeps filter labels intact", async ({ page }) => {
  await page.goto("/?engine=vue#/my-jobs");
  for (const label of ["Yeni İşler", "Aktif", "Tekliflerim", "Tamamlananlar", "Sorunlu"]) {
    await expect(page.getByRole("button", { name: label })).toBeVisible();
  }
  await page.getByRole("button", { name: "Tekliflerim" }).click();
  await expect(page.getByRole("button", { name: "Tekliflerim" })).toHaveClass(/is-active/);
});

