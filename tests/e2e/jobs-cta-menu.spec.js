import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 780 },
  { width: 393, height: 852 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
];

async function openFreshJobs(page) {
  await page.addInitScript(() => {
    window.localStorage.removeItem("lipyum.partner.jobSwipe.v1");
  });
  await page.goto("/#/jobs");
  await waitForApp(page);
}

test("İş Al menu renders the swipe deck and working CTA", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await openFreshJobs(page);

  await expect(page.getByTestId("jobs-page")).toBeVisible();
  await expect(page.getByTestId("bottom-cta-job")).toHaveCount(0);
  await expect(page.getByTestId("job-swipe-page")).toBeVisible();
  await expect(page.getByText("Sola kaydır, sıradaki işi gör")).toBeVisible();

  await expect(page.locator(".job-cta-tabs")).toHaveCount(0);
  await expect(page.locator("[data-testid^='job-card-']")).toHaveCount(0);
  await expect(page.getByText("Bu İşi İncele")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Ara", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Mesaj", exact: true })).toHaveCount(0);

  await expect(page.getByTestId("job-swipe-card")).toContainText("Klima bakımı");
  await expect(page.getByTestId("job-swipe-card")).toContainText("Mezitli / Mersin");
  await expect(page.getByTestId("job-swipe-card")).toContainText("850 TL");
  await expect(page.getByTestId("job-swipe-customer-row")).toContainText("4,8 puan · 13 değerlendirme");
  await expect(page.getByTestId("job-swipe-primary-cta")).toContainText("Ara, Randevu Ver");

  await page.getByTestId("job-swipe-primary-cta").click();
  await expect(page.getByTestId("app-sheet")).toBeVisible();
  await expect(page.getByTestId("app-sheet")).toContainText("Ara, Randevu Ver");
  await page.getByTestId("sheet-close-button").click();

  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test("İş Al swipe, keyboard and button fallback advance the card", async ({ page }) => {
  await openFreshJobs(page);

  const activeDeck = page.locator(".job-swipe-deck__active");
  const box = await activeDeck.boundingBox();
  expect(box).toBeTruthy();
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.45);
  await page.mouse.down();
  await page.mouse.move(box.x + 20, box.y + box.height * 0.45, { steps: 8 });
  await page.mouse.up();
  await expect(page.getByTestId("job-swipe-card")).toContainText("Petek temizliği");

  await activeDeck.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByTestId("job-swipe-card")).toContainText("Ev temizliği");

  await page.getByRole("button", { name: /Sıradaki iş/ }).click();
  await expect(page.getByTestId("job-swipe-card")).toContainText("Çamaşır makinesi");
});

for (const viewport of viewports) {
  test(`İş Al swipe deck has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.setViewportSize(viewport);
    await openFreshJobs(page);
    await expect(page.getByTestId("jobs-page")).toBeVisible();
    await expect(page.getByTestId("job-swipe-page")).toBeVisible();
    await expect(page.getByTestId("job-swipe-card")).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}
