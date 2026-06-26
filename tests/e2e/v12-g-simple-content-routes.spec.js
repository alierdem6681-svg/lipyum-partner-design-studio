import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const simpleRoutes = [
  "/regions",
  "/working-hours",
  "/team",
  "/capacity",
  "/strategy",
  "/account-settings",
  "/notification-settings",
  "/contact-settings",
  "/bonus",
  "/performance-score",
  "/customers",
  "/invoices",
  "/income-expense",
  "/appointment-link",
];

for (const route of simpleRoutes) {
  test(`V12-G simple content route is clean for ${route}`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(`/#${route}`);
    await waitForApp(page);

    await expect(page.getByTestId("app-header")).toHaveCount(1);
    await expect(page.getByTestId("app-bottom-bar")).toHaveCount(1);
    await expect(page.getByTestId("clickable-outcome-summary")).toHaveCount(0);
    await expect(page.getByText(/Clickable coverage/i)).toHaveCount(0);
    await expect(page.getByText(/compatibility bridge/i)).toHaveCount(0);
    await expect(page.getByText(/^(profile|support|growth|referral|finance)$/i)).toHaveCount(0);
    await expect(page.locator("[data-testid^='route-']")).toHaveCount(1);
    await expectNoAppHorizontalOverflow(page);

    const visibleText = await page.locator("#appRoot").innerText();
    expect(visibleText.length).toBeGreaterThan(20);
    expect(errors).toEqual([]);
  });
}
