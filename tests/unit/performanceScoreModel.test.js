import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateCriteriaMax,
  calculateCriteriaTotal,
  calculateProgressPercent,
  calculateRemainingToTarget,
  getCriterionStatus,
  performanceCriteria,
  performanceScoreConfig,
  priorityPerformanceActions,
} from "../../src/vue/data/performanceScoreTasks.js";

test("performance criteria total and target math are stable", () => {
  assert.equal(performanceCriteria.length, 8);
  assert.equal(calculateCriteriaMax(), 100);
  assert.equal(calculateCriteriaTotal(), 81);
  assert.equal(calculateRemainingToTarget(calculateCriteriaTotal()), 4);
  assert.equal(calculateProgressPercent(calculateCriteriaTotal()), 81);
});

test("performance status mapping avoids punitive wording", () => {
  assert.equal(getCriterionStatus(14, 15), "Güçlü");
  assert.equal(getCriterionStatus(11, 15), "İyi");
  assert.equal(getCriterionStatus(8, 15), "Geliştirilebilir");
  assert.equal(getCriterionStatus(2, 15), "Eksik");
  assert.ok(!["Zayıf", "Kötü", "Başarısız"].includes(getCriterionStatus(2, 15)));
});

test("subscription contribution is capped at five points", () => {
  const subscription = performanceCriteria.find((item) => item.id === "subscription");
  assert.equal(subscription.maxPoints, 5);
  assert.ok(subscription.currentPoints <= 5);
  assert.equal(performanceScoreConfig.maxScore, 100);
});

test("priority actions are actionable and ordered", () => {
  assert.equal(priorityPerformanceActions.length, 3);
  assert.deepEqual(
    priorityPerformanceActions.map((item) => item.impact),
    [3, 2, 1],
  );
  for (const action of priorityPerformanceActions) {
    assert.match(action.actionRoute, /^\//);
    assert.ok(action.actionLabel.length > 0);
  }
});

test("balance and cancellation criteria expose required product signals", () => {
  const balance = performanceCriteria.find((item) => item.id === "balance");
  const cancellation = performanceCriteria.find((item) => item.id === "cancellation_rate");
  const response = performanceCriteria.find((item) => item.id === "response_speed");

  assert.match(balance.description, /Bakiyenin bitmesi/);
  assert.ok(cancellation.measures.some((item) => item.includes("Müşteri kaynaklı")));
  assert.ok(cancellation.measures.some((item) => item.includes("Partner kaynaklı")));
  assert.match(response.targetValue, /5 dakika altı/);
});
