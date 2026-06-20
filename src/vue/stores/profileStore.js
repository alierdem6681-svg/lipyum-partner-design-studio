import { defineStore } from "pinia";
import { partnerProfile, profileStrength } from "../../data/mockData.js";

const PROFILE_AVATAR_STORAGE_KEY = "lipyum.partner.avatar";

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

export const useProfileStore = defineStore("profile", {
  state: () => ({
    expandedBadges: false,
    drawerBadgesExpanded: false,
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
  },
});
