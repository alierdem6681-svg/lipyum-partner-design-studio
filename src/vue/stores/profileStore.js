import { defineStore } from "pinia";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    expandedBadges: false,
  }),
  actions: {
    showAllBadges() {
      this.expandedBadges = true;
    },
    resetBadges() {
      this.expandedBadges = false;
    },
  },
});
