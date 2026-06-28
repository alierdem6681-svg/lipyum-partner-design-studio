import assert from "node:assert/strict";
import test from "node:test";
import {
  managementActionCenter,
  managementApprovals,
  managementDailyTasks,
  managementQuickActions,
  managementReports,
  managementSecurityGates,
  managementSummary,
  managementSystemStatus,
} from "../../src/vue/data/managementPanelModel.js";

test("management panel model covers the critical mobile dashboard sections", () => {
  assert.equal(managementSummary.title, "Bugünkü Kontrol");
  assert.ok(managementSummary.netProfit.startsWith("₺"), "summary must show net profit");
  assert.equal(managementQuickActions.length, 5);
  assert.ok(managementActionCenter.length >= 3, "action center must include prioritized actions");
  assert.ok(managementApprovals.length >= 2, "approval queue must include actionable items");
  assert.equal(managementDailyTasks.length, 5);
  assert.ok(managementReports.some((report) => report.id === "profit"), "profit report is required");
  assert.ok(managementSystemStatus.length >= 6, "system health must be visible");
  assert.ok(managementSecurityGates.some((gate) => gate.title === "Keyword Pause" && gate.value === "Kapalı"));
});
