import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

async function ctaSurfaceContract(page) {
  return page.locator(".cta-lightning-wrap").first().evaluate((element) => {
    const host = window.getComputedStyle(element);
    const before = window.getComputedStyle(element, "::before");
    const after = window.getComputedStyle(element, "::after");
    const parentAfter = window.getComputedStyle(element.closest(".bottom-item"), "::after");

    return {
      overflow: host.overflow,
      borderRadius: Number.parseFloat(host.borderRadius || "0"),
      animation: host.animationName,
      boxShadow: host.boxShadow,
      beforeContent: before.content,
      afterContent: after.content,
      parentAfterContent: parentAfter.content,
      beforeBackground: before.backgroundImage,
      afterBackground: after.backgroundImage,
      beforeAnimation: before.animationName,
      afterAnimation: after.animationName,
      hostBackground: host.backgroundImage,
    };
  });
}

function expectNoMistLayers(contract) {
  expect(contract.beforeContent).toBe("none");
  expect(contract.afterContent).toBe("none");
  expect(contract.parentAfterContent).toBe("none");
  expect(contract.beforeBackground).toBe("none");
  expect(contract.afterBackground).toBe("none");
  expect(contract.hostBackground).not.toContain("255, 255, 255");
  expect(contract.boxShadow).not.toContain("255, 255, 255");
  expect(contract.boxShadow).not.toContain("255 255 255");
  expect(contract.animation).toBe("none");
  expect(contract.beforeAnimation).toBe("none");
  expect(contract.afterAnimation).toBe("none");
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
  expectNoMistLayers(contract);
  expect(errors).toEqual([]);
});

test("bottom CTA stays clean while pressed", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  const cta = page.locator(".cta-lightning-wrap").first();
  const box = await cta.boundingBox();
  expect(box).toBeTruthy();

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  const pressedContract = await ctaSurfaceContract(page);
  await page.mouse.up();

  expectNoMistLayers(pressedContract);
  expect(errors).toEqual([]);
});

test("bottom CTA still respects reduced motion without mist layers", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  const contract = await ctaSurfaceContract(page);
  expectNoMistLayers(contract);
  expect(errors).toEqual([]);
});
