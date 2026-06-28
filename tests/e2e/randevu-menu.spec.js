import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 780 },
  { width: 393, height: 852 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
];

test("Randevu menu shows services, calendar and teams flows", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/?engine=vue#/calendar");
  await waitForApp(page);

  await expect(page.getByTestId("app-header").getByRole("heading", { name: "Randevu", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Hizmetlerini randevuya aç", exact: true })).toBeVisible();
  await expect(page.getByTestId("appointment-status-pill")).toContainText("Açık");
  await expect(page.getByTestId("appointment-hero")).toContainText("6 boş saat");
  await expect(page.getByTestId("appointment-hero")).toContainText("3");
  await expect(page.getByTestId("appointment-hero")).toContainText("onay bekliyor");
  await expect(page.getByTestId("appointment-hero")).toContainText("₺18.500");
  await expect(page.getByTestId("appointment-hero")).toContainText("12");
  await expect(page.getByTestId("appointment-hero")).toContainText("aktif slot");

  await expect(page.getByTestId("appointment-services-panel")).toBeVisible();
  await expect(page.getByText("Tırnak yapımı")).toBeVisible();

  await page.getByTestId("appointment-tab-calendar").click();
  await expect(page.getByTestId("appointment-calendar-panel")).toBeVisible();
  await expect(page.getByText("Haftalık uygunluk")).toBeVisible();

  await page.getByTestId("appointment-tab-teams").click();
  await expect(page.getByTestId("appointment-teams-panel")).toBeVisible();
  await expect(page.getByText("Ayşe Durmaz")).toBeVisible();

  await page.getByTestId("appointment-tab-services").click();
  await expect(page.getByTestId("appointment-services-panel")).toBeVisible();
  await page.getByTestId("appointment-sticky-action").click();
  await expect(page.getByTestId("appointment-service-sheet")).toBeVisible();
  await page.getByTestId("appointment-service-name").fill("Klima bakım randevusu");
  await page.getByTestId("appointment-service-duration").fill("60");
  await page.getByTestId("appointment-service-price").fill("1250");
  await page.getByTestId("appointment-save-service").click();
  await expect(page.getByTestId("appointment-service-list").getByText("Klima bakım randevusu")).toBeVisible();

  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

for (const viewport of viewports) {
  test(`Randevu menu has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.setViewportSize(viewport);
    await page.goto("/?engine=vue#/calendar");
    await waitForApp(page);
    await expect(page.getByTestId("calendar-page")).toBeVisible();
    await expect(page.getByTestId("appointment-hero")).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}
