<script setup>
import { onBeforeUnmount, watch } from "vue";
import AppIcon from "../ui/AppIcon.vue";
import AppSheet from "../ui/AppSheet.vue";
import ScoreTierEmblem from "./ScoreTierEmblem.vue";
import {
  scoreBadgeAdvantagesCopy,
  scoreBadgeBenefitTiers,
} from "../../data/scoreBadgeAdvantages.js";

const props = defineProps({
  open: { type: Boolean, default: false },
});

const emit = defineEmits(["close"]);

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
            <ScoreTierEmblem :tier="tier.tier" :tone="tier.tone" />
          </div>

          <div class="score-badge-tier-card__content">
            <h3>
              <span>{{ tier.headlineStrong }}</span>
              {{ tier.headlineRest }}
            </h3>
            <p>
              <AppIcon :name="tier.secondaryIcon" :size="14" :stroke-width="2.4" />
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
          <AppIcon name="shield" :size="18" />
        </span>
        <p>{{ scoreBadgeAdvantagesCopy.note }}</p>
      </aside>
    </section>
  </AppSheet>
</template>
