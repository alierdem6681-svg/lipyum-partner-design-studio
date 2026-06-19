<script setup>
import { useRouter } from "vue-router";
import AppIcon from "../ui/AppIcon.vue";
import { useProfileStore } from "../../stores/profileStore.js";

const router = useRouter();
const profile = useProfileStore();
</script>

<template>
  <section class="profile-strength-card" aria-label="Profilini güçlendir">
    <div class="card-header">
      <h2 class="card-title">{{ profile.strength.title }}</h2>
      <p class="card-subtitle">{{ profile.strength.subtitle }}</p>
      <svg class="top-illustration" viewBox="0 0 180 120" aria-hidden="true">
        <circle cx="126" cy="42" r="36" fill="#dff8ef"></circle>
        <path d="M36 88C72 76 106 58 150 14" fill="none" stroke="#49c889" stroke-width="7" stroke-linecap="round"></path>
        <path d="M142 12l17-4-4 17" fill="none" stroke="#49c889" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"></path>
        <rect x="92" y="76" width="20" height="32" rx="4" fill="#cff3e5"></rect>
        <rect x="120" y="62" width="20" height="46" rx="4" fill="#cff3e5"></rect>
        <rect x="148" y="38" width="20" height="70" rx="4" fill="#cff3e5"></rect>
        <path d="M72 108h96" stroke="#d8efe7" stroke-width="2" stroke-linecap="round"></path>
      </svg>
    </div>

    <div class="card-content">
      <div class="score-panel">
        <div class="score-ring" :aria-label="`Profil gücü yüzde ${profile.strength.score}`">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle class="score-track" cx="60" cy="60" r="48"></circle>
            <circle class="score-progress" cx="60" cy="60" r="48"></circle>
          </svg>
          <div class="score-center">
            <strong class="score-value">{{ profile.strength.score }}</strong>
          </div>
        </div>
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
