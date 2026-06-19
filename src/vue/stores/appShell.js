import { defineStore } from "pinia";

let toastTimer = 0;

export const useAppShellStore = defineStore("appShell", {
  state: () => ({
    drawerOpen: false,
    activeSheet: "",
    activeModal: "",
    toast: null,
    notificationCount: 3,
    ctaVariant: "home",
    profileBadgesExpanded: false,
  }),
  actions: {
    openDrawer() {
      this.drawerOpen = true;
    },
    closeDrawer() {
      this.drawerOpen = false;
    },
    openSheet(name) {
      this.activeSheet = name;
    },
    closeSheet() {
      this.activeSheet = "";
    },
    openModal(name) {
      this.activeModal = name;
    },
    closeModal() {
      this.activeModal = "";
    },
    closeTransientOverlays() {
      this.drawerOpen = false;
      this.activeSheet = "";
      this.activeModal = "";
    },
    showToast(message, tone = "success") {
      window.clearTimeout(toastTimer);
      this.toast = { message, tone };
      toastTimer = window.setTimeout(() => {
        this.toast = null;
      }, 2400);
    },
    clearToast() {
      window.clearTimeout(toastTimer);
      this.toast = null;
    },
    resetRouteLocalState(key) {
      if (key === "profileBadgesExpanded") this.profileBadgesExpanded = false;
    },
  },
});
