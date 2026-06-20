<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { notifications as sourceNotifications } from "../../data/mockData.js";
import AppButton from "../components/ui/AppButton.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const router = useRouter();
const showReadNotifications = ref(false);
const visibleCount = ref(7);
const readIds = ref(new Set());
const cleared = ref(false);

const allItems = computed(() =>
  cleared.value
    ? []
    : sourceNotifications.map((item) => ({
        ...item,
        isRead: !item.unread || readIds.value.has(item.id),
      })),
);
const displayedItems = computed(() =>
  showReadNotifications.value ? allItems.value : allItems.value.filter((item) => !item.isRead),
);
const visibleItems = computed(() => displayedItems.value.slice(0, Math.min(visibleCount.value, displayedItems.value.length)));
const hasHiddenReadItems = computed(() => allItems.value.some((item) => item.isRead));
const showMoreIndicator = computed(
  () => displayedItems.value.length > visibleCount.value || (!showReadNotifications.value && hasHiddenReadItems.value),
);

function markAllRead() {
  readIds.value = new Set(sourceNotifications.map((item) => item.id));
}

function toggleReadItems() {
  showReadNotifications.value = !showReadNotifications.value;
}

function openNotification(item) {
  if (item?.route) router.push(item.route);
}
</script>

<template>
  <AppPage title="Bildirimler" class="notifications-page" data-testid="notifications-page">
    <section class="notification-actions-bar" aria-label="Bildirim liste işlemleri">
      <AppButton
        class="notification-action-btn is-muted"
        type="button"
        variant="ghost"
        size="sm"
        data-testid="notifications-filter-all"
        @click="toggleReadItems"
      >
        {{ showReadNotifications ? "Okunanları Gizle" : "Okunanları Göster" }}
      </AppButton>
      <AppButton
        class="notification-action-btn"
        type="button"
        variant="secondary"
        size="sm"
        icon="check"
        data-testid="notifications-mark-read"
        @click="markAllRead"
      >
        Okundu Yap
      </AppButton>
      <button
        class="icon-btn icon-only-btn page-header-action"
        type="button"
        data-testid="notification-settings-button"
        aria-label="Bildirim ayarları"
        @click="router.push('/notification-settings')"
      >
        <AppIcon name="settings" :size="20" class-name="icon" />
      </button>
    </section>

    <section v-if="!visibleItems.length" class="notification-empty" aria-label="Boş bildirim kutusu">
      <span>
        <strong>Bildirim kutun temiz</strong>
        <small>Yeni iş, cüzdan ve destek bildirimleri burada görünür.</small>
      </span>
    </section>

    <section v-else class="notification-list" aria-label="Bildirim listesi">
      <button
        v-for="item in visibleItems"
        :key="item.id"
        :class="['notification-card-row', item.isRead ? 'is-read' : 'is-unread', `is-${item.tone || 'neutral'}`]"
        type="button"
        data-action="open-notification"
        data-testid="notification-card"
        :data-notification-id="item.id"
        :data-notification-screen="item.screen || 'home'"
        :aria-label="item.title"
        @click="openNotification(item)"
      >
        <span class="notification-card-copy">
          <strong>{{ item.title }}</strong>
          <small>{{ item.description }}</small>
        </span>
        <span v-if="item.tone === 'warning'" class="notification-card-cta">{{ item.actionLabel || "Gör" }}</span>
      </button>
      <div
        class="notification-load-note"
        data-notification-load-note
        :data-complete="visibleItems.length < displayedItems.length ? 'false' : 'true'"
        aria-hidden="true"
      ></div>
      <div v-if="showMoreIndicator" class="notification-more-indicator" aria-hidden="true"><span></span></div>
    </section>
  </AppPage>
</template>
