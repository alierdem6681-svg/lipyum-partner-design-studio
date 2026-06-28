<script setup>
import { computed } from "vue";
import AppIcon from "../ui/AppIcon.vue";

const props = defineProps({
  status: { type: String, default: "reviewing" },
  statuses: { type: Object, required: true },
});

const statusMeta = computed(() => props.statuses[props.status] || props.statuses.reviewing);
</script>

<template>
  <span :class="['support-ticket-status-chip', `is-${statusMeta.tone}`]">
    <AppIcon :name="statusMeta.icon" :size="15" />
    <span>{{ statusMeta.label }}</span>
  </span>
</template>
