<script setup>
import AppPage from "../components/ui/AppPage.vue";

defineProps({
  title: { type: String, required: true },
  testId: { type: String, required: true },
});
</script>

<template>
  <AppPage :title="title" compact>
    <div
      class="v-blank-route"
      :aria-label="title"
      :data-testid="testId"
      data-blank-route="true"
    ></div>
  </AppPage>
</template>
