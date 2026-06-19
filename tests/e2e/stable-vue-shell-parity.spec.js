import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

const bottomOrder = [
  "bottom-tab-home",
  "bottom-tab-jobs",
  "bottom-cta-job",
  "bottom-tab-calendar",
  "bottom-tab-wallet",
];

const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 780 },
  { width: 393, height: 852 },
  { width: 430, height: 932 },
];

async function getBottomMetrics(page) {
  return page.evaluate((ids) => {
    const nav = document.querySelector('[data-testid="app-bottom-bar"]');
    const navBox = nav.getBoundingClientRect();
    const boxes = ids.map((id) => {
      const node = document.querySelector(`[data-testid="${id}"]`);
      const box = node.getBoundingClientRect();
      return {
        id,
        left: box.left,
        right: box.right,
        width: box.width,
        center: box.left + box.width / 2,
        yCenter: box.top + box.height / 2,
      };
    });
    const centers = boxes.map((box) => box.center);
    const gaps = centers.slice(1).map((center, index) => center - centers[index]);
    return {
      runtime: document.body.dataset.runtime,
      navCenter: navBox.left + navBox.width / 2,
      gridTemplateColumns: getComputedStyle(nav).gridTemplateColumns,
      boxes,
      ctaDelta: Math.abs(boxes[2].center - (navBox.left + navBox.width / 2)),
      gapDelta: Math.max(...gaps) - Math.min(...gaps),
      sidePairDelta: Math.abs((boxes[1].center - boxes[0].center) - (boxes[4].center - boxes[3].center)),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  }, bottomOrder);
}

for (const viewport of viewports) {
  test(`Vue preview bottom bar is centered and symmetric at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors = await collectConsoleErrors(page);

    await page.goto("/?engine=vue#/home");
    await waitForApp(page);

    const metrics = await getBottomMetrics(page);
    expect(metrics.runtime).toBe("vue");
    expect(metrics.ctaDelta).toBeLessThanOrEqual(1);
    expect(metrics.gapDelta).toBeLessThanOrEqual(1.5);
    expect(metrics.sidePairDelta).toBeLessThanOrEqual(1.5);
    expect(metrics.overflow).toBeLessThanOrEqual(1);
    expect(metrics.gridTemplateColumns.split(" ")).toHaveLength(5);
    expect(errors).toEqual([]);
  });
}

test("Vue preview profile uses stable profile card order", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  await page.goto("/?engine=vue#/profile");
  await waitForApp(page);

  await expect(page.locator("html")).toHaveAttribute("data-runtime", "vue");
  await expect(page.locator(".v-route-hero")).toHaveCount(0);
  await expect(page.locator(".partner-profile-card")).toBeVisible();
  await expect(page.locator(".profile-strength-card")).toBeVisible();
  await expect(page.locator(".profile-menu-grid")).toBeVisible();
  await expect(page.locator(".profile-menu-card")).toHaveCount(8);
  const menuLabels = await page.locator(".profile-menu-label").evaluateAll((nodes) =>
    nodes.map((node) => node.textContent.trim()).filter(Boolean),
  );
  expect(menuLabels).toHaveLength(8);
  expect(menuLabels.every((label) => label.length >= 5)).toBe(true);
  await expect(page.getByTestId("profile-badge-more")).toBeVisible();
  await page.getByTestId("profile-badge-more").click();
  await expect(page.getByTestId("profile-badge-more")).toHaveCount(0);
  const badgeLabels = await page.locator(".partner-profile-chip:not(.is-more)").evaluateAll((nodes) =>
    nodes.map((node) => node.textContent.trim()).filter(Boolean),
  );
  expect(new Set(badgeLabels).size).toBe(5);
  expect(badgeLabels).toHaveLength(5);
  const order = await page.evaluate(() => {
    const profile = document.querySelector(".partner-profile-card").getBoundingClientRect();
    const strength = document.querySelector(".profile-strength-card").getBoundingClientRect();
    const menu = document.querySelector(".profile-menu-section").getBoundingClientRect();
    return {
      profileTop: profile.top,
      strengthTop: strength.top,
      menuTop: menu.top,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  expect(order.profileTop).toBeLessThan(order.strengthTop);
  expect(order.strengthTop).toBeLessThan(order.menuTop);
  expect(order.overflow).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

test("Vue preview drawer uses stable Lipyum sidebar contract", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  await page.goto("/?engine=vue#/home");
  await waitForApp(page);
  await page.getByTestId("hamburger-button").click();

  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();
  await expect(page.locator(".partner-menu")).toBeVisible();
  await expect(page.locator(".drawer-profile-card")).toBeVisible();
  await expect(page.locator(".drawer-work-status-card")).toBeVisible();
  await expect(page.locator(".drawer-menu-card")).toHaveCount(4);
  await expect(page.getByTestId("sidebar-menu-item")).toHaveCount(11);
  await page.getByTestId("drawer-profile-badge-more").click();
  await expect(page.getByTestId("drawer-profile-badge-more")).toHaveCount(0);
  const drawerBadgeLabels = await page.locator(".drawer-profile-card .drawer-mini-badge:not(.is-more)").evaluateAll((nodes) =>
    nodes.map((node) => node.textContent.trim()).filter(Boolean),
  );
  expect(new Set(drawerBadgeLabels).size).toBe(5);
  expect(drawerBadgeLabels).toHaveLength(5);
  await expect(page.locator(".v-drawer-menu__item")).toHaveCount(0);
  expect(errors).toEqual([]);
});
