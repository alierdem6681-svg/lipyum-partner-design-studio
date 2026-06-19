<script setup>
defineProps({
  score: { type: Number, required: true },
});
</script>

<template>
  <div class="score-ring" :aria-label="`Profil gücü yüzde ${score}`">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle class="score-track" cx="60" cy="60" r="48"></circle>
      <circle class="score-progress" cx="60" cy="60" r="48"></circle>
    </svg>
    <div class="score-center">
      <strong class="score-value">{{ score }}</strong>
    </div>
  </div>
</template>
