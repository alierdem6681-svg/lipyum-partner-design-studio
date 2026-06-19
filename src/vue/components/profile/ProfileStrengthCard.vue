<script setup>
import { useRouter } from "vue-router";
import AppIcon from "../ui/AppIcon.vue";
import ProfileScoreRing from "./ProfileScoreRing.vue";
import ProfileStrengthIllustration from "./ProfileStrengthIllustration.vue";
import { useProfileStore } from "../../stores/profileStore.js";

const router = useRouter();
const profile = useProfileStore();
</script>

<template>
  <section class="profile-strength-card" aria-label="Profilini güçlendir">
    <div class="card-header">
      <h2 class="card-title">{{ profile.strength.title }}</h2>
      <p class="card-subtitle">{{ profile.strength.subtitle }}</p>
      <ProfileStrengthIllustration />
    </div>

    <div class="card-content">
      <div class="score-panel">
        <ProfileScoreRing :score="profile.strength.score" />
      </div>
      <span class="divider" aria-hidden="true"></span>
      <div class="checklist-panel">
        <div v-for="task in profile.strength.tasks" :key="task.label" class="checklist-item">
          <span :class="['checklist-icon', task.done ? 'done' : 'todo']" aria-hidden="true">
            <AppIcon :name="task.done ? 'check' : 'plus'" :size="14" class-name="icon" />
          </span>
          <span class="checklist-text">{{ task.label }}</span>
        </div>
      </div>
    </div>

    <button class="preview-button" type="button" data-action="profile-preview" @click="router.push('/partner-card-preview')">
      <AppIcon name="eye" :size="16" class-name="icon" />
      Müşteri Profilimi Önizle
    </button>
  </section>
</template>
