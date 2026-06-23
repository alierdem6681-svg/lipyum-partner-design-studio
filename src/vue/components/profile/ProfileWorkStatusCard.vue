<script setup>
import { computed } from "vue";
import { useProfileStore } from "../../stores/profileStore.js";

const profile = useProfileStore();

const statusText = computed(() => (profile.isWorking ? "Aktif" : "Pasif"));
const helperText = computed(() =>
  profile.isWorking ? "Yeni iş fırsatlarına açıksın." : "Yeni iş alımı geçici olarak kapalı.",
);
</script>

<template>
  <section
    :class="['profile-work-status-card', profile.isWorking ? 'is-working' : 'is-resting']"
    data-testid="profile-work-status-card"
    aria-label="Çalışma durumu"
  >
    <span class="profile-work-status-card__copy">
      <strong>Çalışma Durumu</strong>
      <small>{{ helperText }}</small>
    </span>
    <button
      :class="['toggle', profile.isWorking ? 'is-on' : '']"
      type="button"
      data-testid="profile-work-status-toggle"
      aria-label="Çalışma durumunu değiştir"
      :aria-pressed="profile.isWorking ? 'true' : 'false'"
      @click="profile.toggleWorkingStatus()"
    >
      <span aria-hidden="true"></span>
      <strong>{{ statusText }}</strong>
    </button>
  </section>
</template>
