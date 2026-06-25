import assert from "node:assert/strict";
import test from "node:test";
import {
  getScoreBadgeBenefitCopy,
  getScoreBadgeTierByScore,
  scoreBadgeAdvantagesCopy,
  scoreBadgeBenefitTiers,
} from "../../src/vue/data/scoreBadgeAdvantages.js";

test("score badge advantages copy is exact Turkish approved content", () => {
  assert.equal(scoreBadgeAdvantagesCopy.title, "Skor rozet avantajları");
  assert.equal(scoreBadgeAdvantagesCopy.subtitle, "Skor yükseldikçe maliyetin düşer.");
  assert.equal(
    scoreBadgeAdvantagesCopy.note,
    "İndirim ve iş fırsatı etkisi bölge, sektör, talep yoğunluğu ve aktif çalışma davranışına göre değişebilir.",
  );
});

test("score badge tiers preserve tier order and score thresholds", () => {
  assert.deepEqual(
    scoreBadgeBenefitTiers.map((tier) => [tier.id, tier.tier, tier.score]),
    [
      ["legend", "EFSANE", "95+"],
      ["strong", "GÜÇLÜ", "90+"],
      ["high", "YÜKSEK", "85+"],
    ],
  );
});

test("score badge benefit messages are exact", () => {
  assert.equal(
    `${scoreBadgeBenefitTiers[0].headlineStrong} ${scoreBadgeBenefitTiers[0].headlineRest}`,
    "%50'ye kadar daha düşük fiyatla iş alabilirsin",
  );
  assert.equal(scoreBadgeBenefitTiers[0].secondary, "x3'e kadar daha fazla iş");
  assert.equal(
    `${scoreBadgeBenefitTiers[1].headlineStrong} ${scoreBadgeBenefitTiers[1].headlineRest}`,
    "%30'a kadar daha düşük fiyatla iş alabilirsin",
  );
  assert.equal(scoreBadgeBenefitTiers[1].secondary, "x2'ye kadar daha fazla iş");
  assert.equal(
    `${scoreBadgeBenefitTiers[2].headlineStrong} ${scoreBadgeBenefitTiers[2].headlineRest}`,
    "%20'ye kadar daha düşük fiyatla iş alabilirsin",
  );
  assert.equal(scoreBadgeBenefitTiers[2].secondary, "Daha çok iş fırsatında güçlü görünüm");
});

test("score badge helpers map scores and ids correctly", () => {
  assert.equal(getScoreBadgeTierByScore(96).id, "legend");
  assert.equal(getScoreBadgeTierByScore(90).id, "strong");
  assert.equal(getScoreBadgeTierByScore(85).id, "high");
  assert.equal(getScoreBadgeTierByScore(84), null);
  assert.equal(getScoreBadgeBenefitCopy("legend").score, "95+");
  assert.equal(getScoreBadgeBenefitCopy("missing"), null);
});
