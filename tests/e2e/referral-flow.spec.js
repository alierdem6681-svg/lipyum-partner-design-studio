import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("partner referral rail, invite, tasks and partner detail interactions work", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/referral");
  await waitForApp(page);

  await expect(page.getByTestId("referral-page")).toHaveCount(1);
  await expect(page.getByTestId("app-bottom-bar")).toHaveCount(0);
  await expect(page.locator(".referral-hero .referral-info-button")).toHaveCount(0);
  await expect(page.getByTestId("referral-guide-card")).toContainText("Kayıt et");
  await expect(page.getByTestId("referral-guide-card")).toContainText("İş aldır");
  await expect(page.getByTestId("referral-guide-card")).toContainText("Bakiye yüklet");

  await page.getByTestId("referral-invite-button").click();
  await expect(page.getByTestId("referral-invite-confirmation")).toBeVisible();
  await expect(page.getByTestId("referral-invite-confirmation")).toContainText("Aynı cep numarasıyla kayıt olursa");
  await page.getByTestId("sheet-close-button").click();

  const rail = page.getByTestId("referral-rail");
  await expect(rail).toBeVisible();
  await rail.hover();
  await page.mouse.down();
  await page.mouse.move(120, 0);
  await page.mouse.up();

  await page.getByTestId("referral-view-all").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/referral/tasks");
  await expect(page.getByTestId("referral-tasks-page")).toBeVisible();
  await expect(page.getByTestId("referral-tasks-page")).toContainText("Bugünkü kazanç görevlerin");
  await expect(page.getByTestId("referral-task-row").first()).toContainText("İletişime geçtim");

  await page.goto("/#/referral");
  await waitForApp(page);
  await page.getByTestId("referral-view-partners").click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/referral/partners");
  await expect(page.getByTestId("referral-partner-filter")).toContainText("Kayıt olmayanlar");
  await expect(page.getByTestId("referral-partner-filter")).toContainText("Bakiye yüklemeyenler");
  await expect(page.getByTestId("referral-partner-card").first()).toBeVisible();
  await expect(page.getByTestId("referral-partner-card").first()).toContainText("Ahmet Kaya");

  await page.goto("/#/referral");
  await waitForApp(page);
  await page.getByTestId("referral-partner-card").first().click();
  await expect(page.getByTestId("referral-partner-detail")).toBeVisible();

  expect(errors).toEqual([]);
});
