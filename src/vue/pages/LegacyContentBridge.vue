<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppCard from "../components/ui/AppCard.vue";
import AppPage from "../components/ui/AppPage.vue";
import { ROUTE_TITLES } from "../../utils/constants.js";

const route = useRoute();
const title = computed(() => ROUTE_TITLES[route.path] || "Lipyum Partner");
</script>

<template>
  <AppPage :title="title">
    <AppCard padding="lg">
      <div class="v-feature-card">
        <h3>{{ title }}</h3>
        <p>Bu route V12'de geçici compatibility bridge ile açılıyor. Core route değildir; V13 migrasyon listesinde tutulur.</p>
      </div>
    </AppCard>
  </AppPage>
</template>
