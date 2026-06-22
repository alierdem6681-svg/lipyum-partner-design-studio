<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] },
  modelValue: { type: String, default: "" },
  ariaLabel: { type: String, default: "Filtreler" },
  sticky: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "select"]);

function getChipClass(item) {
  return [
    "filter-chip",
    item.tone ? `is-tone-${item.tone}` : "",
    {
      "is-active": props.modelValue === item.value,
      "is-action": item.kind === "action",
      "is-danger": item.tone === "danger",
      "is-wide": item.size === "wide",
      "is-xwide": item.size === "xwide",
    },
  ];
}

function getDotClass(item) {
  return ["filter-chip-dot", item.tone ? `is-tone-${item.tone}` : "is-tone-primary"];
}

function shouldShowDot(item) {
  return item.kind !== "action" && item.dot !== false;
}

function selectItem(item) {
  emit("select", item);
  if (item.kind === "action" || item.disabled) return;
  emit("update:modelValue", item.value);
}
</script>

<template>
  <div class="filter-chip-rail" :class="{ 'is-sticky': sticky }" :aria-label="ariaLabel">
    <button
      v-for="item in items"
      :key="item.value"
      :class="getChipClass(item)"
      type="button"
      v-bind="item.attrs || {}"
      :data-testid="item.testId"
      :data-filter="item.filterId || item.value"
      :aria-pressed="item.kind === 'action' ? undefined : props.modelValue === item.value ? 'true' : 'false'"
      :disabled="item.disabled"
      @click="selectItem(item)"
    >
      <span v-if="shouldShowDot(item)" :class="getDotClass(item)" aria-hidden="true"></span>
      <span class="filter-chip-label">{{ item.label }}</span>
      <span v-if="item.count !== undefined" class="filter-chip-count" aria-hidden="true">{{ item.count }}</span>
    </button>
  </div>
</template>
