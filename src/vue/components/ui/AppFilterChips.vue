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
    {
      "is-active": props.modelValue === item.value,
      "is-action": item.kind === "action",
      "is-danger": item.tone === "danger",
      "is-wide": item.size === "wide",
      "is-xwide": item.size === "xwide",
    },
  ];
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
      :data-testid="item.testId"
      :data-filter="item.filterId || item.value"
      :aria-pressed="item.kind === 'action' ? undefined : modelValue === item.value ? 'true' : 'false'"
      :disabled="item.disabled"
      @click="selectItem(item)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
