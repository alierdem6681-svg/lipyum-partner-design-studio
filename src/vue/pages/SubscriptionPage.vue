<script setup>
import AppEmptyState from "../components/ui/AppEmptyState.vue";
import AppPage from "../components/ui/AppPage.vue";
</script>

<template>
  <AppPage title="Aboneliğim" data-testid="subscription-page">
    <section data-testid="subscription-empty-state" aria-label="Aboneliğim boş ekranı">
      <AppEmptyState
        icon="crown"
        title="Aboneliğim"
        description="Bu alan şu anda boş."
      />
    </section>
  </AppPage>
</template>
