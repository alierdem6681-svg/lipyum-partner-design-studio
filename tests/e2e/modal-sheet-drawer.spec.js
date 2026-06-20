import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

async function dragHandleDown(page) {
  await page.getByTestId("app-sheet-drag-handle").evaluate((node) => {
    const startY = node.getBoundingClientRect().top + 2;
    const pointerId = 11;
    node.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientY: startY, pointerId }));
    node.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientY: startY + 88, pointerId }));
    node.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientY: startY + 88, pointerId }));
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
  await page.getByTestId("partner-preview-share-button").click();
  await expect(page.getByTestId("partner-share-options")).toBeVisible();
  await expect(page.getByTestId("partner-share-option-whatsapp")).toBeVisible();
  await page.getByTestId("sheet-close-button").click();
  await expect(page.getByTestId("partner-share-options")).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("shared app sheet keeps side margins and closes by dragging the handle down", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  await page.getByRole("button", { name: "Performans skoru nedir?" }).click();
  await expect(page.getByTestId("app-sheet")).toBeVisible();

  const metrics = await page.getByTestId("app-sheet").evaluate((sheet) => {
    const rect = sheet.getBoundingClientRect();
    return {
      left: rect.left,
      right: window.innerWidth - rect.right,
      width: rect.width,
      viewportWidth: window.innerWidth,
    };
  });

  expect(metrics.width).toBeLessThanOrEqual(Math.min(430, metrics.viewportWidth - 20));
  expect(metrics.left).toBeGreaterThanOrEqual(10);
  expect(metrics.right).toBeGreaterThanOrEqual(10);

  await dragHandleDown(page);
  await expect(page.getByTestId("app-sheet")).toHaveCount(0);
  expect(errors).toEqual([]);
});
