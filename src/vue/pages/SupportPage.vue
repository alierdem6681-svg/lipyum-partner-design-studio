<script setup>
import { useRouter } from "vue-router";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const router = useRouter();
const channels = [
  { title: "Talep Oluştur", body: "Kategori, konu ve öncelik seçerek destek talebi bırak.", icon: "file-text", route: "/support/new" },
  { title: "Canlı Destek", body: "Tahmini iki dakikalık bekleme sonrası Lipyum temsilcisiyle yazış.", icon: "message", route: "/support/live" },
  { title: "Müşteri Hizmetleri", body: "Abonelik planına bağlı telefon ve öncelikli destek akışı.", icon: "phone", route: "/support/customer-service" },
];
</script>

<template>
  <AppPage title="Yardım ve Destek" data-testid="support-page">
    <div class="v-stack">
      <AppCard padding="lg" variant="hero" class="v-route-hero">
        <h2>Yardım ve Destek</h2>
        <p>Talep oluşturma, canlı destek ve müşteri hizmetleri kanalları buradan açılır.</p>
      </AppCard>

      <div class="v-content-list" role="list">
        <AppCard
          v-for="channel in channels"
          :key="channel.route"
          padding="md"
          as="button"
          class="v-content-list-item"
          role="listitem"
          @click="router.push(channel.route)"
        >
          <span class="v-content-list-item__icon"><AppIcon :name="channel.icon" :size="20" /></span>
          <span class="v-content-list-item__copy">
            <strong>{{ channel.title }}</strong>
            <small>{{ channel.body }}</small>
          </span>
          <AppIcon name="chevron-right" :size="18" />
        </AppCard>
      </div>
    </div>
  </AppPage>
</template>
