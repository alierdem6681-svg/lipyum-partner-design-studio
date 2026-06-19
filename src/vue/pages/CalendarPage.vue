<script setup>
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppEmptyState from "../components/ui/AppEmptyState.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShell.js";
import { useCalendarStore } from "../stores/calendar.js";

const calendar = useCalendarStore();
const appShell = useAppShellStore();

function openAppointment(appointment) {
  calendar.selectAppointment(appointment);
  appShell.openSheet("appointment-detail");
}
</script>

<template>
  <AppPage title="Takvim">
    <div class="v-stack" data-testid="calendar-page">
      <section class="-mx-1 flex gap-2 overflow-x-auto px-1 py-1" aria-label="Gün seçimi">
        <button
          v-for="day in calendar.days"
          :key="day"
          type="button"
          class="h-10 shrink-0 rounded-pill border px-4 text-caption font-extrabold"
          :class="calendar.selectedDate === day ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'"
          @click="calendar.selectedDate = day"
        >
          {{ day }}
        </button>
      </section>

      <AppCard padding="md" variant="hero">
        <strong class="block truncate text-section-title font-extrabold text-slate-950">{{ calendar.selectedDate }} randevuları</strong>
        <small class="mt-1 block truncate text-small font-bold text-slate-500">Planını buradan takip et.</small>
      </AppCard>

      <AppCard
        v-for="appointment in calendar.dayAppointments"
        :key="appointment.id"
        as="article"
        padding="md"
        data-testid="appointment-card"
      >
        <div class="grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><AppIcon name="calendar" /></span>
          <span class="min-w-0">
            <strong class="block truncate text-card-title font-extrabold text-slate-950">{{ appointment.title }}</strong>
            <small class="block truncate text-caption font-bold text-slate-500">{{ appointment.customer }} · {{ appointment.area }}</small>
          </span>
          <strong class="text-small font-extrabold text-slate-700">{{ appointment.time }}</strong>
        </div>
        <AppButton class="mt-3" full-width size="sm" variant="ghost" @click="openAppointment(appointment)">Detayı Gör</AppButton>
      </AppCard>

      <AppEmptyState v-if="!calendar.dayAppointments.length" icon="calendar" title="Randevu yok" description="Bu gün için planlanmış randevu bulunmuyor." />
    </div>
  </AppPage>
</template>
