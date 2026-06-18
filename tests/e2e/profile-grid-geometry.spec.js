import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

for (const viewport of [
  { width: 320, height: 568 },
  { width: 360, height: 780 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
]) {
  test(`V11 profile grid aligns with profile card at ${viewport.width}px`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.setViewportSize(viewport);
    await page.goto("/#/profile");
    await waitForApp(page);

    const geometry = await page.evaluate(() => {
      const profile = document.querySelector('[data-testid="partner-profile-card"]')?.getBoundingClientRect();
      const section = document.querySelector('[data-testid="profile-menu-section"]')?.getBoundingClientRect();
      const cards = Array.from(document.querySelectorAll('[data-testid="profile-menu-card"]')).map((item) => item.getBoundingClientRect());
      const labelsWrapped = Array.from(document.querySelectorAll(".profile-menu-label")).some((label) => {
        const style = window.getComputedStyle(label);
        const lineHeight = Number.parseFloat(style.lineHeight) || Number.parseFloat(style.fontSize) * 1.2;
        return label.getBoundingClientRect().height > lineHeight * 1.45;
      });
      return {
        leftDelta: profile && section ? Math.abs(profile.left - section.left) : 999,
        rightDelta: profile && section ? Math.abs(profile.right - section.right) : 999,
        cardSpread: cards.length ? Math.max(...cards.map((card) => card.width)) - Math.min(...cards.map((card) => card.width)) : 999,
        labelsWrapped,
      };
    });

    expect(geometry.leftDelta).toBeLessThanOrEqual(2);
    expect(geometry.rightDelta).toBeLessThanOrEqual(2);
    expect(geometry.cardSpread).toBeLessThanOrEqual(1);
    expect(geometry.labelsWrapped).toBeFalsy();
    expect(errors).toEqual([]);
  });
}
