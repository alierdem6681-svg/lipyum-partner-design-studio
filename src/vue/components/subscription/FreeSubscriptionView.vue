<script setup>
import GoldFocusSubscriptionView from "./GoldFocusSubscriptionView.vue";

defineProps({
  store: { type: Object, required: true },
});
</script>

<template>
  <GoldFocusSubscriptionView :store="store" />
</template>
