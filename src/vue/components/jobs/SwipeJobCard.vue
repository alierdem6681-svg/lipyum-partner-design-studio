<script setup>
import AppIcon from "../ui/AppIcon.vue";
import { formatCustomerRating } from "../../data/jobSwipeModel.js";

defineProps({
  job: { type: Object, required: true },
  isPreview: { type: Boolean, default: false },
});

const emit = defineEmits(["cta", "open-customer"]);
</script>

<template>
  <article
    class="job-swipe-card"
    :class="{ 'is-preview': isPreview }"
    :aria-label="`${job.title} işi`"
    :data-testid="isPreview ? 'job-swipe-preview-card' : 'job-swipe-card'"
  >
    <header class="job-swipe-card__head">
      <span class="job-swipe-card__service-icon" aria-hidden="true">
        <AppIcon :name="job.icon || 'briefcase'" :size="46" />
      </span>
      <div class="job-swipe-card__title-block">
        <h2>{{ job.title }}</h2>
        <span class="job-swipe-card__badge">{{ job.statusLabel }}</span>
        <p class="job-swipe-card__location">
          <AppIcon name="map-pin" :size="19" />
          {{ job.location }}
        </p>
        <p class="job-swipe-card__ownership">{{ job.ownershipCopy }}</p>
      </div>
      <time class="job-swipe-card__time">{{ job.createdAtLabel }}</time>
    </header>

    <section class="job-swipe-card__metrics" aria-label="İş özeti">
      <span>
        <AppIcon name="clock" :size="28" />
        <small>Tahmini süre</small>
        <strong>{{ job.durationLabel }}</strong>
      </span>
      <span>
        <AppIcon name="wallet" :size="28" />
        <small>Kazanç</small>
        <strong class="is-green">{{ job.earningLabel }}</strong>
      </span>
    </section>

    <section class="job-swipe-card__chips" aria-label="İş özellikleri">
      <span v-for="chip in job.chips" :key="`${job.id}-${chip.title}`" class="job-swipe-feature-chip">
        <AppIcon :name="chip.icon" :size="23" />
        <span>
          <strong>{{ chip.title }}</strong>
          <small>{{ chip.label }}</small>
        </span>
      </span>
    </section>

    <section class="job-swipe-card__detail" aria-label="İş detayı">
      <AppIcon name="file-text" :size="22" />
      <div>
        <strong>İş Detayı</strong>
        <p v-for="line in job.details" :key="line">{{ line }}</p>
      </div>
    </section>

    <button
      class="job-swipe-card__customer"
      type="button"
      :tabindex="isPreview ? -1 : 0"
      :data-testid="isPreview ? undefined : 'job-swipe-customer-row'"
      @click="emit('open-customer', job)"
    >
      <span class="job-swipe-card__customer-avatar" aria-hidden="true">
        <AppIcon name="user" :size="27" />
      </span>
      <strong>{{ job.customer.name }}</strong>
      <span class="job-swipe-card__rating">
        <AppIcon name="star" :size="17" />
        {{ formatCustomerRating(job.customer) }}
      </span>
      <AppIcon name="chevron-right" :size="21" />
    </button>

    <button
      class="job-swipe-card__cta"
      type="button"
      :tabindex="isPreview ? -1 : 0"
      :data-testid="isPreview ? undefined : 'job-swipe-primary-cta'"
      @click="emit('cta', job)"
    >
      <AppIcon name="phone" :size="27" />
      <span>Ara, Randevu Ver</span>
    </button>
  </article>
</template>
