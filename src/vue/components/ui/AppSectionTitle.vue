<script setup>
defineProps({
  title: { type: String, required: true },
  actionLabel: { type: String, default: "" },
});

const emit = defineEmits(["action"]);
</script>

<template>
  <div class="v-section-title">
    <h2>{{ title }}</h2>
    <button
      v-if="actionLabel"
      class="v-section-title__action"
      type="button"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
