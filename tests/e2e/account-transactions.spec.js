import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

test("account transactions show three-column ledger with lazy loading", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/account-transactions");
  await waitForApp(page);

  const accountPage = page.getByTestId("account-transactions-page");
  await expect(accountPage).toBeVisible();
  await expect(accountPage.getByText("İşlem tipi", { exact: true })).toBeVisible();
  await expect(accountPage.getByText("Tutar", { exact: true })).toBeVisible();
  await expect(accountPage.getByText("Kalan", { exact: true })).toBeVisible();
  await expect(accountPage.getByTestId("account-transaction-row")).toHaveCount(14);
  await expectNoAppHorizontalOverflow(page);

  await page.locator("#appRoot").evaluate((node) => {
    node.scrollTop = node.scrollHeight;
  });
  await expect.poll(() => page.getByTestId("account-transaction-row").count()).toBeGreaterThan(14);

  await expect(accountPage.getByText("Bakiye Yükleme").first()).toBeVisible();
  await expect(accountPage.getByText("Nakde Çevrilen Bonus").first()).toBeVisible();
  await expect(accountPage.getByText("İş İptali").first()).toBeVisible();

  expect(errors).toEqual([]);
});
