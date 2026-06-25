<script setup>
import { onBeforeUnmount, watch } from "vue";
import AppSheet from "../ui/AppSheet.vue";
import {
  scoreBadgeAdvantagesCopy,
  scoreBadgeBenefitTiers,
} from "../../data/scoreBadgeAdvantages.js";

const props = defineProps({
  open: { type: Boolean, default: false },
});

const emit = defineEmits(["close"]);

const scoreBadgeAssetBase = `${import.meta.env.BASE_URL}assets/lipyum-score-badge-advantages/`;

const scoreBadgeAssetByTone = {
  legend: "efsane.svg",
  strong: "guclu.svg",
  high: "yuksek.svg",
};

const supportingAssetByIcon = {
  "trend-up": "mint_trend_up_circle.svg",
  user: "mint_user_circle.svg",
};

function getAssetUrl(assetName) {
  return `${scoreBadgeAssetBase}${assetName}`;
}

function getTierBadgeAsset(tier) {
  return getAssetUrl(scoreBadgeAssetByTone[tier.tone] || "yuksek.svg");
}

function getSupportingAsset(tier) {
  return getAssetUrl(supportingAssetByIcon[tier.secondaryIcon] || "mint_trend_up_circle.svg");
}

function closeSheet() {
  emit("close");
}

function onKeydown(event) {
  if (event.key === "Escape" && props.open) closeSheet();
}

watch(
  () => props.open,
  (open) => {
    if (typeof document === "undefined") return;
    if (open) document.addEventListener("keydown", onKeydown);
    else document.removeEventListener("keydown", onKeydown);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (typeof document === "undefined") return;
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <AppSheet
    :open="open"
    :title="scoreBadgeAdvantagesCopy.title"
    :description="scoreBadgeAdvantagesCopy.subtitle"
    @close="closeSheet"
  >
    <section class="score-badge-advantages-sheet" data-testid="score-badge-advantages-sheet">
      <div class="score-badge-advantages-list" aria-label="Skor rozeti avantaj seviyeleri">
        <article
          v-for="tier in scoreBadgeBenefitTiers"
          :key="tier.id"
          :class="[
            'score-badge-tier-card',
            `is-${tier.tone}`,
            tier.emphasis === 'primary' ? 'is-primary' : '',
          ]"
          :aria-label="tier.ariaLabel"
          data-testid="score-badge-tier-card"
        >
          <div class="score-badge-tier-card__emblem" aria-hidden="true">
            <img
              class="score-badge-tier-card__badge"
              :src="getTierBadgeAsset(tier)"
              :alt="`${tier.tier} performans rozeti`"
              data-testid="score-badge-tier-badge"
              loading="lazy"
              decoding="async"
            />
            <span class="sr-only">{{ tier.tier }}</span>
          </div>

          <div class="score-badge-tier-card__content">
            <h3>
              <span>{{ tier.headlineStrong }}</span>
              {{ tier.headlineRest }}
            </h3>
            <p>
              <img
                class="score-badge-tier-card__supporting-icon"
                :src="getSupportingAsset(tier)"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
              <strong>{{ tier.secondary }}</strong>
            </p>
          </div>

          <span class="score-badge-tier-card__score" data-testid="score-badge-tier-score">
            {{ tier.score }}
          </span>
        </article>
      </div>

      <aside class="score-badge-advantages-note" data-testid="score-badge-advantages-note">
        <span class="score-badge-advantages-note__icon" aria-hidden="true">
          <img
            class="score-badge-advantages-note__asset"
            :src="getAssetUrl('premium_note_shield.svg')"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </span>
        <p>{{ scoreBadgeAdvantagesCopy.note }}</p>
      </aside>
    </section>
  </AppSheet>
</template>
