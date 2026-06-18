import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

async function mistOpacity(page, pseudo = "::before") {
  return page.locator(".cta-lightning-wrap").first().evaluate((element, pseudoName) => {
    const style = window.getComputedStyle(element, pseudoName);
    return Number.parseFloat(style.opacity || "0");
  }, pseudo);
}

async function mistContract(page) {
  return page.locator(".cta-lightning-wrap").first().evaluate((element) => {
    const before = window.getComputedStyle(element, "::before");
    const after = window.getComputedStyle(element, "::after");
    return {
      beforeDelay: Number.parseFloat(before.animationDelay || "0"),
      afterDelay: Number.parseFloat(after.animationDelay || "0"),
      beforeFillMode: before.animationFillMode,
      afterFillMode: after.animationFillMode,
      beforeBackground: before.backgroundImage,
      afterBackground: after.backgroundImage,
    };
  });
}

test("V11 CTA mist starts delayed, stays clipped and becomes visible", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  const cta = page.locator(".cta-lightning-wrap").first();
  await expect(cta).toBeVisible();

  const hostStyle = await cta.evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      overflow: style.overflow,
      borderRadius: style.borderRadius,
    };
  });
  expect(hostStyle.overflow).toBe("hidden");
  expect(Number.parseFloat(hostStyle.borderRadius)).toBeGreaterThan(20);

  const contract = await mistContract(page);
  expect(contract.beforeDelay).toBeGreaterThanOrEqual(2);
  expect(contract.afterDelay).toBeGreaterThanOrEqual(2.3);
  expect(contract.beforeFillMode).toContain("both");
  expect(contract.afterFillMode).toContain("both");
  expect(contract.beforeBackground).toContain("rgba(255, 255, 255");
  expect(contract.afterBackground).toContain("rgba(255, 255, 255");

  await expect
    .poll(() => mistOpacity(page, "::before"), { timeout: 7000 })
    .toBeGreaterThan(0.05);

  expect(errors).toEqual([]);
});

test("V11 CTA mist respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  const animation = await page.locator(".cta-lightning-wrap").first().evaluate((element) => {
    const before = window.getComputedStyle(element, "::before");
    const after = window.getComputedStyle(element, "::after");
    return {
      before: before.animationName,
      after: after.animationName,
    };
  });

  expect(animation.before).toBe("none");
  expect(animation.after).toBe("none");
  expect(errors).toEqual([]);
});
