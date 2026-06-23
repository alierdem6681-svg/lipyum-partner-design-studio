<script setup>
import { computed } from "vue";
import { BILLING_PERIODS } from "../../data/subscriptionPlans.js";
import AppButton from "../ui/AppButton.vue";
import AppIcon from "../ui/AppIcon.vue";
import SubscriptionBenefitList from "./SubscriptionBenefitList.vue";

const props = defineProps({
  plan: { type: Object, required: true },
  billingPeriod: { type: String, default: BILLING_PERIODS.MONTHLY },
  selected: { type: Boolean, default: false },
  current: { type: Boolean, default: false },
  recommended: { type: Boolean, default: false },
  ctaLabel: { type: String, default: "Planı seç" },
});

const emit = defineEmits(["select", "cta"]);

const price = computed(() => {
  if (props.billingPeriod === BILLING_PERIODS.ANNUAL) {
    return {
      main: `${props.plan.annualPrice.toLocaleString("tr-TR")} TL/yıl`,
      sub: `Aylık karşılığı ${props.plan.monthlyEquivalent} TL`,
    };
  }
  return {
    main: `${props.plan.monthlyPrice} TL / ay`,
    sub: props.plan.targetUser,
  };
});
</script>

<template>
  <article
    :class="['subscription-plan-card', selected ? 'is-selected' : '', current ? 'is-current' : '', recommended ? 'is-recommended' : '']"
    :data-testid="`subscription-plan-${plan.id}`"
  >
    <button class="subscription-plan-card__select" type="button" :aria-label="`${plan.title} planını seç`" @click="emit('select', plan.id)">
      <span class="subscription-plan-card__icon" aria-hidden="true">
        <AppIcon :name="plan.id === 'vip' ? 'trophy' : plan.id === 'gold' ? 'crown' : 'sparkles'" :size="22" />
      </span>
      <span>
        <strong>{{ plan.title }}</strong>
        <small>{{ plan.targetUser }}</small>
      </span>
      <em v-if="current">Mevcut</em>
      <em v-else-if="recommended">Önerilen</em>
    </button>

    <div class="subscription-plan-card__body">
      <p class="subscription-plan-card__price">
        <strong>{{ price.main }}</strong>
        <small>{{ price.sub }}</small>
      </p>
      <SubscriptionBenefitList :items="plan.benefits" :tone="plan.tone" />
      <AppButton full-width size="lg" :variant="recommended ? 'primary' : 'secondary'" @click="emit('cta', plan.id)">
        {{ ctaLabel }}
      </AppButton>
    </div>
  </article>
</template>
