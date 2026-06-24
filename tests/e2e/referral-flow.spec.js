import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("partner referral rail, invite and partner detail interactions work", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/referral");
  await waitForApp(page);

  await expect(page.getByTestId("referral-page")).toHaveCount(1);
  await page.getByTestId("referral-invite-button").click();
  await expect(page.locator("#toast").getByText(/WhatsApp davet mesajı/)).toBeVisible();

  const rail = page.getByTestId("referral-rail");
  await expect(rail).toBeVisible();
  await rail.hover();
  await page.mouse.down();
  await page.mouse.move(120, 0);
  await page.mouse.up();

  await page.getByRole("button", { name: /Görevlerim/ }).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toContain("/referral/tasks");
  await expect(page.getByTestId("referral-tasks-page")).toBeVisible();
  await expect(page.getByTestId("referral-task-card")).toBeVisible();
  await page.getByTestId("referral-result-button").click();
  await expect(page.getByTestId("app-modal")).toBeVisible();
  await expect(page.getByTestId("app-modal")).toContainText("Sonuç");
  await page.getByRole("button", { name: "Aradım, ulaşamadım" }).click();

  await page.goto("/#/referral/partners");
  await waitForApp(page);
  await expect(page.getByTestId("referral-partner-card").first()).toBeVisible();
  await page.getByTestId("referral-partner-card").first().click();
  await expect(page.getByTestId("referral-partner-detail")).toBeVisible();

  expect(errors).toEqual([]);
});
