import { defineStore } from "pinia";

export const useNavigationStore = defineStore("navigation", {
  state: () => ({
    stack: [],
    previousRoute: null,
    source: "direct",
  }),
  actions: {
    push(route, source = "app") {
      const current = this.stack[this.stack.length - 1];
      if (current !== route) {
        this.previousRoute = current || null;
        this.stack.push(route);
      }
      this.source = source;
    },
    replace(route, source = "replace") {
      if (this.stack.length) this.stack[this.stack.length - 1] = route;
      else this.stack = [route];
      this.source = source;
    },
    syncFromHistory(route, source = "history") {
      const existingIndex = this.stack.lastIndexOf(route);
      if (existingIndex >= 0) {
        this.stack = this.stack.slice(0, existingIndex + 1);
      } else {
        this.replace(route, source);
      }
      this.source = source;
    },
    pop(fallback = "/home") {
      if (this.stack.length > 1) {
        this.stack.pop();
        return this.stack[this.stack.length - 1];
      }
      return fallback;
    },
  },
});
