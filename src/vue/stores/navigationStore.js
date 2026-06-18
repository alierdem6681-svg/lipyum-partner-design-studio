import { defineStore } from "pinia";

export const useNavigationStore = defineStore("navigation", {
  state: () => ({
    stack: ["/home"],
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
      this.stack[this.stack.length - 1] = route;
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
