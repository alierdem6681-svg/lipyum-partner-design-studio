<script setup>
import AppPage from "../components/ui/AppPage.vue";
</script>

<template>
  <AppPage title="Cüzdanım" data-testid="wallet-page">
    <section
      class="v-empty-page-shell"
      aria-label="Cüzdan içeriği"
      data-blank-route="true"
      data-testid="wallet-empty-page"
    ></section>
  </AppPage>
</template>
