import { expect, test } from "@playwright/test";
import { getRouteMeta } from "../../src/utils/routeMeta.js";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

const routes = [
  "/home",
  "/profile",
  "/notifications",
  "/support",
  "/support/new",
  "/support/live",
  "/reviews",
  "/leaderboard",
  "/subscription",
  "/referral",
  "/partner-card-preview",
  "/jobs",
  "/my-jobs",
  "/calendar",
  "/wallet",
];

const bottomOrder = [
  "bottom-tab-home",
  "bottom-tab-jobs",
  "bottom-cta-job",
  "bottom-tab-calendar",
  "bottom-tab-wallet",
];

const bottomLabels = ["Ana Sayfa", "İşler", "İş Al", "Randevu", "Cüzdan"];

const rightActionTestIds = {
  notifications: "notification-button",
  profile: "profile-button",
  info: "header-info-button",
  "profile-preview": "profile-preview-header-button",
  "wallet-info": "wallet-info-button",
  "notification-settings": "notification-settings-button",
};

const activeBottomByRoute = {
  "/home": "bottom-tab-home",
  "/my-jobs": "bottom-tab-jobs",
  "/jobs": "bottom-cta-job",
  "/calendar": "bottom-tab-calendar",
  "/wallet": "bottom-tab-wallet",
};

const blankRoutes = {
  "/jobs": { title: "İş Al", testId: "jobs-page" },
  "/my-jobs": { title: "İşler", testId: "my-jobs-page" },
  "/calendar": { title: "Randevu", testId: "calendar-page" },
  "/wallet": { title: "Cüzdan", testId: "wallet-page" },
};

function expectedUrl(route) {
  return `/?engine=vue#${route}`;
}

async function routeMetrics(page) {
  return page.evaluate((ids) => {
    const header = document.querySelector('[data-testid="app-header"]');
    const bottom = document.querySelector('[data-testid="app-bottom-bar"]');
    const title = header?.querySelector("h1");
    const subtitle = header?.querySelector("p");
    const titleStyle = title ? getComputedStyle(title) : null;
    const subtitleStyle = subtitle ? getComputedStyle(subtitle) : null;
    const titleLineHeight = titleStyle ? parseFloat(titleStyle.lineHeight) || parseFloat(titleStyle.fontSize) * 1.2 : 0;
    const subtitleLineHeight = subtitleStyle ? parseFloat(subtitleStyle.lineHeight) || parseFloat(subtitleStyle.fontSize) * 1.2 : 0;
    const headerBox = header?.getBoundingClientRect();
    const bottomBox = bottom?.getBoundingClientRect();
    const buttons = Array.from(header?.querySelectorAll("button") || []).map((button) => {
      const box = button.getBoundingClientRect();
      return {
        testId: button.getAttribute("data-testid"),
        action: button.getAttribute("data-action"),
        width: box.width,
        height: box.height,
        centerX: box.left + box.width / 2,
        centerY: box.top + box.height / 2,
      };
    });
    const bottomItems = ids.map((id) => {
      const node = document.querySelector(`[data-testid="${id}"]`);
      const box = node?.getBoundingClientRect();
      return {
        id,
        label: node?.querySelector(".v-bottom__label")?.textContent?.trim().replace(/\s+/g, " "),
        current: node?.getAttribute("aria-current"),
        width: box?.width || 0,
        height: box?.height || 0,
        center: box ? box.left + box.width / 2 : 0,
        yCenter: box ? box.top + box.height / 2 : 0,
      };
    });
    const centers = bottomItems.map((item) => item.center);
    const gaps = centers.slice(1).map((center, index) => center - centers[index]);
    return {
      runtime: document.documentElement.dataset.runtime || document.body.dataset.runtime,
      headerVariant: header?.dataset.headerVariant,
      title: title?.textContent?.trim() || "",
      subtitle: subtitle?.textContent?.trim() || "",
      titleClipped: title && titleLineHeight ? title.getBoundingClientRect().height > titleLineHeight * 1.65 : false,
      subtitleClipped: subtitle && subtitleLineHeight ? subtitle.getBoundingClientRect().height > subtitleLineHeight * 1.65 : false,
      header: {
        x: headerBox?.x || 0,
        y: headerBox?.y || 0,
        width: headerBox?.width || 0,
        height: headerBox?.height || 0,
      },
      buttons,
      bottom: {
        x: bottomBox?.x || 0,
        y: bottomBox?.y || 0,
        width: bottomBox?.width || 0,
        height: bottomBox?.height || 0,
      },
      bottomItems,
      bottomGrid: bottom ? getComputedStyle(bottom).gridTemplateColumns : "",
      ctaDelta: Math.abs(bottomItems[2].center - ((bottomBox?.left || 0) + (bottomBox?.width || 0) / 2)),
      gapDelta: gaps.length ? Math.max(...gaps) - Math.min(...gaps) : 999,
      sidePairDelta: Math.abs((bottomItems[1].center - bottomItems[0].center) - (bottomItems[4].center - bottomItems[3].center)),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  }, bottomOrder);
}

for (const route of routes) {
  test(`Vue route shell contract: ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    const errors = await collectConsoleErrors(page);
    const meta = getRouteMeta(route);

    await page.goto(expectedUrl(route));
    await waitForApp(page);

    const metrics = await routeMetrics(page);
    expect(metrics.runtime).toBe("vue");
    expect(metrics.headerVariant).toBe(meta.headerVariant);
    expect(metrics.header.width).toBeGreaterThanOrEqual(360);
    expect(metrics.header.height).toBeGreaterThanOrEqual(44);
    expect(metrics.titleClipped).toBe(false);
    expect(metrics.subtitleClipped).toBe(false);
    expect(metrics.overflow).toBeLessThanOrEqual(1);

    if (route !== "/home") {
      expect(metrics.title).toBe(meta.title);
      expect(metrics.subtitle).toBe(meta.subtitle || "");
    }

    const headerButtonIds = metrics.buttons.map((button) => button.testId);
    if (meta.leadingAction === "back") {
      expect(headerButtonIds).toContain("back-button");
      expect(headerButtonIds).not.toContain("hamburger-button");
    } else {
      expect(headerButtonIds).toContain("hamburger-button");
      expect(headerButtonIds).not.toContain("back-button");
    }

    for (const action of meta.trailingActions) {
      expect(headerButtonIds).toContain(rightActionTestIds[action]);
    }

    for (const button of metrics.buttons) {
      const expectedTextAction = button.action === "profile-preview";
      expect(button.width).toBeGreaterThanOrEqual(expectedTextAction ? 70 : 43);
      expect(button.width).toBeLessThanOrEqual(expectedTextAction ? 96 : 45);
      expect(button.height).toBeGreaterThanOrEqual(43);
      expect(button.height).toBeLessThanOrEqual(45);
    }

    expect(metrics.bottom.width).toBeGreaterThanOrEqual(392);
    expect(metrics.bottom.height).toBeGreaterThanOrEqual(90);
    expect(metrics.bottomItems.map((item) => item.id)).toEqual(bottomOrder);
    expect(metrics.bottomItems.map((item) => item.label)).toEqual(bottomLabels);
    expect(metrics.ctaDelta).toBeLessThanOrEqual(1);
    expect(metrics.gapDelta).toBeLessThanOrEqual(1.5);
    expect(metrics.sidePairDelta).toBeLessThanOrEqual(1.5);

    const activeId = activeBottomByRoute[route];
    for (const item of metrics.bottomItems) {
      expect(item.current).toBe(item.id === activeId ? "page" : null);
    }

    expect(errors).toEqual([]);
  });
}

test("Vue blank bottom routes keep the product blank contract", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });

  for (const [route, expected] of Object.entries(blankRoutes)) {
    await page.goto(expectedUrl(route));
    await waitForApp(page);
    await expect(page.getByTestId(expected.testId)).toBeVisible();
    await expect(page.locator('[data-blank-route="true"]')).toHaveAttribute("aria-label", expected.title);
    await expect(page.locator(".v-card, .app-card, .filter-chip, .empty-state, .primary-action")).toHaveCount(0);
  }
});

test("Vue route header actions produce outcomes", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });

  await page.goto(expectedUrl("/notifications"));
  await waitForApp(page);
  await page.getByTestId("app-header").getByTestId("notification-settings-button").click();
  await expect(page).toHaveURL(/#\/notification-settings$/);

  await page.goto(expectedUrl("/wallet"));
  await waitForApp(page);
  await page.getByTestId("app-header").getByTestId("wallet-info-button").click();
  await expect(page.locator('[role="dialog"]')).toBeVisible();

  await page.goto(expectedUrl("/subscription"));
  await waitForApp(page);
  await page.getByTestId("app-header").getByTestId("header-info-button").click();
  await expect(page.locator('[role="dialog"]')).toBeVisible();
});

test("Vue customer service exposes call action after paid subscription", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });

  await page.goto(expectedUrl("/subscription"));
  await waitForApp(page);
  await page.getByTestId("subscription-plan-plus").click();
  await expect(page.getByTestId("subscription-active-plan")).toContainText("Plus");

  await page.goto(expectedUrl("/support/customer-service"));
  await waitForApp(page);
  await expect(page.getByTestId("customer-service-call")).toBeVisible();
  await expect(page.getByTestId("customer-service-call")).toHaveAttribute("href", "tel:4442368");
  await expect(page.getByTestId("customer-service-upgrade")).toHaveCount(0);
});
