<script setup>
import { computed } from "vue";
import AppButton from "../ui/AppButton.vue";
import AppIcon from "../ui/AppIcon.vue";
import SubscriptionBenefitList from "./SubscriptionBenefitList.vue";

const props = defineProps({
  plan: { type: Object, required: true },
  billingPeriod: { type: String, default: "monthly" },
  selected: { type: Boolean, default: false },
  recommended: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
  ctaLabel: { type: String, default: "Planı seç" },
});

const emit = defineEmits(["select", "cta"]);

const price = computed(() => {
  if (props.billingPeriod === "annual") {
    return {
      main: `${props.plan.annualPrice.toLocaleString("tr-TR")} TL/yıl`,
      sub: `aylık karşılığı ${props.plan.monthlyEquivalent} TL`,
    };
  }
  return {
    main: `${props.plan.monthlyPrice} TL / ay`,
    sub: props.plan.monthlyPrice === 249 ? "günde yaklaşık 8,30 TL" : props.plan.targetUser,
  };
});
</script>

<template>
  <article
    :class="['subscription-plan-card', selected ? 'is-selected' : '', recommended ? 'is-recommended' : '', compact ? 'is-compact' : '']"
    :data-testid="`subscription-plan-${plan.id}`"
  >
    <button class="subscription-plan-card__select" type="button" :aria-label="`${plan.title} planını seç`" @click="emit('select', plan.id)">
      <span class="subscription-plan-card__icon" aria-hidden="true">
        <AppIcon :name="plan.id === 'vip' ? 'trophy' : plan.id === 'pro' ? 'crown' : 'sparkles'" :size="22" />
      </span>
      <span>
        <strong>{{ plan.title }}</strong>
        <small>{{ plan.targetUser }}</small>
      </span>
      <em v-if="recommended">{{ plan.badge }}</em>
    </button>

    <div v-if="!compact" class="subscription-plan-card__body">
      <p class="subscription-plan-card__price">
        <strong>{{ price.main }}</strong>
        <small>{{ price.sub }}</small>
      </p>
      <SubscriptionBenefitList :items="plan.benefits.slice(0, 4)" :tone="plan.tone" />
      <AppButton full-width size="lg" :variant="recommended ? 'primary' : 'secondary'" @click="emit('cta', plan.id)">
        {{ ctaLabel }}
      </AppButton>
    </div>
  </article>
</template>
