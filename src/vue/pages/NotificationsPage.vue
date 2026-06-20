<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { notifications as sourceNotifications } from "../../data/mockData.js";
import AppPage from "../components/ui/AppPage.vue";
import OnayModal from "../components/ui/OnayModal.vue";

const DEFAULT_NOTIFICATION_LIMIT = 15;
const INITIAL_VISIBLE_COUNT = 7;
const LOAD_INCREMENT = 4;
const defaultNotifications = sourceNotifications.slice(0, DEFAULT_NOTIFICATION_LIMIT);

const FILTERS = [
  { id: "all", label: "Tümü" },
  { id: "read", label: "Okunanlar" },
  { id: "unread", label: "Okunmayanlar" },
];

const router = useRouter();
const activeFilter = ref("all");
const visibleCount = ref(INITIAL_VISIBLE_COUNT);
const readIds = ref(new Set());
const deletedIds = ref(new Set());
const pendingAction = ref(null);
const listSentinel = ref(null);
let listObserver;

const allItems = computed(() =>
  defaultNotifications
    .filter((item) => !deletedIds.value.has(item.id))
    .map((item) => ({
      ...item,
      isRead: !item.unread || readIds.value.has(item.id),
    })),
);
const displayedItems = computed(() => {
  if (activeFilter.value === "read") return allItems.value.filter((item) => item.isRead);
  if (activeFilter.value === "unread") return allItems.value.filter((item) => !item.isRead);
  return allItems.value;
});
const visibleItems = computed(() => displayedItems.value.slice(0, Math.min(visibleCount.value, displayedItems.value.length)));
const showMoreIndicator = computed(() => displayedItems.value.length > visibleCount.value);

function setFilter(filterId) {
  activeFilter.value = filterId;
}

function loadMoreNotifications() {
  if (!showMoreIndicator.value) return;
  visibleCount.value = Math.min(displayedItems.value.length, visibleCount.value + LOAD_INCREMENT);
}

function openNotification(item) {
  if (item?.id) readIds.value = new Set([...readIds.value, item.id]);
  if (item?.route) router.push(item.route);
}

function openConfirm(action) {
  pendingAction.value = action;
}

function closeConfirm() {
  pendingAction.value = null;
}

function confirmPendingAction() {
  if (pendingAction.value === "mark-all-read") {
    readIds.value = new Set(defaultNotifications.map((item) => item.id));
  }
  if (pendingAction.value === "delete-all") {
    deletedIds.value = new Set(defaultNotifications.map((item) => item.id));
  }
  pendingAction.value = null;
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
    <section class="notification-actions-bar" aria-label="Bildirim filtreleri">
      <button
        v-for="filter in FILTERS"
        :key="filter.id"
        class="notification-filter-pill"
        :class="{ 'is-active': activeFilter === filter.id }"
        type="button"
        data-testid="notifications-filter-pill"
        :data-filter="filter.id"
        :aria-pressed="activeFilter === filter.id ? 'true' : 'false'"
        @click="setFilter(filter.id)"
      >
        {{ filter.label }}
      </button>
      <button
        class="notification-filter-pill is-action"
        type="button"
        data-testid="notifications-mark-all-read"
        @click="openConfirm('mark-all-read')"
      >
        Tümü okundu
      </button>
      <button
        class="notification-filter-pill is-action is-danger"
        type="button"
        data-testid="notifications-delete-all"
        @click="openConfirm('delete-all')"
      >
        Tümünü sil
      </button>
    </section>

    <section v-if="!visibleItems.length" class="notification-empty" aria-label="Boş bildirim kutusu">
      <span>
        <strong>Bildirim bulunamadı</strong>
        <small>Seçtiğin filtreye uygun bildirim yok.</small>
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

    <OnayModal
      :open="!!pendingAction"
      :title="pendingAction === 'delete-all' ? 'Tüm bildirimler silinsin mi?' : 'Tüm bildirimler okundu yapılsın mı?'"
      :message="pendingAction === 'delete-all' ? 'Bu işlem bildirim listesini temizler. Onaylıyor musun?' : 'Listedeki tüm bildirimler okundu olarak işaretlenecek. Onaylıyor musun?'"
      :confirm-label="pendingAction === 'delete-all' ? 'Sil' : 'Okundu yap'"
      :danger="pendingAction === 'delete-all'"
      @cancel="closeConfirm"
      @confirm="confirmPendingAction"
    />
  </AppPage>
</template>
