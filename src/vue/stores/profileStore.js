import { defineStore } from "pinia";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    expandedBadges: false,
    partner: {
      name: "Ahmet Kaya",
      initials: "AK",
      title: "Gold Partner",
      specialty: "Klima ve beyaz eşya servisi",
      rating: "4.8",
      reviewCount: "126",
      score: 81,
      badges: [
        "Gold Partner",
        "Hızlı Yanıt",
        "4.8 Puan",
        "126 Değerlendirme",
        "Sonuç Bildiren",
        "Randevu Düzenli",
      ],
    },
  }),
  getters: {
    visibleBadges: (state) => state.expandedBadges ? state.partner.badges : state.partner.badges.slice(0, 4),
    hiddenBadgeCount: (state) => state.expandedBadges ? 0 : Math.max(0, state.partner.badges.length - 4),
  },
  actions: {
    showAllBadges() {
      this.expandedBadges = true;
    },
    resetBadges() {
      this.expandedBadges = false;
    },
  },
});
