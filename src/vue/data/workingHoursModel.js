export const workingHourPresets = [
  {
    id: "weekdays",
    label: "Hafta içi",
    description: "Pazartesi - Cuma",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  },
  {
    id: "daily",
    label: "Her gün",
    description: "7 gün açık",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
  },
  {
    id: "weekend",
    label: "Hafta sonu",
    description: "Cumartesi - Pazar",
    days: ["saturday", "sunday"],
  },
  {
    id: "custom",
    label: "Özel",
    description: "Günleri sen seç",
    days: [],
  },
];

export const workingWeekDays = [
  { id: "monday", label: "Pazartesi" },
  { id: "tuesday", label: "Salı" },
  { id: "wednesday", label: "Çarşamba" },
  { id: "thursday", label: "Perşembe" },
  { id: "friday", label: "Cuma" },
  { id: "saturday", label: "Cumartesi" },
  { id: "sunday", label: "Pazar" },
];

export function createDefaultWorkingHoursState() {
  return {
    activePreset: "weekdays",
    startTime: "09:00",
    endTime: "18:00",
    openDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  };
}

export function formatOpenDaysCount(openDays) {
  const count = Array.isArray(openDays) ? openDays.length : 0;
  return `${count} gün açık`;
}

export function isWorkingDayOpen(openDays, dayId) {
  return Array.isArray(openDays) && openDays.includes(dayId);
}

export function formatWorkingRange(startTime, endTime) {
  return `${startTime} - ${endTime}`;
}
