<script setup>
import { ref } from "vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const notificationSettings = [
  { id: "new-job", title: "Yeni iş bildirimi", description: "Yeni iş fırsatları için zorunlu bildirim.", icon: "briefcase", enabled: true, locked: true },
  { id: "pool-jobs", title: "Havuzda bekleyen işler", description: "Bölgendeki havuz işleri için uyarı al.", icon: "clipboard", enabled: true },
  { id: "offer-customers", title: "Teklif isteyen müşterilerin bildirimi", description: "Fiyat teklifi bekleyen müşterileri kaçırma.", icon: "users", enabled: true },
  { id: "discounts", title: "Fiyat indirimi bildirimleri", description: "Kredi, bonus ve kampanya indirimlerini bildir.", icon: "gift", enabled: true },
  { id: "leaderboard", title: "Liderlik tablosu bildirimleri", description: "Sıralama ve rozet değişimlerini takip et.", icon: "trophy", enabled: false },
  { id: "balance-end", title: "Bakiye bitişi ile ilgili bildirimler", description: "Kredi bitiş uyarıları zorunludur.", icon: "wallet", enabled: true, locked: true },
  { id: "bonus-delete", title: "Bonus silinme uyarıları", description: "Süresi dolacak bonuslar için haber ver.", icon: "alert", enabled: true },
  { id: "appointments", title: "Yeni randevu kayıtları", description: "Yeni randevu taleplerini anında bildir.", icon: "calendar", enabled: true },
  { id: "reviews", title: "Yeni müşteri yorumları", description: "Yeni yorum geldiğinde bildirim al.", icon: "message", enabled: true },
  { id: "ratings", title: "Müşteri puanlamaları", description: "Puanlama ve memnuniyet güncellemelerini göster.", icon: "star", enabled: true },
];

const enabledMap = ref(
  Object.fromEntries(notificationSettings.map((setting) => [setting.id, setting.enabled])),
);

function toggleSetting(setting) {
  if (setting.locked) return;
  enabledMap.value = {
    ...enabledMap.value,
    [setting.id]: !enabledMap.value[setting.id],
  };
}
</script>

<template>
  <AppPage title="Bildirim Ayarları" class="notification-settings-page" data-testid="notification-settings-page">
    <section class="notification-settings-list" aria-label="Bildirim türleri">
      <article
        v-for="setting in notificationSettings"
        :key="setting.id"
        class="notification-setting-row"
        :class="{ 'is-locked': setting.locked }"
        data-testid="notification-setting-row"
        :data-setting-id="setting.id"
      >
        <span class="notification-setting-icon" aria-hidden="true">
          <AppIcon :name="setting.icon" :size="20" />
        </span>
        <span class="notification-setting-copy">
          <strong>
            {{ setting.title }}
            <em v-if="setting.locked">(kapatılamaz)</em>
          </strong>
          <small>{{ setting.description }}</small>
        </span>
        <button
          class="notification-switch"
          :class="{ 'is-on': enabledMap[setting.id], 'is-locked': setting.locked }"
          type="button"
          role="switch"
          data-testid="notification-setting-switch"
          :aria-checked="enabledMap[setting.id] ? 'true' : 'false'"
          :aria-label="`${setting.title} bildirimi`"
          :disabled="setting.locked"
          @click="toggleSetting(setting)"
        >
          <span></span>
        </button>
      </article>
    </section>
  </AppPage>
</template>
