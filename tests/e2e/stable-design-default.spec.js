import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

const bottomOrder = [
  "bottom-tab-home",
  "bottom-tab-jobs",
  "bottom-cta-job",
  "bottom-tab-calendar",
  "bottom-tab-wallet",
];

test("normal URLs use the stable profile, sidebar and bottom bar design", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  await page.goto("/#/profile");
  await waitForApp(page);

  await expect(page.locator("html")).toHaveAttribute("data-runtime", "legacy");
  await expect(page.locator(".partner-profile-card")).toBeVisible();
  await expect(page.locator(".profile-strength-card")).toBeVisible();
  await expect(page.locator(".profile-menu-grid")).toBeVisible();
  await expect(page.locator(".v-route-hero")).toHaveCount(0);

  const boxes = [];
  for (const testId of bottomOrder) {
    const box = await page.getByTestId(testId).boundingBox();
    expect(box, `${testId} must be visible`).not.toBeNull();
    boxes.push(box);
  }

  for (let index = 1; index < boxes.length; index += 1) {
    expect(boxes[index].x).toBeGreaterThan(boxes[index - 1].x);
  }

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

test("Vue migration UI is available only through explicit preview flag", async ({ page }) => {
  await page.goto("/?engine=vue#/profile");
  await waitForApp(page);

  await expect(page.locator("html")).toHaveAttribute("data-runtime", "vue");
  await expect(page.locator(".v-route-hero")).toBeVisible();
});
