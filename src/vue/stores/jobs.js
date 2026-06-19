import { defineStore } from "pinia";

const availableJobs = [
  { id: "j1", type: "ready", title: "Klima arızası", area: "Karşıyaka", price: "260 kredi", status: "Hazır iş", primary: "Müşteriyi Ara" },
  { id: "j2", type: "pool", title: "Buzdolabı soğutmuyor", area: "Bornova", price: "180 kredi", status: "Havuz", primary: "Havuzdan Al" },
  { id: "j3", type: "offer", title: "Kombi bakım teklifi", area: "Kadıköy", price: "Teklif", status: "Teklif", primary: "Teklif Ver" },
  { id: "j4", type: "direct", title: "Çamaşır makinesi", area: "Esenyurt", price: "320 kredi", status: "Direkt", primary: "İşi Al" },
];

const myJobs = [
  { id: "m1", type: "new", title: "Yeni klima talebi", area: "Karşıyaka", status: "Yeni İşler", primary: "Ara" },
  { id: "m2", type: "active", title: "Kombi servis randevusu", area: "Üsküdar", status: "Aktif", primary: "Durum Güncelle" },
  { id: "m3", type: "offers", title: "Buzdolabı fiyat teklifi", area: "Bornova", status: "Tekliflerim", primary: "Teklifi Gör" },
  { id: "m4", type: "completed", title: "Fırın tamiri", area: "Ataşehir", status: "Tamamlananlar", primary: "Fiş Oluştur" },
  { id: "m5", type: "problem", title: "Müşteri dönüş bekliyor", area: "Beşiktaş", status: "Sorunlu", primary: "Destek Aç" },
];

export const useJobsStore = defineStore("jobs", {
  state: () => ({
    availableJobs,
    myJobs,
    jobsFilter: "all",
    myJobsFilter: "new",
    selectedJob: null,
  }),
  getters: {
    filteredAvailableJobs(state) {
      if (state.jobsFilter === "all") return state.availableJobs;
      return state.availableJobs.filter((job) => job.type === state.jobsFilter);
    },
    filteredMyJobs(state) {
      return state.myJobs.filter((job) => job.type === state.myJobsFilter);
    },
  },
  actions: {
    selectJob(job) {
      this.selectedJob = job;
    },
    clearSelectedJob() {
      this.selectedJob = null;
    },
  },
});
