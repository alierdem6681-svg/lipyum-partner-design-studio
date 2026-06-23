<script setup>
import { useRouter } from "vue-router";
import { supportInfoActions, supportQuickActions } from "../../data/mockData.js";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const router = useRouter();
const shell = useAppShellStore();

function openAction(action) {
  if (action.route) {
    router.push(action.route);
    return;
  }
  shell.openSheet({
    title: action.title || action.label,
    description: "Destek",
    body: action.description || "Destek aksiyonu hazırlandı.",
  });
}
</script>

<template>
  <AppPage title="Yardım ve Destek" class="support-page" data-testid="support-page">
    <AppCard padding="lg" variant="hero" class="v-route-hero">
      <div>
        <h2>Yardım ve Destek</h2>
        <p>Talep oluşturma, canlı destek ve müşteri hizmetleri kanallarını tek yerden yönet.</p>
      </div>
    </AppCard>

    <section class="v-content-list" role="list" aria-label="Destek kanalları">
      <AppCard
        v-for="action in supportQuickActions.slice(0, 2)"
        :key="action.title"
        padding="md"
        as="button"
        class="v-content-list-item"
        role="listitem"
        @click="openAction(action)"
      >
        <span class="v-content-list-item__icon"><AppIcon :name="action.icon" :size="20" /></span>
        <span class="v-content-list-item__copy">
          <strong>{{ action.title }}</strong>
          <small>{{ action.description }}</small>
        </span>
        <AppIcon name="chevron-right" :size="18" />
      </AppCard>

      <AppCard
        padding="md"
        as="button"
        class="v-content-list-item"
        role="listitem"
        @click="router.push('/support/customer-service')"
      >
        <span class="v-content-list-item__icon"><AppIcon name="phone" :size="20" /></span>
        <span class="v-content-list-item__copy">
          <strong>Müşteri Hizmetleri</strong>
          <small>Telefon ve destek kanallarını kullan.</small>
        </span>
        <AppIcon name="chevron-right" :size="18" />
      </AppCard>
    </section>

    <section class="v-content-list" role="list" aria-label="Destek konuları">
      <AppCard
        v-for="action in supportQuickActions.slice(2)"
        :key="action.title"
        padding="md"
        as="button"
        class="v-content-list-item"
        role="listitem"
        @click="openAction(action)"
      >
        <span class="v-content-list-item__icon"><AppIcon :name="action.icon" :size="20" /></span>
        <span class="v-content-list-item__copy">
          <strong>{{ action.title }}</strong>
          <small>{{ action.description }}</small>
        </span>
      </AppCard>
      <AppCard
        v-for="action in supportInfoActions"
        :key="action.title"
        padding="md"
        as="button"
        class="v-content-list-item"
        role="listitem"
        @click="openAction(action)"
      >
        <span class="v-content-list-item__icon"><AppIcon :name="action.icon" :size="20" /></span>
        <span class="v-content-list-item__copy">
          <strong>{{ action.title }}</strong>
          <small>{{ action.description }}</small>
        </span>
      </AppCard>
    </section>
  </AppPage>
</template>
