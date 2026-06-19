<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppFilterChips from "../components/ui/AppFilterChips.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const router = useRouter();
const activeFilter = ref("all");
const visibleCount = ref(3);
const notifications = ref([
  { id: 1, type: "job", title: "Yeni teklif geldi", body: "Ümraniye klima bakım işi için teklif isteği.", unread: true },
  { id: 2, type: "support", title: "Destek yanıtladı", body: "Açık talebine yeni mesaj geldi.", unread: true },
  { id: 3, type: "job", title: "Randevu hatırlatması", body: "Bugünkü iş için müşteri teyidi bekliyor.", unread: false },
  { id: 4, type: "support", title: "Profil skoru arttı", body: "Yeni yorum skorunu yükseltti.", unread: false },
  { id: 5, type: "job", title: "Teklif sonucu", body: "Bir teklifin müşteri tarafından incelendi.", unread: false },
]);

const filters = [
  { label: "Tümü", value: "all" },
  { label: "Okunmamış", value: "unread" },
  { label: "İş", value: "job" },
  { label: "Destek", value: "support" },
];

const visibleNotifications = computed(() => notifications.value
  .filter((item) => activeFilter.value === "all" || (activeFilter.value === "unread" ? item.unread : item.type === activeFilter.value))
  .slice(0, visibleCount.value));

function markAllRead() {
  notifications.value = notifications.value.map((item) => ({ ...item, unread: false }));
}
</script>

<template>
  <AppPage title="Bildirimler" data-testid="notifications-page">
    <div class="v-stack">
      <div class="v-notification-toolbar">
        <AppFilterChips v-model="activeFilter" :items="filters" aria-label="Bildirim filtreleri" />
        <button type="button" aria-label="Bildirim Ayarları" data-testid="notification-settings-button" @click="router.push('/notification-settings')">
          <AppIcon name="settings" :size="20" />
        </button>
      </div>

      <AppButton size="sm" variant="secondary" icon="check" data-testid="notifications-mark-read" @click="markAllRead">
        Tümünü okundu yap
      </AppButton>

      <div class="v-content-list" role="list">
        <AppCard v-for="item in visibleNotifications" :key="item.id" padding="md" as="article" class="v-content-list-item" role="listitem">
          <span class="v-content-list-item__icon"><AppIcon name="bell" :size="20" /></span>
          <span class="v-content-list-item__copy">
            <strong>{{ item.title }}</strong>
            <small>{{ item.body }}</small>
          </span>
          <span v-if="item.unread" class="v-notification-dot" aria-label="Okunmamış"></span>
        </AppCard>
      </div>

      <AppButton v-if="visibleCount < notifications.length" variant="ghost" data-testid="notifications-load-more" @click="visibleCount += 2">
        Daha fazla yükle
      </AppButton>
    </div>
  </AppPage>
</template>
