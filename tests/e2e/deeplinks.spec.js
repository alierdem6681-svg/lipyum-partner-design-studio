import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

async function expectRoute(page, route) {
  await waitForApp(page);
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain(route);
}

test("route query parameter opens the requested app route", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/?route=/wallet");
  await expectRoute(page, "/wallet");
  await expect(page.getByTestId("wallet-page")).toBeVisible();
  expect(errors).toEqual([]);
});

test("deeplink alias opens support ticket page", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/?deeplink=support-new");
  await expectRoute(page, "/support/new");
  await expect(page.getByTestId("support-ticket-page")).toBeVisible();
  await expect(page.getByTestId("support-ticket-form")).toBeVisible();
  expect(errors).toEqual([]);
});

test("partner path deeplink opens support ticket page", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/partner/support/new");
  await expectRoute(page, "/support/new");
  await expect(page.getByTestId("support-ticket-page")).toBeVisible();
  await expect(page.getByTestId("support-ticket-form")).toBeVisible();
  expect(errors).toEqual([]);
});

test("new V10 deeplinks open live support and partner card preview", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/?deeplink=support-live");
  await expectRoute(page, "/support/live");
  await expect(page.getByTestId("live-support-page")).toBeVisible();

  await page.goto("/partner/card");
  await expectRoute(page, "/partner-card-preview");
  await expect(page.getByTestId("partner-card-preview")).toBeVisible();

  expect(errors).toEqual([]);
});

test("unknown deeplink falls back to home", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/?deeplink=does-not-exist");
  await expectRoute(page, "/home");
  await expect(page.getByTestId("app-header").first()).toBeVisible();
  expect(errors).toEqual([]);
});
