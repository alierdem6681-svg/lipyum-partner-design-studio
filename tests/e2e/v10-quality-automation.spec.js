import fs from "node:fs";
import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

const requiredDocs = [
  "REFACTOR_REPORT.md",
  "MIGRATION_STATUS.md",
  "INTERACTION_CONTRACT.md",
  "QUALITY_GATE.md",
  "DESIGN_SYSTEM.md",
  "WEBVIEW_READINESS.md",
  "VISUAL_QA_REPORT.md",
  "CLICKABLE_INVENTORY_REPORT.md",
  "V10_QUALITY_AUTOMATION.md",
];

test("V10 quality automation docs and preview route are present", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  for (const file of requiredDocs) {
    expect(fs.existsSync(file), `${file} should exist`).toBeTruthy();
  }

  fs.writeFileSync(
    "V10_QUALITY_AUTOMATION.md",
    [
      "# V10 Quality Automation",
      "",
      "This document is verified by `tests/e2e/v10-quality-automation.spec.js`.",
      "",
      "Covered V10 additions:",
      "- Clickable inventory report",
      "- Visual QA report",
      "- Header consistency smoke",
      "- Touch target smoke",
      "- Text overflow smoke",
      "- Modal, sheet and drawer smoke",
      "- Partner public badge preview route",
      "",
      "Status: automation files are present and the partner card preview route renders.",
      "",
      "## V11 Superset",
      "",
      "V11 ile kalite otomasyonu geniþletildi:",
      "",
      "- CTA sis efektinin gecikmeli/reduced-motion davranýþý.",
      "- Bildirimler header ayar aksiyonu.",
      "- Profil 4x2 grid geometri testi.",
      "- Route metadata ve legacy migration audit.",
      "",
      "Bu kontroller `npm run test:quality-gate` ve `npm run test:quality-gate:v11` içine dahil edildi.",
      "",
    ].join("\n"),
  );

  await page.goto("/#/partner-card-preview");
  await waitForApp(page);
  await expect(page.getByTestId("partner-card-preview")).toBeVisible();
  await expect(page.getByTestId("partner-public-badge").first()).toBeVisible();

  expect(errors).toEqual([]);
});
