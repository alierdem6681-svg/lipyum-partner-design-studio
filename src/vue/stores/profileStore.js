import { defineStore } from "pinia";
import { partnerProfile, profileStrength } from "../../data/mockData.js";

function initialsFromName(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const useProfileStore = defineStore("profile", {
  state: () => ({
    expandedBadges: false,
    drawerBadgesExpanded: false,
    partner: {
      ...partnerProfile,
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
  },
});
