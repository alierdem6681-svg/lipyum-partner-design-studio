import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

for (const viewport of [
  { width: 320, height: 568 },
  { width: 360, height: 780 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
]) {
  test(`profile menu list aligns with profile card at ${viewport.width}px`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.setViewportSize(viewport);
    await page.goto("/#/profile");
    await waitForApp(page);

    const geometry = await page.evaluate(() => {
      const profile = document.querySelector('[data-testid="partner-profile-card"]')?.getBoundingClientRect();
      const section = document.querySelector('[data-testid="profile-menu-section"]')?.getBoundingClientRect();
      const list = document.querySelector('[data-testid="profile-menu-list"]')?.getBoundingClientRect();
      const rows = Array.from(document.querySelectorAll('[data-testid="profile-menu-card"]')).map((item) =>
        item.getBoundingClientRect(),
      );
      const statuses = Array.from(document.querySelectorAll(".profile-menu-row__status")).map((item) =>
        item.textContent.trim(),
      );
      const summary = document.querySelector('[data-testid="profile-menu-strength-summary"]')?.getBoundingClientRect();
      const maxTitleLines = Math.max(
        ...Array.from(document.querySelectorAll(".profile-menu-row__title")).map((label) => {
          const style = window.getComputedStyle(label);
          const lineHeight = Number.parseFloat(style.lineHeight) || Number.parseFloat(style.fontSize) * 1.2;
          return label.getBoundingClientRect().height / lineHeight;
        }),
      );
      const maxDescriptionLines = Math.max(
        ...Array.from(document.querySelectorAll(".profile-menu-row__description")).map((label) => {
          const style = window.getComputedStyle(label);
          const lineHeight = Number.parseFloat(style.lineHeight) || Number.parseFloat(style.fontSize) * 1.2;
          return label.getBoundingClientRect().height / lineHeight;
        }),
      );
      const rowWidthSpread = rows.length ? Math.max(...rows.map((row) => row.width)) - Math.min(...rows.map((row) => row.width)) : 999;
      const rowHeightSpread = rows.length ? Math.max(...rows.map((row) => row.height)) - Math.min(...rows.map((row) => row.height)) : 999;
      const verticalGaps = rows.slice(1).map((row, index) => Math.round(row.top - rows[index].bottom));
      return {
        rowCount: rows.length,
        statusCount: statuses.length,
        statuses,
        leftDelta: profile && section ? Math.abs(profile.left - section.left) : 999,
        rightDelta: profile && section ? Math.abs(profile.right - section.right) : 999,
        listLeftDelta: profile && list ? Math.abs(profile.left - list.left) : 999,
        listRightDelta: profile && list ? Math.abs(profile.right - list.right) : 999,
        firstRowLeftDelta: profile && rows[0] ? Math.abs(profile.left - rows[0].left) : 999,
        firstRowRightDelta: profile && rows[0] ? Math.abs(profile.right - rows[0].right) : 999,
        rowWidthSpread,
        rowHeightSpread,
        minRowHeight: rows.length ? Math.min(...rows.map((row) => row.height)) : 0,
        maxTitleLines,
        maxDescriptionLines,
        minVerticalGap: verticalGaps.length ? Math.min(...verticalGaps) : 0,
        summaryWidthDelta: profile && summary ? Math.abs(profile.width - summary.width) : 999,
        summaryText: document.querySelector('[data-testid="profile-menu-strength-summary"]')?.textContent ?? "",
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(geometry.rowCount).toBe(8);
    expect(geometry.statusCount).toBe(8);
    expect(geometry.statuses).toEqual(expect.arrayContaining(["Tamam", "+4 puan", "Eksik", "+2 puan", "Yeni"]));
    expect(geometry.leftDelta).toBeLessThanOrEqual(2);
    expect(geometry.rightDelta).toBeLessThanOrEqual(2);
    expect(geometry.listLeftDelta).toBeLessThanOrEqual(2);
    expect(geometry.listRightDelta).toBeLessThanOrEqual(2);
    expect(geometry.firstRowLeftDelta).toBeLessThanOrEqual(2);
    expect(geometry.firstRowRightDelta).toBeLessThanOrEqual(2);
    expect(geometry.rowWidthSpread).toBeLessThanOrEqual(1);
    expect(geometry.rowHeightSpread).toBeLessThanOrEqual(4);
    expect(geometry.minRowHeight).toBeGreaterThanOrEqual(60);
    expect(geometry.minVerticalGap).toBeGreaterThanOrEqual(6);
    expect(geometry.maxTitleLines).toBeLessThanOrEqual(1.15);
    expect(geometry.maxDescriptionLines).toBeLessThanOrEqual(1.15);
    expect(geometry.summaryWidthDelta).toBeLessThanOrEqual(2);
    expect(geometry.summaryText).toContain("Profil Gücünüz");
    expect(geometry.summaryText).toContain("78%");
    expect(geometry.summaryText).toContain("+28");
    expect(geometry.overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}
