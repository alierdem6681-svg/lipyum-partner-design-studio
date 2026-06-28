<script setup>
import AppIcon from "../ui/AppIcon.vue";

defineEmits(["reset"]);
</script>

<template>
  <section class="job-swipe-empty" data-testid="job-swipe-empty-state">
    <span class="job-swipe-empty__icon" aria-hidden="true">
      <AppIcon name="sparkles" :size="38" />
    </span>
    <h2>Şimdilik yeni iş yok</h2>
    <p>Sana uygun işler geldiğinde burada görünür.</p>
    <button type="button" @click="$emit('reset')">Tekrar kontrol et</button>
  </section>
</template>
