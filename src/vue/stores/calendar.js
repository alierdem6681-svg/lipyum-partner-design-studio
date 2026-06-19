import { defineStore } from "pinia";

const appointments = [
  { id: "a1", date: "Bugün", time: "10:30", title: "Klima bakım randevusu", customer: "Elif Y.", area: "Karşıyaka" },
  { id: "a2", date: "Bugün", time: "14:00", title: "Kombi kontrolü", customer: "Murat K.", area: "Üsküdar" },
  { id: "a3", date: "Yarın", time: "11:00", title: "Buzdolabı arıza tespiti", customer: "Selin A.", area: "Bornova" },
];

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    selectedDate: "Bugün",
    selectedAppointment: null,
    appointments,
    days: ["Bugün", "Yarın", "Cmt", "Paz", "Pzt"],
  }),
  getters: {
    dayAppointments(state) {
      return state.appointments.filter((appointment) => appointment.date === state.selectedDate);
    },
  },
  actions: {
    selectAppointment(appointment) {
      this.selectedAppointment = appointment;
    },
    clearSelectedAppointment() {
      this.selectedAppointment = null;
    },
  },
});
