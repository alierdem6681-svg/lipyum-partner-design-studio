<script setup>
import AppIcon from "../ui/AppIcon.vue";
import { jobOpportunityActions } from "../../data/jobOpportunitiesData.js";

defineProps({
  job: { type: Object, required: true },
});

const emit = defineEmits(["primary", "quick-action"]);
</script>

<template>
  <article :class="['job-cta-card', `job-cta-card--${job.type}`]" :data-testid="`job-card-${job.id}`">
    <div class="job-cta-card__rail" aria-hidden="true"></div>

    <div class="job-cta-card__main">
      <div class="job-cta-card__icon" aria-hidden="true">
        <AppIcon :name="job.categoryIcon" :size="26" />
      </div>

      <div class="job-cta-card__body">
        <div class="job-cta-card__topline">
          <h2>{{ job.service }}</h2>
          <span class="job-cta-card__age">{{ job.ageLabel }}</span>
        </div>

        <p class="job-cta-card__location">
          <AppIcon name="map-pin" :size="15" />
          <span>{{ job.location }}</span>
        </p>

        <p class="job-cta-card__status">
          <AppIcon :name="job.type === 'quote' ? 'users' : job.type === 'waiting-purchase' ? 'info' : 'check'" :size="16" />
          <span>{{ job.status }}</span>
        </p>

        <div v-if="job.duration || job.price" class="job-cta-card__facts" aria-label="İş özeti">
          <span v-if="job.duration">
            <AppIcon name="clock" :size="16" />
            {{ job.duration }}
          </span>
          <span v-if="job.price">
            <AppIcon name="wallet" :size="16" />
            {{ job.price }}
          </span>
        </div>
      </div>
    </div>

    <div class="job-cta-card__side">
      <div class="job-cta-card__quick" aria-label="Hızlı işlemler">
        <button
          v-for="action in job.actions"
          :key="action"
          type="button"
          class="job-cta-card__quick-btn"
          :aria-label="`${job.service} için ${jobOpportunityActions[action]?.label || 'işlem'}`"
          @click="emit('quick-action', { job, action })"
        >
          <AppIcon :name="jobOpportunityActions[action]?.icon || 'info'" :size="20" />
        </button>
      </div>

      <button type="button" class="job-cta-card__primary" @click="emit('primary', job)">
        <span>{{ job.ctaLabel }}</span>
        <AppIcon name="chevron-right" :size="18" />
      </button>
    </div>
  </article>
</template>
