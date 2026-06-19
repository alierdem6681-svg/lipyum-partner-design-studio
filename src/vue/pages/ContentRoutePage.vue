<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppBadge from "../components/ui/AppBadge.vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppFilterChips from "../components/ui/AppFilterChips.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppModal from "../components/ui/AppModal.vue";
import AppPage from "../components/ui/AppPage.vue";
import { getActiveRouteContent } from "../data/activeRouteContent.js";
import { useAppShellStore } from "../stores/appShellStore.js";
import { useProfileStore } from "../stores/profileStore.js";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";

const route = useRoute();
const router = useRouter();
const shell = useAppShellStore();
const profile = useProfileStore();
const subscription = useSubscriptionStore();

const selectedFilter = ref("Tümü");
const modal = ref(null);
const liveState = ref("idle");
const liveMessages = ref([]);
const liveDraft = ref("");
const typing = ref(false);
let liveTimer = 0;
let typingTimer = 0;

const page = computed(() => getActiveRouteContent(route.path));
const routeTestIds = {
  "/support/customer-service": "customer-service-page",
};
const testId = computed(() => routeTestIds[route.path] || `route-${route.path.replace(/\W+/g, "-") || "home"}`);
const groupLabels = {
  profile: "Profil",
  support: "Destek",
  growth: "Büyüme",
  referral: "Kazanç ortaklığı",
  finance: "Finans",
};
const groupLabel = computed(() => groupLabels[page.value?.group] || page.value?.title || "");
const visibleBadges = computed(() => {
  const badges = page.value?.badges || [];
  return profile.expandedBadges ? badges : badges.slice(0, 4);
});
const hiddenBadgeCount = computed(() => Math.max(0, (page.value?.badges?.length || 0) - visibleBadges.value.length));

watch(
  () => route.path,
  () => {
    selectedFilter.value = "Tümü";
    profile.resetBadges();
    clearLiveTimers();
    liveState.value = "idle";
    liveMessages.value = [];
    liveDraft.value = "";
    typing.value = false;
  },
  { immediate: true },
);

onBeforeUnmount(() => clearLiveTimers());

function clearLiveTimers() {
  window.clearTimeout(liveTimer);
  window.clearTimeout(typingTimer);
}

function openSheet(title, body, description = "İşlem") {
  shell.openSheet({ title, body, description });
}

function openModal(title, body) {
  modal.value = { title, body };
}

function routeTo(target) {
  if (!target) return;
  router.push(target);
}

function handleAction(action) {
  if (!action) return;
  if (action.route) routeTo(action.route);
  if (action.type === "route") routeTo(action.route);
  if (action.type === "sheet") openSheet(action.title || action.label, action.body || "İşlem hazırlandı.");
  if (action.type === "modal") openModal(action.title || action.label, action.body || "İşlem hazırlandı.");
  if (action.action === "select-plan") {
    subscription.selectPlan(action.title);
    openSheet("Abonelik planı", `${action.title} planı seçildi. Müşteri Hizmetleri erişimi abonelik planına bağlandı.`);
  }
  if (action.action === "partner-detail") openSheet(action.title, "Partner detay sheet açıldı. Filtre, durum ve kazanç bilgileri burada yönetilir.");
  if (action.action && !action.route && !action.type && action.action !== "select-plan" && action.action !== "partner-detail") {
    openSheet(action.title || "İşlem", `${action.title || "Seçilen işlem"} için mock akış hazırlandı.`);
  }
}

function isInteractive(item) {
  return Boolean(item?.route || item?.type || item?.action);
}

function startLiveSupport() {
  clearLiveTimers();
  liveState.value = "waiting";
  liveMessages.value = [
    { from: "system", text: "Talep başlığı alındı. Tahmini süre 2 dakika." },
  ];
  liveTimer = window.setTimeout(() => {
    liveState.value = "connected";
    liveMessages.value.push({ from: "agent", text: "Merhaba, Lipyum canlı destek hattına hoş geldiniz. Size nasıl yardımcı olabiliriz?" });
  }, 5000);
}

function createTicketWhileWaiting() {
  openSheet("Talep Oluştur", "Canlı destek beklerken yazılı talep oluşturma akışı açıldı.");
}

function sendLiveMessage() {
  const text = liveDraft.value.trim();
  if (!text) return;
  liveMessages.value.push({ from: "user", text });
  liveDraft.value = "";
  typing.value = true;
  window.clearTimeout(typingTimer);
  typingTimer = window.setTimeout(() => {
    typing.value = false;
    liveMessages.value.push({ from: "agent", text: "Mesajınızı aldık. İlgili kayıtları kontrol edip kısa sürede dönüş yapıyoruz." });
  }, 1200);
}

function endLiveSupport() {
  clearLiveTimers();
  liveState.value = "ended";
  typing.value = false;
  liveMessages.value.push({ from: "system", text: "Konuşma bitirildi." });
}
</script>

<template>
  <AppPage v-if="page" :title="page.title" :data-testid="testId">
    <div class="v-stack v-content-route">
      <AppCard padding="lg" variant="hero" class="v-content-hero">
        <div class="v-content-hero__copy">
          <AppChip tone="success">{{ groupLabel }}</AppChip>
          <h2>{{ page.title }}</h2>
          <p>{{ page.lead }}</p>
        </div>
        <div v-if="page.actions?.length" class="v-content-actions">
          <AppButton
            v-for="action in page.actions"
            :key="action.label"
            size="sm"
            :icon="action.icon"
            :variant="action.type === 'route' ? 'secondary' : 'primary'"
            :data-testid="`action-${action.label.replace(/\W+/g, '-').toLowerCase()}`"
            @click="handleAction(action)"
          >
            {{ action.label }}
          </AppButton>
        </div>
      </AppCard>

      <AppCard v-if="page.profileCard" padding="lg" class="v-profile-summary-card" data-testid="profile-summary-card">
        <div class="v-profile-summary-card__top">
          <div class="v-avatar-mark">AK</div>
          <div>
            <h3>Ahmet Kaya</h3>
            <p>Gold Partner · Klima ve beyaz eşya servisi</p>
          </div>
        </div>
        <div class="v-badge-grid">
          <AppBadge v-for="badge in visibleBadges" :key="badge" tone="success">{{ badge }}</AppBadge>
          <button
            v-if="hiddenBadgeCount"
            class="v-badge-more"
            type="button"
            data-testid="profile-badge-more"
            @click="profile.showAllBadges"
          >
            +{{ hiddenBadgeCount }}
          </button>
        </div>
      </AppCard>

      <div v-if="page.metrics?.length" class="v-content-metric-grid">
        <AppCard v-for="metric in page.metrics" :key="metric.label" padding="md" class="v-content-metric">
          <AppIcon :name="metric.icon" :size="18" />
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
        </AppCard>
      </div>

      <AppFilterChips
        v-if="page.filters?.length"
        v-model="selectedFilter"
        :items="page.filters.map((filter) => ({ label: filter, value: filter }))"
        aria-label="Route filtreleri"
        data-testid="content-filter-chips"
      />

      <template v-if="page.kind === 'live-support'">
        <AppCard padding="lg" data-testid="live-support-card">
          <div class="v-live-support">
            <h3>Canlı destek talebi</h3>
            <p>Talep başlığı ve kısa açıklama ile görüşmeyi başlatın.</p>
            <AppButton v-if="liveState === 'idle'" icon="message" @click="startLiveSupport">Canlı sohbete başla</AppButton>
            <div v-if="liveState === 'waiting'" class="v-live-waiting">
              <AppChip tone="warning">Tahmini süre 2 dakika</AppChip>
              <p>Temsilci bağlanırken bekliyorsunuz.</p>
              <AppButton variant="secondary" icon="file-text" @click="createTicketWhileWaiting">Talep Oluştur</AppButton>
            </div>
            <div v-if="liveMessages.length" class="v-chat-thread">
              <div
                v-for="(message, index) in liveMessages"
                :key="`${message.from}-${index}`"
                :class="['v-chat-bubble', `is-${message.from}`]"
              >
                {{ message.text }}
              </div>
              <div v-if="typing" class="v-chat-bubble is-agent">Yazıyor...</div>
            </div>
            <div v-if="liveState === 'connected'" class="v-chat-input">
              <input v-model="liveDraft" type="text" aria-label="Canlı destek mesajı" placeholder="Mesaj yaz" @keyup.enter="sendLiveMessage" />
              <AppButton icon="send" size="sm" @click="sendLiveMessage">Gönder</AppButton>
              <AppButton variant="ghost" size="sm" @click="endLiveSupport">Konuşmayı bitir</AppButton>
            </div>
          </div>
        </AppCard>
      </template>

      <AppCard v-if="page.requiresSubscription" padding="lg" class="v-subscription-access">
        <div>
          <h3>Abonelik erişimi</h3>
          <p>{{ subscription.hasPaidSubscription ? `${subscription.activeSubscriptionPlan} planı aktif.` : "Ücretli plan seçilmedi." }}</p>
          <span v-if="route.path === '/support/customer-service'" data-testid="customer-service-phone-number">444 23 68</span>
        </div>
        <AppButton
          size="sm"
          icon="crown"
          :data-testid="route.path === '/support/customer-service' ? 'customer-service-upgrade' : undefined"
          @click="routeTo('/subscription')"
        >
          Aboneliğim
        </AppButton>
      </AppCard>

      <section v-for="section in page.sections" :key="section.title" class="v-content-section">
        <div class="v-section-title">
          <h2>{{ section.title }}</h2>
        </div>
        <div class="v-content-list" role="list">
          <component
            v-for="item in section.items"
            :is="isInteractive(item) ? AppCard : 'article'"
            :key="item.title"
            padding="md"
            :as="isInteractive(item) ? 'button' : undefined"
            :class="['v-content-list-item', !isInteractive(item) ? 'v-content-list-item--static v-card v-card--p-md v-card--default' : '']"
            :data-testid="`item-${item.title.replace(/\W+/g, '-').toLowerCase()}`"
            role="listitem"
            @click="handleAction(item)"
          >
            <span class="v-content-list-item__icon"><AppIcon :name="item.icon" :size="20" /></span>
            <span class="v-content-list-item__copy">
              <strong>{{ item.title }}</strong>
              <small>{{ item.body }}</small>
            </span>
            <AppIcon v-if="isInteractive(item)" name="chevron-right" :size="18" />
          </component>
        </div>
      </section>
    </div>

    <AppModal
      v-if="modal"
      :open="!!modal"
      :title="modal.title"
      :description="modal.body"
      @close="modal = null"
    >
      <p class="v-sheet-copy">{{ modal.body }}</p>
    </AppModal>
  </AppPage>
</template>
