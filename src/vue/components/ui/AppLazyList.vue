<script setup>
import AppButton from "./AppButton.vue";
import AppEmptyState from "./AppEmptyState.vue";

defineProps({
  items: { type: Array, default: () => [] },
  hasMore: { type: Boolean, default: false },
  emptyTitle: { type: String, default: "Kayıt bulunamadı" },
  emptyDescription: { type: String, default: "" },
  loadMoreLabel: { type: String, default: "Daha Fazla Göster" },
});

const emit = defineEmits(["load-more"]);
</script>

<template>
  <section class="grid gap-3">
    <template v-if="items.length">
      <slot v-for="item in items" :item="item" />
      <AppButton v-if="hasMore" variant="secondary" full-width @click="emit('load-more')">{{ loadMoreLabel }}</AppButton>
    </template>
    <AppEmptyState v-else icon="list" :title="emptyTitle" :description="emptyDescription" />
  </section>
</template>
