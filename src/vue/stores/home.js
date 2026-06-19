import { defineStore } from "pinia";
import { walletSummary } from "../../data/mockData.js";

export const useHomeStore = defineStore("home", {
  state: () => ({
    performance: {
      score: 81,
      level: "İyi",
      nextTarget: 85,
      progress: 72,
    },
    wallet: walletSummary,
    opportunities: [
      { title: "Hazır müşteri", description: "Karşıyaka klima arızası için müşteri hazır.", route: "/jobs" },
      { title: "Havuz hareketli", description: "Bölgende 4 yeni havuz işi var.", route: "/jobs" },
      { title: "Paket avantajı", description: "Plus ile daha fazla görünürlük al.", route: "/packages" },
    ],
    activityItems: [
      "Son 10 dk içinde 3 partner iş fırsatı görüntüledi.",
      "Bölgende klima arızası talepleri yükseldi.",
      "Bugün 2 teklif dönüşü bekliyor.",
    ],
    activeActivityIndex: 0,
  }),
  getters: {
    activeActivity(state) {
      return state.activityItems[state.activeActivityIndex] || state.activityItems[0];
    },
  },
  actions: {
    nextActivity() {
      this.activeActivityIndex = (this.activeActivityIndex + 1) % this.activityItems.length;
    },
  },
});
