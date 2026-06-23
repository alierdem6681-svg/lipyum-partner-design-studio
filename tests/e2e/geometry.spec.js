import { expect, test } from "@playwright/test";
import { bottomBarHiddenRoutes, collectConsoleErrors, criticalRoutes, ctaHiddenRoutes, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const geometryRoutes = criticalRoutes;

const viewports = [
  { name: "iphone15-simulator", width: 960, height: 980 },
  { name: "mobile-360", width: 360, height: 780 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
];

async function expectVisibleHeader(page) {
  const header = page.locator(".page-header, .app-header, .notifications-head, .back-head, .v-app-header").first();
  await expect(header).toBeVisible();
  const box = await header.boundingBox();
  expect(box, "header should have a measurable box").toBeTruthy();
  expect(box.height, "header height should be stable and visible").toBeGreaterThan(34);
  expect(box.y, "header must not be clipped above the viewport").toBeGreaterThanOrEqual(0);
}

async function expectVisibleBottomBar(page) {
  const bottomBar = page.locator("#bottomNav").first();
  await expect(bottomBar).toBeVisible();
  const box = await bottomBar.boundingBox();
  const viewport = page.viewportSize();
  expect(box, "bottom bar should have a measurable box").toBeTruthy();
  expect(box.height, "bottom bar should reserve the app safe area").toBeGreaterThanOrEqual(76);
  expect(box.y + box.height, "bottom bar should not be cut by the viewport").toBeLessThanOrEqual(viewport.height + 1);
}

async function expectSingleLineButtons(page) {
  const wrappedButtons = await page.locator("button").evaluateAll((buttons) => buttons
    .filter((button) => {
      const rect = button.getBoundingClientRect();
      const style = window.getComputedStyle(button);
      const text = (button.textContent || "").trim();
      return text && rect.width > 0 && rect.height > 0 && style.whiteSpace !== "nowrap";
    })
    .map((button) => ({
      text: (button.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
      className: button.className,
    })));

  expect(wrappedButtons).toEqual([]);
}

async function expectRootGeometry(page) {
  const geometry = await page.evaluate(() => {
    const root = document.querySelector("#appRoot");
    const screen = document.querySelector(".phone-screen");
    const style = root ? window.getComputedStyle(root) : null;
    const firstFullWidth = root
      ? root.querySelector(".app-header, .page-container > .page-header, .page-container > .ui-card, .page-container > .review-summary-card, .page-container > .wallet-summary-grid-v4, .page-container > .leaderboard-hero-card-v4, .page-container > .v-app")
      : null;
    const rootRect = root?.getBoundingClientRect();
    const firstRect = firstFullWidth?.getBoundingClientRect();
    return {
      rootWidth: rootRect?.width || 0,
      screenWidth: screen?.getBoundingClientRect().width || 0,
      paddingLeft: Number.parseFloat(style?.paddingLeft || "0"),
      paddingRight: Number.parseFloat(style?.paddingRight || "0"),
      firstDeltaLeft: firstRect && rootRect ? Math.round(firstRect.left - rootRect.left) : 0,
      firstDeltaRight: firstRect && rootRect ? Math.round(rootRect.right - firstRect.right) : 0,
    };
  });

  expect(Math.abs(geometry.paddingLeft - geometry.paddingRight)).toBeLessThanOrEqual(1);
  expect(geometry.paddingLeft).toBeLessThanOrEqual(16);
  expect(geometry.paddingRight).toBeLessThanOrEqual(16);
  expect(geometry.rootWidth).toBeLessThanOrEqual(geometry.screenWidth + 1);
  expect(Math.abs(geometry.firstDeltaLeft - geometry.firstDeltaRight)).toBeLessThanOrEqual(24);
}

for (const viewport of viewports) {
  for (const route of geometryRoutes) {
    test(`geometry ${viewport.name} ${route}`, async ({ page }) => {
      const errors = await collectConsoleErrors(page);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`/#${route}`);
      await waitForApp(page);

      await expectVisibleHeader(page);
      if (bottomBarHiddenRoutes.has(route)) {
        await expect(page.locator("#bottomNav")).toHaveCount(0);
        await expectNoAppHorizontalOverflow(page);
        await expectSingleLineButtons(page);
        await expectRootGeometry(page);
        expect(errors).toEqual([]);
        return;
      }
      await expectVisibleBottomBar(page);
      await expectNoAppHorizontalOverflow(page);
      await expectSingleLineButtons(page);
      await expectRootGeometry(page);

      const cta = page.locator("#bottomNav .bottom-item.featured").first();
      if (ctaHiddenRoutes.has(route)) {
        await expect(cta).toBeHidden();
        expect(errors).toEqual([]);
        return;
      }
      await expect(cta).toBeVisible();
      const className = await cta.getAttribute("class");
      if (route === "/home") {
        expect(className).toContain("cta-fab--home");
      } else {
        expect(className).toContain("cta-fab--subpage");
      }

      expect(errors).toEqual([]);
    });
  }
}
