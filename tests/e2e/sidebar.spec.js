import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

async function openSidebar(page) {
  await page.getByTestId("hamburger-button").click();
  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();
}

test("hamburger opens and close button closes sidebar", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await openSidebar(page);
  await page.getByTestId("sidebar-close").click();
  await expect(page.getByTestId("sidebar-drawer")).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("sidebar overlay click closes drawer", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await openSidebar(page);
  await page.evaluate(() => document.querySelector('[data-testid="sidebar-overlay"]')?.click());
  await expect(page.getByTestId("sidebar-drawer")).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("sidebar routes kazanc ortakligi items and closes after navigation", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await openSidebar(page);
  await page.getByRole("button", { name: "Partner Davet Programı" }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/referral");
  await expect(page.getByTestId("sidebar-drawer")).toHaveCount(0);

  await page.goto("/#/home");
  await waitForApp(page);
  await openSidebar(page);
  await page.getByRole("button", { name: "İş Yönlendirme Programı" }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/job-referral");
  await expect(page.getByTestId("sidebar-drawer")).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("sidebar has V10 support entries without duplicate sticky support card", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await openSidebar(page);
  await expect(page.getByRole("button", { name: "Yardım ve Destek" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Talep Oluştur" })).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Canlı Destek" })).toHaveCount(1);
  await expect(page.locator(".drawer-support-card")).toHaveCount(0);

  expect(errors).toEqual([]);
});
