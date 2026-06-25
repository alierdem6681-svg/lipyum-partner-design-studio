import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateCriteriaMax,
  calculateCriteriaTotal,
  calculateRemainingToTarget,
  getNextTarget,
  getStatusTone,
  performanceActionQueue,
  performanceCriteria,
  performanceTargets,
  priorityPerformanceActions,
} from "../../src/vue/data/performanceImproveModel.js";

test("performance criteria total 100 points and current score 81", () => {
  assert.equal(performanceCriteria.length, 8);
  assert.equal(calculateCriteriaMax(), 100);
  assert.equal(calculateCriteriaTotal(), 81);
});

test("subscription criterion is capped at 5 points", () => {
  const subscription = performanceCriteria.find((criterion) => criterion.id === "subscription");
  assert.ok(subscription);
  assert.equal(subscription.maxPoints, 5);
  assert.equal(subscription.currentPoints, 5);
});

test("target calculations support 85, 90 and 95 score bands", () => {
  assert.deepEqual(
    performanceTargets.map((target) => target.score),
    [85, 90, 95],
  );
  assert.equal(calculateRemainingToTarget(81, 85), 4);
  assert.equal(calculateRemainingToTarget(91, 90), 0);
  assert.equal(getNextTarget(81).score, 85);
  assert.equal(getNextTarget(90).score, 95);
});

test("status tone mapping uses constructive states only", () => {
  assert.equal(getStatusTone("Güçlü"), "success");
  assert.equal(getStatusTone("İyi"), "info");
  assert.equal(getStatusTone("Geliştirilebilir"), "warning");
  assert.equal(getStatusTone("Eksik"), "danger");
  assert.equal(getStatusTone("Kötü"), "neutral");
});

test("priority actions are actionable routes", () => {
  assert.equal(priorityPerformanceActions.length, 3);
  for (const action of priorityPerformanceActions) {
    assert.match(action.route, /^\//);
    assert.ok(action.actionLabel);
    assert.ok(action.impact > 0);
  }
});

test("performance action queue is ordered for compact lazy loading", () => {
  assert.ok(performanceActionQueue.length > 5);
  assert.deepEqual(
    performanceActionQueue.slice(0, 5).map((action) => action.id),
    ["job_result", "reviews", "response_speed", "cancellation_rate", "subscription"],
  );
  for (const action of performanceActionQueue) {
    assert.match(action.route, /^\//);
    assert.ok(action.actionLabel);
    assert.ok(action.impact > 0);
    assert.ok(Array.isArray(action.steps));
    assert.ok(action.steps.length >= 3);
  }
});

test("performance action queue includes completed check rows", () => {
  const completedActions = performanceActionQueue.filter((action) => action.completed);
  assert.ok(completedActions.length >= 1);
  assert.ok(completedActions.some((action) => action.id === "profile_completion"));
});
