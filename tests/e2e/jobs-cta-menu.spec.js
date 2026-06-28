import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 780 },
  { width: 393, height: 852 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
];

test("İş Al menu shows appointment-first jobs and working CTAs", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/jobs");
  await waitForApp(page);

  await expect(page.getByTestId("jobs-page")).toBeVisible();
  await expect(page.getByTestId("bottom-cta-job")).toHaveAttribute("aria-current", "page");
  await expect(page.getByText("Size uygun yeni işler")).toBeVisible();
  await expect(page.getByTestId("job-filter-all")).toHaveAttribute("aria-pressed", "true");

  const firstCards = await page.locator("[data-testid^='job-card-']").evaluateAll((cards) =>
    cards.slice(0, 2).map((card) => card.textContent),
  );
  expect(firstCards.join(" ")).toContain("İş sizin");
  expect(firstCards.join(" ")).toContain("Sizi Bekliyor");

  const visibleCardText = await page.locator("[data-testid^='job-card-']").evaluateAll((cards) =>
    cards.map((card) => card.textContent).join(" "),
  );
  expect(visibleCardText).not.toContain("RANDEVU");
  expect(visibleCardText).not.toContain("HAVUZ");
  await expect(page.getByText("Randevu işleri üstte gösterilir")).toHaveCount(0);

  await page.getByTestId("job-filter-quote").click();
  await expect(page.getByTestId("job-filter-quote")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("job-card-job-0003")).toContainText("Teklif Ver");

  await page.getByTestId("job-filter-waiting-purchase").click();
  await expect(page.getByTestId("job-card-job-0004")).toContainText("İşi Satın Al");

  await page.getByTestId("job-filter-all").click();
  const loadMore = page.getByTestId("job-load-more");
  if (await loadMore.isVisible().catch(() => false)) {
    await loadMore.click();
  }
  await expect(page.getByTestId("job-card-job-0006")).toBeVisible();

  await page.getByRole("button", { name: /Teklif Ver/ }).first().click();
  await expect(page.getByTestId("app-sheet")).toBeVisible();
  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

for (const viewport of viewports) {
  test(`İş Al menu has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.setViewportSize(viewport);
    await page.goto("/#/jobs");
    await waitForApp(page);
    await expect(page.getByTestId("jobs-page")).toBeVisible();
    await expect(page.getByTestId("job-opportunity-list")).toBeVisible();
    await expectNoAppHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}
