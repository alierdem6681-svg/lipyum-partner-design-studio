<script setup>
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { getRouteForScreen } from "../../router.js";
import { renderLegacyRouteBody } from "../../legacy/legacyRouteAdapter.js";
import { useAppShellStore } from "../stores/appShell.js";

const props = defineProps({
  routePath: { type: String, required: true },
});

const router = useRouter();
const appShell = useAppShellStore();
const state = reactive({
  lazyListCounts: { reviews: 4, wallet: 5, referral: 4, notifications: 7 },
  reviewFilter: "all",
  leaderboardSector: "Beyaz Eşya Tamiri",
  leaderboardRegion: "",
  supportTicketCreated: false,
  liveSupportStarted: false,
  customerServiceCallStarted: false,
  satisfactionRating: 0,
  satisfactionSubmitted: false,
  satisfactionStoreOpened: false,
  selectedReviewName: "",
  selectedReviewText: "",
});

const html = computed(() => renderLegacyRouteBody(props.routePath, {
  state,
  badgesExpanded: appShell.profileBadgesExpanded,
  created: state.supportTicketCreated,
  started: state.liveSupportStarted,
  rating: state.satisfactionRating,
  submitted: state.satisfactionSubmitted,
  storeOpened: state.satisfactionStoreOpened,
}));

function navigate(route) {
  if (!route) return;
  router.push(route);
}

function handleAction(action, element) {
  if (action === "go-back") {
    window.goBack?.();
    return;
  }
  if (action === "expand-profile-badges") {
    appShell.profileBadgesExpanded = true;
    return;
  }
  if (action === "convert-bonus") {
    appShell.openSheet("bonus-convert");
    return;
  }
  if (action === "buy-credit") {
    router.push("/wallet");
    return;
  }
  if (action === "submit-support-ticket") {
    state.supportTicketCreated = true;
    appShell.showToast("Talebin oluşturuldu");
    return;
  }
  if (action === "reset-support-ticket") {
    state.supportTicketCreated = false;
    return;
  }
  if (action === "start-live-support") {
    state.liveSupportStarted = true;
    return;
  }
  if (action === "set-satisfaction-rating") {
    state.satisfactionRating = Number(element?.dataset.rating || 0);
    state.satisfactionSubmitted = false;
    state.satisfactionStoreOpened = false;
    return;
  }
  if (action === "submit-satisfaction") {
    state.satisfactionSubmitted = true;
    return;
  }
  if (action === "open-store-review") {
    state.satisfactionStoreOpened = true;
    return;
  }
  if (action === "profile-preview") {
    router.push("/partner-card-preview");
    return;
  }
  if (action === "open-partner-share") {
    appShell.openSheet("partner-share");
    return;
  }
  if (action === "reply-review") {
    state.selectedReviewName = element?.dataset.reviewName || "Müşteri";
    state.selectedReviewText = element?.dataset.reviewText || "";
    appShell.openSheet("review-reply");
    return;
  }
  if (action === "report-review-comment") {
    appShell.showToast("Yorum bildirildi");
    return;
  }
  if (action === "mock-upload") {
    appShell.showToast("Görsel eklendi");
    return;
  }
  if (action === "header-info") {
    appShell.showToast("Sayfa bilgisi hazır");
  }
}

function handleClick(event) {
  const target = event.target.closest("[data-route], [data-screen], [data-action], [data-open], [data-review-filter]");
  if (!target) return;

  const route = target.dataset.route;
  const screen = target.dataset.screen;
  const action = target.dataset.action;
  const open = target.dataset.open;
  const reviewFilter = target.dataset.reviewFilter;

  if (route) {
    event.preventDefault();
    navigate(route);
    return;
  }
  if (screen) {
    event.preventDefault();
    navigate(getRouteForScreen(screen));
    return;
  }
  if (open) {
    event.preventDefault();
    appShell.openSheet(open === "credit" ? "credit-topup" : open);
    return;
  }
  if (reviewFilter) {
    state.reviewFilter = reviewFilter;
    return;
  }
  if (action) {
    event.preventDefault();
    handleAction(action, target);
  }
}

function handleChange(event) {
  const target = event.target;
  if (target?.matches("[data-leaderboard-sector]")) {
    state.leaderboardSector = target.value;
    state.leaderboardRegion = "";
  }
  if (target?.matches("[data-leaderboard-region]")) {
    state.leaderboardRegion = target.value;
    state.leaderboardSector = "";
  }
}
</script>

<template>
  <div class="legacy-content-bridge" data-testid="legacy-content-bridge" @click="handleClick" @change="handleChange" v-html="html" />
</template>
