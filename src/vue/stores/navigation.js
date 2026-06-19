import { defineStore } from "pinia";

export const useNavigationStore = defineStore("navigation", {
  state: () => ({
    currentRoute: "/home",
    previousRoute: "",
    lastSafeRoute: "/home",
    source: "router",
  }),
  actions: {
    setRoute(route, previousRoute = "") {
      this.previousRoute = previousRoute;
      this.currentRoute = route || "/home";
      if (route && route !== "/home") this.lastSafeRoute = route;
    },
  },
});
