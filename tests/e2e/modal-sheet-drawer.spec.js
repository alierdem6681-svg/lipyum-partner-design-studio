import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

async function dragHandleDown(page) {
  await page.getByTestId("app-sheet-drag-handle").evaluate((node) => {
    const startY = node.getBoundingClientRect().top + 2;
    const pointerId = 11;
    node.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientY: startY, pointerId }));
    node.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientY: startY + 34, pointerId }));
    node.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientY: startY + 34, pointerId }));
  });
}

test("V10 sheet, drawer and partner share panel open and close cleanly", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await page.getByRole("button", { name: /Krediye Çevir/ }).first().click();
  await expect(page.getByTestId("sheet-close-button")).toBeVisible();
  await page.getByTestId("sheet-close-button").click();
  await expect(page.getByTestId("sheet-close-button")).toHaveCount(0);

  await page.getByTestId("hamburger-button").click();
  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();
  await page.getByTestId("sidebar-close").click();
  await expect(page.getByTestId("sidebar-drawer")).toHaveCount(0);

  await page.goto("/#/partner-card-preview");
  await waitForApp(page);
  await page.getByTestId("partner-preview-header-share").click();
  await expect(page.getByTestId("partner-share-options")).toBeVisible();
  await expect(page.getByTestId("partner-share-option-whatsapp")).toBeVisible();
  await expect(page.getByTestId("partner-share-suboptions-whatsapp")).toBeVisible();
  await page.getByTestId("sheet-close-button").click();
  await expect(page.getByTestId("partner-share-options")).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("shared app sheet keeps side margins, sits flush to bottom and closes by dragging the handle down", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/leaderboard");
  await waitForApp(page);

  await page.getByTestId("app-header").getByTestId("header-info-button").click();
  await expect(page.getByTestId("app-sheet")).toBeVisible();

  const metrics = await page.getByTestId("app-sheet").evaluate((sheet) => {
    const rect = sheet.getBoundingClientRect();
    const style = window.getComputedStyle(sheet);
    return {
      left: rect.left,
      right: window.innerWidth - rect.right,
      bottom: window.innerHeight - rect.bottom,
      width: rect.width,
      viewportWidth: window.innerWidth,
      bottomLeftRadius: style.borderBottomLeftRadius,
      bottomRightRadius: style.borderBottomRightRadius,
    };
  });

  expect(metrics.width).toBeLessThanOrEqual(Math.min(430, metrics.viewportWidth - 12));
  expect(metrics.left).toBeGreaterThanOrEqual(6);
  expect(metrics.right).toBeGreaterThanOrEqual(6);
  expect(metrics.bottom).toBeLessThanOrEqual(1);
  expect(metrics.bottomLeftRadius).toBe("0px");
  expect(metrics.bottomRightRadius).toBe("0px");

  await dragHandleDown(page);
  await expect(page.getByTestId("app-sheet")).toHaveCount(0);

  await page.getByTestId("app-header").getByTestId("header-info-button").click();
  await expect(page.getByTestId("app-sheet")).toBeVisible();
  await page.getByTestId("app-sheet-overlay").click({ position: { x: 4, y: 4 } });
  await expect(page.getByTestId("app-sheet")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("shared app modal closes when clicking outside the modal panel", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/profile");
  await waitForApp(page);

  await page.getByTestId("partner-profile-avatar-button").click();
  await expect(page.getByTestId("app-modal")).toBeVisible();
  await page.getByTestId("app-modal-overlay").click({ position: { x: 4, y: 4 } });
  await expect(page.getByTestId("app-modal")).toHaveCount(0);
  expect(errors).toEqual([]);
});
