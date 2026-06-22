import assert from "node:assert/strict";
import test from "node:test";
import {
  PERFORMANCE_STORAGE_KEY,
  calculateTotalScore,
  clampScore,
  completePerformanceTask,
  createInitialCategoryScores,
  createInitialPerformanceState,
  formatScoreTr,
  getRemainingToTarget,
  restorePerformanceState,
  roundScoreToOneDecimal,
  serializePerformanceState,
} from "../../src/domain/performanceScoreModel.js";

test("roundScoreToOneDecimal and formatScoreTr keep Turkish one decimal score", () => {
  assert.equal(roundScoreToOneDecimal(81.74), 81.7);
  assert.equal(roundScoreToOneDecimal(81.75), 81.8);
  assert.equal(formatScoreTr(81.7), "81,7");
  assert.equal(formatScoreTr(81.9), "81,9");
});

test("category total starts at 81.7 and clamps to 0-100", () => {
  const scores = createInitialCategoryScores();
  assert.equal(calculateTotalScore(scores), 81.7);
  assert.equal(clampScore(-1), 0);
  assert.equal(clampScore(101), 100);
});

test("completeTask updates category, total score, remaining target and history", () => {
  const initial = createInitialPerformanceState();
  const result = completePerformanceTask(initial, "job-result", "2026-06-22T09:00:00.000Z");

  assert.equal(result.changed, true);
  assert.equal(result.state.categoryScores.jobTransparency, 20.3);
  assert.equal(result.state.score, 81.9);
  assert.equal(getRemainingToTarget(result.state.score), 3.1);
  assert.deepEqual(result.state.completedTaskIds.includes("job-result"), true);
  assert.equal(result.state.scoreHistory.length, 1);
  assert.equal(result.state.scoreHistory[0].delta, 0.2);
});

test("completeTask is idempotent for one-time tasks", () => {
  const first = completePerformanceTask(createInitialPerformanceState(), "job-result");
  const second = completePerformanceTask(first.state, "job-result");

  assert.equal(second.changed, false);
  assert.equal(second.state.score, 81.9);
  assert.equal(second.state.scoreHistory.length, 1);
  assert.equal(second.message, "Bu görev daha önce tamamlandı.");
});

test("state serializes and restores from localStorage payload", () => {
  const completed = completePerformanceTask(createInitialPerformanceState(), "job-result").state;
  const restored = restorePerformanceState(serializePerformanceState(completed));

  assert.equal(PERFORMANCE_STORAGE_KEY, "lipyum.performanceScoreDemo.v1");
  assert.equal(restored.score, 81.9);
  assert.equal(restored.categoryScores.jobTransparency, 20.3);
  assert.deepEqual(restored.completedTaskIds.includes("job-result"), true);
});

test("resetPerformanceDemo can recreate the initial score state", () => {
  const reset = createInitialPerformanceState();
  assert.equal(reset.score, 81.7);
  assert.equal(reset.animatedScore, 81.7);
  assert.equal(reset.scoreHistory.length, 0);
});
