import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

async function ctaSurfaceContract(page) {
  return page.locator(".cta-lightning-wrap").first().evaluate((element) => {
    const host = window.getComputedStyle(element);
    const before = window.getComputedStyle(element, "::before");
    const after = window.getComputedStyle(element, "::after");

    return {
      overflow: host.overflow,
      borderRadius: Number.parseFloat(host.borderRadius || "0"),
      beforeContent: before.content,
      afterContent: after.content,
      beforeBackground: before.backgroundImage,
      afterBackground: after.backgroundImage,
      beforeAnimation: before.animationName,
      afterAnimation: after.animationName,
      hostBackground: host.backgroundImage,
    };
  });
}

test("bottom CTA does not render mist pseudo layers", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  const cta = page.locator(".cta-lightning-wrap").first();
  await expect(cta).toBeVisible();

  const contract = await ctaSurfaceContract(page);
  expect(contract.overflow).toBe("hidden");
  expect(contract.borderRadius).toBeGreaterThanOrEqual(18);
  expect(contract.beforeContent).toBe("none");
  expect(contract.afterContent).toBe("none");
  expect(contract.beforeBackground).toBe("none");
  expect(contract.afterBackground).toBe("none");
  expect(contract.hostBackground).not.toContain("255, 255, 255");
  expect(contract.beforeAnimation).toBe("none");
  expect(contract.afterAnimation).toBe("none");
  expect(errors).toEqual([]);
});

test("bottom CTA still respects reduced motion without mist layers", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  const contract = await ctaSurfaceContract(page);
  expect(contract.beforeContent).toBe("none");
  expect(contract.afterContent).toBe("none");
  expect(contract.beforeAnimation).toBe("none");
  expect(contract.afterAnimation).toBe("none");
  expect(errors).toEqual([]);
});
