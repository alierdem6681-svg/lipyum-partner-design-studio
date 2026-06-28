import test from "node:test";
import assert from "node:assert/strict";
import { calculateApplicableBonus, calculateTopUpSummary, clampMoney, estimateJobCount, formatEstimatedJobRange } from "../../src/vue/data/walletCalculations.js";
import { walletRules } from "../../src/vue/data/walletRules.js";

test("wallet top-up applies max bonus clamp", () => {
  const summary = calculateTopUpSummary({
    workBalance: 675,
    bonusBalance: 240,
    topUpAmount: 500,
    rules: walletRules,
    useBonus: true,
  });
  assert.equal(summary.appliedBonus, 120);
  assert.equal(summary.payableAmount, 380);
  assert.equal(summary.resultingWorkBalance, 1175);
  assert.equal(summary.resultingBonusBalance, 120);
});

test("wallet bonus never creates negative values", () => {
  const summary = calculateTopUpSummary({
    workBalance: -20,
    bonusBalance: 50,
    topUpAmount: 100,
    rules: walletRules,
    useBonus: true,
  });
  assert.equal(summary.appliedBonus, 24);
  assert.equal(summary.payableAmount, 76);
  assert.equal(summary.resultingWorkBalance, 100);
  assert.equal(summary.resultingBonusBalance, 26);
});

test("bonus can be disabled", () => {
  const applied = calculateApplicableBonus({
    bonusBalance: 240,
    topUpAmount: 500,
    rules: walletRules,
    useBonus: false,
  });
  assert.equal(applied, 0);
});

test("estimated job count uses central average cost", () => {
  assert.equal(estimateJobCount(675, 250), 2);
  assert.equal(formatEstimatedJobRange(675, 250), "≈ 2-3 fırsata erişebilirsin");
});

test("clampMoney rejects invalid and negative values", () => {
  assert.equal(clampMoney("abc"), 0);
  assert.equal(clampMoney(-12), 0);
  assert.equal(clampMoney(12.345), 12.35);
});

