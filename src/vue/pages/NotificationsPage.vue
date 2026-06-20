<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { notifications as sourceNotifications } from "../../data/mockData.js";
import AppButton from "../components/ui/AppButton.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const DEFAULT_NOTIFICATION_LIMIT = 15;
const INITIAL_VISIBLE_COUNT = 7;
const LOAD_INCREMENT = 4;
const defaultNotifications = sourceNotifications.slice(0, DEFAULT_NOTIFICATION_LIMIT);

const router = useRouter();
const showReadNotifications = ref(false);
const visibleCount = ref(INITIAL_VISIBLE_COUNT);
const readIds = ref(new Set());
const cleared = ref(false);
const listSentinel = ref(null);
let listObserver;

const allItems = computed(() =>
  cleared.value
    ? []
    : defaultNotifications.map((item) => ({
        ...item,
        isRead: !item.unread || readIds.value.has(item.id),
      })),
);
const displayedItems = computed(() =>
  showReadNotifications.value ? allItems.value : allItems.value.filter((item) => !item.isRead),
);
const visibleItems = computed(() => displayedItems.value.slice(0, Math.min(visibleCount.value, displayedItems.value.length)));
const showMoreIndicator = computed(() => displayedItems.value.length > visibleCount.value);

function markAllRead() {
  readIds.value = new Set(defaultNotifications.map((item) => item.id));
}

function toggleReadItems() {
  showReadNotifications.value = !showReadNotifications.value;
}

function clearAll() {
  cleared.value = true;
  showReadNotifications.value = false;
}

function loadMoreNotifications() {
  if (!showMoreIndicator.value) return;
  visibleCount.value = Math.min(displayedItems.value.length, visibleCount.value + LOAD_INCREMENT);
}

function openNotification(item) {
  if (item?.route) router.push(item.route);
}

function resetVisibleCount() {
  visibleCount.value = Math.min(INITIAL_VISIBLE_COUNT, Math.max(displayedItems.value.length, INITIAL_VISIBLE_COUNT));
}

function getScrollRoot() {
  return document.querySelector("#appRoot") || document.querySelector(".v-shell__content");
}

function isLoadPointVisible() {
  const node = listSentinel.value;
  const root = getScrollRoot();
  if (!node || !root) return false;
  const nodeRect = node.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();
  return nodeRect.top <= rootRect.bottom + 8 && nodeRect.bottom >= rootRect.top;
}

async function loadIfSentinelVisible() {
  await nextTick();
  if (isLoadPointVisible()) loadMoreNotifications();
}

function observeSentinel(node) {
  if (!listObserver || !node) return;
  listObserver.observe(node);
}

watch(displayedItems, () => {
  resetVisibleCount();
  loadIfSentinelVisible();
});

watch(visibleCount, () => {
  loadIfSentinelVisible();
});

watch(listSentinel, (node, oldNode) => {
  if (!listObserver) return;
  if (oldNode) listObserver.unobserve(oldNode);
  observeSentinel(node);
});

onMounted(() => {
  if (!("IntersectionObserver" in window)) return;
  listObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) loadMoreNotifications();
    },
    {
      root: getScrollRoot(),
      rootMargin: "80px 0px 120px",
      threshold: 0.01,
    },
  );
  observeSentinel(listSentinel.value);
  loadIfSentinelVisible();
});

onBeforeUnmount(() => {
  if (listObserver) listObserver.disconnect();
});
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
        :disabled="!allItems.length"
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
        :disabled="!allItems.length"
        @click="markAllRead"
      >
        Okundu Yap
      </AppButton>
      <AppButton
        class="notification-action-btn is-danger"
        type="button"
        variant="ghost"
        size="sm"
        icon="x"
        data-testid="notifications-clear-all"
        :disabled="!allItems.length"
        @click="clearAll"
      >
        Tümünü Sil
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
        ref="listSentinel"
        class="notification-load-note"
        data-notification-load-note
        :data-complete="visibleItems.length < displayedItems.length ? 'false' : 'true'"
        aria-hidden="true"
      ></div>
      <div v-if="showMoreIndicator" class="notification-more-indicator" aria-hidden="true"><span></span></div>
    </section>
  </AppPage>
</template>
