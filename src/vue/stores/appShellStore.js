import { defineStore } from "pinia";

export const useAppShellStore = defineStore("appShell", {
  state: () => ({
    drawerOpen: false,
    activeSheet: null,
    activeModal: null,
    toast: null,
    notificationCount: 3,
    ctaVariant: "subpage",
  }),
  actions: {
    openDrawer() {
      this.drawerOpen = true;
    },
    closeDrawer() {
      this.drawerOpen = false;
    },
    openSheet(sheet) {
      this.activeSheet = sheet;
    },
    closeSheet() {
      this.activeSheet = null;
    },
    showToast(message) {
      this.toast = message;
      window.clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => {
        this.toast = null;
      }, 2200);
    },
  },
});
