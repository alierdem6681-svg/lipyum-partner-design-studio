<script setup>
import { computed, ref } from "vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const notificationGroups = [
  {
    id: "jobs",
    title: "İş alımları",
    description: "Yeni iş, teklif, havuz ve randevu akışları.",
    settings: [
      { id: "new-job", title: "Yeni iş bildirimi", description: "Yeni iş fırsatları için zorunlu bildirim.", icon: "briefcase", enabled: true, locked: true },
      { id: "pool-jobs", title: "Havuzda bekleyen işler", description: "Bölgendeki havuz işleri için uyarı al.", icon: "clipboard", enabled: true },
      { id: "offer-customers", title: "Teklif isteyen müşterilerin bildirimi", description: "Fiyat teklifi bekleyen müşterileri kaçırma.", icon: "users", enabled: true },
      { id: "appointments", title: "Yeni randevu kayıtları", description: "Yeni randevu taleplerini anında bildir.", icon: "calendar", enabled: true },
    ],
  },
  {
    id: "finance",
    title: "Fiyat indirimleri ve finans",
    description: "Kredi, bonus, ödeme ve indirim uyarıları.",
    settings: [
      { id: "discounts", title: "Fiyat indirimi bildirimleri", description: "Kredi, bonus ve kampanya indirimlerini bildir.", icon: "gift", enabled: true },
      { id: "balance-end", title: "Bakiye bitişi ile ilgili bildirimler", description: "Kredi bitiş uyarıları zorunludur.", icon: "wallet", enabled: true, locked: true },
      { id: "bonus-delete", title: "Bonus silinme uyarıları", description: "Süresi dolacak bonuslar için haber ver.", icon: "alert", enabled: true },
      { id: "payment-reminders", title: "Ödeme ve fatura hatırlatmaları", description: "Fatura, ödeme ve tahsilat tarihlerini kaçırma.", icon: "receipt", enabled: true },
    ],
  },
  {
    id: "competition",
    title: "Rekabet ve performans",
    description: "Liderlik, skor ve bölgesel rekabet gelişmeleri.",
    settings: [
      { id: "leaderboard", title: "Liderlik tablosu bildirimleri", description: "Sıralama ve rozet değişimlerini takip et.", icon: "trophy", enabled: false },
      { id: "performance-score", title: "Performans skoru değişimleri", description: "Skor yükselişi, düşüşü ve kritik eşikleri bildir.", icon: "trend-up", enabled: true },
      { id: "regional-competition", title: "Bölgesel rekabet uyarıları", description: "Yakınındaki partner hareketleri ve fırsat yoğunluğunu göster.", icon: "target", enabled: false },
    ],
  },
  {
    id: "marketing",
    title: "Pazarlama ve müşteri ilişkileri",
    description: "Görünürlük, yorum, mesaj ve kampanya önerileri.",
    settings: [
      { id: "marketing", title: "Pazarlama bildirimleri", description: "Kampanya, vitrin ve öne çıkarma önerilerini al.", icon: "sparkles", enabled: true },
      { id: "profile-visibility", title: "Profil görünürlük önerileri", description: "Daha çok müşteri çekmek için profil geliştirme uyarıları.", icon: "eye", enabled: true },
      { id: "reviews", title: "Yeni müşteri yorumları", description: "Yeni yorum geldiğinde bildirim al.", icon: "message", enabled: true },
      { id: "ratings", title: "Müşteri puanlamaları", description: "Puanlama ve memnuniyet güncellemelerini göster.", icon: "star", enabled: true },
      { id: "support-messages", title: "Mesaj ve destek yanıtları", description: "Müşteri mesajı ve destek yanıtlarını anında bildir.", icon: "headphones", enabled: true },
      { id: "security", title: "Güvenlik ve hesap uyarıları", description: "Hesap güvenliği ve kritik oturum uyarıları zorunludur.", icon: "shield", enabled: true, locked: true },
    ],
  },
];

const flatSettings = computed(() => notificationGroups.flatMap((group) => group.settings));
const enabledMap = ref(Object.fromEntries(flatSettings.value.map((setting) => [setting.id, setting.enabled])));

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
    <section
      v-for="group in notificationGroups"
      :key="group.id"
      class="notification-settings-group"
      data-testid="notification-settings-group"
      :data-group-id="group.id"
      :aria-labelledby="`notification-group-title-${group.id}`"
    >
      <header class="notification-settings-group__header">
        <span>
          <h2 :id="`notification-group-title-${group.id}`">{{ group.title }}</h2>
          <p>{{ group.description }}</p>
        </span>
      </header>
      <div class="notification-settings-list" aria-label="Bildirim türleri">
        <article
          v-for="setting in group.settings"
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
      </div>
    </section>
  </AppPage>
</template>
