import { defineStore } from "pinia";

export const useSubscriptionStore = defineStore("subscription", {
  state: () => ({
    activeSubscriptionPlan: null,
  }),
  getters: {
    hasPaidSubscription: (state) => Boolean(state.activeSubscriptionPlan),
  },
  actions: {
    selectPlan(plan) {
      this.activeSubscriptionPlan = plan;
    },
  },
});
