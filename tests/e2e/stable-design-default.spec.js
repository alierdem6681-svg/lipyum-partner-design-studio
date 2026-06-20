import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

const bottomOrder = [
  "bottom-tab-home",
  "bottom-tab-jobs",
  "bottom-cta-job",
  "bottom-tab-calendar",
  "bottom-tab-wallet",
];

const bottomViewports = [
  { width: 320, height: 568 },
  { width: 360, height: 780 },
  { width: 393, height: 852 },
  { width: 430, height: 932 },
];

async function bottomBarMetrics(page) {
  const boxes = [];
  for (const testId of bottomOrder) {
    const box = await page.getByTestId(testId).boundingBox();
    expect(box, `${testId} must be visible`).not.toBeNull();
    boxes.push({ testId, ...box, cx: box.x + box.width / 2, cy: box.y + box.height / 2 });
  }

  const viewportCenter = page.viewportSize().width / 2;
  return {
    boxes,
    ctaCenterDelta: Math.abs(boxes[2].cx - viewportCenter),
    outerSymmetryDelta: Math.abs((viewportCenter - boxes[0].cx) - (boxes[4].cx - viewportCenter)),
    innerSymmetryDelta: Math.abs((viewportCenter - boxes[1].cx) - (boxes[3].cx - viewportCenter)),
    nonCtaBaselineDelta: Math.max(boxes[0].cy, boxes[1].cy, boxes[3].cy, boxes[4].cy) - Math.min(boxes[0].cy, boxes[1].cy, boxes[3].cy, boxes[4].cy),
  };
}

test("normal URLs use the stable profile, sidebar and bottom bar design", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  await page.goto("/#/profile");
  await waitForApp(page);

  await expect(page.locator("html")).toHaveAttribute("data-runtime", "legacy");
  await expect(page.locator(".partner-profile-card")).toBeVisible();
  await expect(page.locator(".profile-strength-card")).toBeVisible();
  await expect(page.getByTestId("profile-menu-list")).toBeVisible();
  await expect(page.getByTestId("profile-menu-strength-summary")).toBeVisible();
  await expect(page.locator(".v-route-hero")).toHaveCount(0);

  const { boxes, ctaCenterDelta, outerSymmetryDelta, innerSymmetryDelta, nonCtaBaselineDelta } = await bottomBarMetrics(page);

  for (let index = 1; index < boxes.length; index += 1) {
    expect(boxes[index].x).toBeGreaterThan(boxes[index - 1].x);
  }
  expect(ctaCenterDelta).toBeLessThanOrEqual(1);
  expect(outerSymmetryDelta).toBeLessThanOrEqual(1);
  expect(innerSymmetryDelta).toBeLessThanOrEqual(1);
  expect(nonCtaBaselineDelta).toBeLessThanOrEqual(1);

  await page.goto("/#/home");
  await waitForApp(page);
  await page.getByTestId("hamburger-button").click();
  await expect(page.getByTestId("sidebar-drawer")).toBeVisible();
  await expect(page.locator(".partner-menu")).toBeVisible();
  await expect(page.locator(".drawer-profile-card")).toBeVisible();
  await expect(page.locator(".drawer-menu-card").first()).toBeVisible();
  await expect(page.locator(".v-drawer-menu__item")).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("Vue preview keeps stable profile design through explicit preview flag", async ({ page }) => {
  await page.goto("/?engine=vue#/profile");
  await waitForApp(page);

  await expect(page.locator("html")).toHaveAttribute("data-runtime", "vue");
  await expect(page.locator(".v-route-hero")).toHaveCount(0);
  await expect(page.locator(".partner-profile-card")).toBeVisible();
  await expect(page.locator(".profile-strength-card")).toBeVisible();
  await expect(page.getByTestId("profile-menu-list")).toBeVisible();
  await expect(page.getByTestId("profile-menu-card")).toHaveCount(8);
  await expect(page.getByTestId("profile-menu-strength-summary")).toContainText("Profil Gücünüz");
});

for (const viewport of bottomViewports) {
  test(`bottom bar remains centered and symmetric at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors = await collectConsoleErrors(page);

    await page.goto("/#/home");
    await waitForApp(page);

    const { boxes, ctaCenterDelta, outerSymmetryDelta, innerSymmetryDelta, nonCtaBaselineDelta } = await bottomBarMetrics(page);
    for (let index = 1; index < boxes.length; index += 1) {
      expect(boxes[index].x).toBeGreaterThan(boxes[index - 1].x);
    }

    await expect(page.locator("html")).toHaveAttribute("data-runtime", "legacy");
    await expect(page.locator('[data-testid="app-bottom-bar"] [aria-current="page"]')).toHaveCount(1);
    expect(ctaCenterDelta).toBeLessThanOrEqual(1);
    expect(outerSymmetryDelta).toBeLessThanOrEqual(1);
    expect(innerSymmetryDelta).toBeLessThanOrEqual(1);
    expect(nonCtaBaselineDelta).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}
