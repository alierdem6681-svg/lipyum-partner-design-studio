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
      const grid = document.querySelector('[data-testid="profile-menu-grid"]')?.getBoundingClientRect();
      const cards = Array.from(document.querySelectorAll('[data-testid="profile-menu-card"]')).map((item) => item.getBoundingClientRect());
      const maxLabelLines = Math.max(...Array.from(document.querySelectorAll(".profile-menu-label")).map((label) => {
        const style = window.getComputedStyle(label);
        const lineHeight = Number.parseFloat(style.lineHeight) || Number.parseFloat(style.fontSize) * 1.2;
        return label.getBoundingClientRect().height / lineHeight;
      }));
      const rows = new Set(cards.map((card) => Math.round(card.top)));
      return {
        cardCount: cards.length,
        rowCount: rows.size,
        leftDelta: profile && section ? Math.abs(profile.left - section.left) : 999,
        rightDelta: profile && section ? Math.abs(profile.right - section.right) : 999,
        gridLeftDelta: profile && grid ? Math.abs(profile.left - grid.left) : 999,
        gridRightDelta: profile && grid ? Math.abs(profile.right - grid.right) : 999,
        firstCardLeftDelta: profile && cards[0] ? Math.abs(profile.left - cards[0].left) : 999,
        lastCardRightDelta: profile && cards[3] ? Math.abs(profile.right - cards[3].right) : 999,
        cardSpread: cards.length ? Math.max(...cards.map((card) => card.width)) - Math.min(...cards.map((card) => card.width)) : 999,
        maxLabelLines,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(geometry.cardCount).toBe(8);
    expect(geometry.rowCount).toBe(2);
    expect(geometry.leftDelta).toBeLessThanOrEqual(2);
    expect(geometry.rightDelta).toBeLessThanOrEqual(2);
    expect(geometry.gridLeftDelta).toBeLessThanOrEqual(2);
    expect(geometry.gridRightDelta).toBeLessThanOrEqual(2);
    expect(geometry.firstCardLeftDelta).toBeLessThanOrEqual(2);
    expect(geometry.lastCardRightDelta).toBeLessThanOrEqual(2);
    expect(geometry.cardSpread).toBeLessThanOrEqual(1);
    expect(geometry.maxLabelLines).toBeLessThanOrEqual(2.15);
    expect(geometry.overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}
