<script setup>
import AppButton from "./AppButton.vue";
import AppIcon from "./AppIcon.vue";

defineProps({
  title: { type: String, default: "Bir sorun oluştu" },
  description: { type: String, default: "Tekrar deneyebilirsin." },
  actionLabel: { type: String, default: "" },
});

const emit = defineEmits(["retry"]);
</script>

<template>
  <section class="rounded-card border border-red-100 bg-red-50 p-4 text-center">
    <span class="mx-auto grid h-11 w-11 place-items-center rounded-full bg-white text-red-600">
      <AppIcon name="alert" :size="22" />
    </span>
    <strong class="mt-3 block text-body font-bold text-red-700">{{ title }}</strong>
    <p class="mt-1 text-small font-semibold text-red-500">{{ description }}</p>
    <AppButton v-if="actionLabel" class="mt-3" variant="danger" @click="emit('retry')">{{ actionLabel }}</AppButton>
  </section>
</template>
