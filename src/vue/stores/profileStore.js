import { defineStore } from "pinia";
import { partnerProfile, profileStrength } from "../../data/mockData.js";

const PROFILE_AVATAR_STORAGE_KEY = "lipyum.partner.avatar";
const PROFILE_WORK_STATUS_STORAGE_KEY = "lipyum.partner.workStatus";

function initialsFromName(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function readSavedAvatar() {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(PROFILE_AVATAR_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function readSavedWorkStatus() {
  if (typeof window === "undefined") return true;
  try {
    const saved = window.localStorage.getItem(PROFILE_WORK_STATUS_STORAGE_KEY);
    if (saved === "active") return true;
    if (saved === "passive") return false;
    return true;
  } catch {
    return true;
  }
}

export const useProfileStore = defineStore("profile", {
  state: () => ({
    expandedBadges: false,
    drawerBadgesExpanded: false,
    isWorking: readSavedWorkStatus(),
    partner: {
      ...partnerProfile,
      avatar: readSavedAvatar() || partnerProfile.avatar,
      initials: initialsFromName(partnerProfile.name),
      score: profileStrength.score,
      title: partnerProfile.tier,
      specialty: "Klima ve beyaz eşya servisi",
    },
    strength: profileStrength,
  }),
  getters: {
    visibleBadges: (state) => (state.expandedBadges ? state.partner.badges : state.partner.badges.slice(0, 3)),
    hiddenBadges: (state) => (state.expandedBadges ? state.partner.badges.slice(3) : []),
    hiddenBadgeCount: (state) => (state.expandedBadges ? 0 : Math.max(0, state.partner.badges.length - 3)),
    drawerVisibleBadges: (state) =>
      state.drawerBadgesExpanded ? state.partner.badges : state.partner.badges.slice(0, 3),
    drawerHiddenBadgeCount: (state) =>
      state.drawerBadgesExpanded ? 0 : Math.max(0, state.partner.badges.length - 3),
  },
  actions: {
    showAllBadges() {
      this.expandedBadges = true;
    },
    showAllDrawerBadges() {
      this.drawerBadgesExpanded = true;
    },
    resetBadges() {
      this.expandedBadges = false;
      this.drawerBadgesExpanded = false;
    },
    updatePartnerAvatar(avatar) {
      this.partner.avatar = avatar;
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(PROFILE_AVATAR_STORAGE_KEY, avatar);
      } catch {
        // Local storage can be unavailable in private or restricted contexts.
      }
    },
    setWorkingStatus(isWorking) {
      this.isWorking = Boolean(isWorking);
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(PROFILE_WORK_STATUS_STORAGE_KEY, this.isWorking ? "active" : "passive");
      } catch {
        // Local storage can be unavailable in private or restricted contexts.
      }
    },
    toggleWorkingStatus() {
      this.setWorkingStatus(!this.isWorking);
    },
  },
});
