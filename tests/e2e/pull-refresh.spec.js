import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

test("pulling from the top expands a silent refresh area with spinner", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/reviews");
  await waitForApp(page);

  await page.locator("#appRoot").evaluate((root) => {
    root.scrollTop = 0;
    const createTouch = (clientY) => new Touch({
      identifier: 1,
      target: root,
      clientX: root.getBoundingClientRect().left + root.clientWidth / 2,
      clientY,
      radiusX: 2,
      radiusY: 2,
      force: 0.5,
    });
    const dispatch = (type, clientY, active = true) => {
      const touch = createTouch(clientY);
      root.dispatchEvent(new TouchEvent(type, {
        bubbles: true,
        cancelable: true,
        touches: active ? [touch] : [],
        targetTouches: active ? [touch] : [],
        changedTouches: [touch],
      }));
    };

    dispatch("touchstart", 120);
    dispatch("touchmove", 270);
  });

  const indicator = page.getByTestId("pull-refresh-indicator");
  await expect(indicator).toHaveClass(/is-visible/);
  await expect(indicator.locator(".v-icon")).toHaveCount(1);
  await expect(indicator).toHaveText("");
  await expect.poll(
    () => indicator.evaluate((node) => Math.round(node.getBoundingClientRect().height)),
    { timeout: 1000 },
  ).toBeGreaterThanOrEqual(60);

  await page.locator("#appRoot").evaluate((root) => {
    const touch = new Touch({
      identifier: 1,
      target: root,
      clientX: root.getBoundingClientRect().left + root.clientWidth / 2,
      clientY: 270,
      radiusX: 2,
      radiusY: 2,
      force: 0,
    });
    root.dispatchEvent(new TouchEvent("touchend", {
      bubbles: true,
      cancelable: true,
      touches: [],
      targetTouches: [],
      changedTouches: [touch],
    }));
  });

  await expect(indicator).toHaveClass(/is-refreshing/);
  await expect(indicator).toHaveText("");
  await expect(indicator).not.toHaveClass(/is-refreshing/, { timeout: 1500 });
  const finalHeight = await indicator.evaluate((node) => Math.round(node.getBoundingClientRect().height));
  expect(finalHeight).toBe(0);
  await expect(page.locator(".v-toast, [data-testid='app-toast']")).toHaveCount(0);
  expect(errors).toEqual([]);
});
