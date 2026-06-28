<script setup>
import { computed, reactive, ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSheet from "../components/ui/AppSheet.vue";
import {
  appointmentServiceTemplates,
  appointmentServices,
  appointmentSummary,
  appointmentTeams,
  assignmentModes,
  slotRules,
  weeklyAvailability,
} from "../data/appointmentMenuData.js";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();

const tabs = [
  { id: "services", label: "Hizmetler", icon: "grid" },
  { id: "calendar", label: "Takvim", icon: "calendar" },
  { id: "teams", label: "Ekipler", icon: "users" },
];

const activeTab = ref("services");
const selectedTemplateId = ref("beauty");
const services = ref([...appointmentServices]);
const teams = ref([...appointmentTeams]);
const isAppointmentOpen = ref(appointmentSummary.isOpen);
const assignmentModeId = ref("auto_assign");
const isServiceSheetOpen = ref(false);
const serviceDraft = reactive({
  name: "Tırnak bakımı",
  category: "beauty",
  duration: "90 dk",
  price: "₺500",
  team: "Ayşe, ekip seçilebilir",
  active: true,
});

const selectedTemplate = computed(
  () => appointmentServiceTemplates.find((template) => template.id === selectedTemplateId.value) || appointmentServiceTemplates[0],
);

const filteredServices = computed(() => services.value.filter((service) => service.category === selectedTemplateId.value));

const stickyAction = computed(() => {
  if (activeTab.value === "calendar") return { label: "Değişiklikleri Kaydet", icon: "check" };
  if (activeTab.value === "teams") return { label: "Ekip Ekle", icon: "user-plus" };
  return { label: "Hizmet Ekle", icon: "plus" };
});

function selectTab(tabId) {
  activeTab.value = tabId;
}

function selectTemplate(templateId) {
  selectedTemplateId.value = templateId;
  serviceDraft.category = templateId;
}

function toggleAppointmentStatus() {
  isAppointmentOpen.value = !isAppointmentOpen.value;
  shell.showToast(isAppointmentOpen.value ? "Randevu akışı açıldı." : "Randevu akışı kapatıldı.");
}

function handleSettings() {
  shell.openSheet({
    title: "Randevu ayarları",
    description: "Slot, ekip ve onay kurallarını yönet.",
    body: "Randevu aralığı, hazırlık süresi ve günlük slot sınırı bu ekrandaki takvim ayarlarına göre çalışır.",
    scoreItems: slotRules.map((rule) => ({
      label: rule.label,
      value: rule.value,
      description: "Mevcut randevu kuralı",
      tone: "positive",
      icon: rule.icon,
    })),
  });
}

function openServiceSheet() {
  serviceDraft.category = selectedTemplateId.value;
  isServiceSheetOpen.value = true;
}

function closeServiceSheet() {
  isServiceSheetOpen.value = false;
}

function saveService() {
  const template = appointmentServiceTemplates.find((item) => item.id === serviceDraft.category) || selectedTemplate.value;
  const nextService = {
    id: `service-${Date.now()}`,
    name: serviceDraft.name.trim() || "Yeni hizmet",
    detail: `${serviceDraft.duration.trim() || "60 dk"} • ${serviceDraft.price.trim() || "₺500"}`,
    team: serviceDraft.team.trim() || "Ekip seçilebilir",
    slots: 1,
    category: template.id,
    icon: template.icon,
    active: serviceDraft.active,
  };
  services.value = [nextService, ...services.value];
  selectedTemplateId.value = template.id;
  activeTab.value = "services";
  closeServiceSheet();
  shell.showToast(`${nextService.name} randevuya açıldı.`);
}

function handleStickyAction() {
  if (activeTab.value === "services") {
    openServiceSheet();
    return;
  }
  if (activeTab.value === "calendar") {
    shell.showToast("Randevu takvimi kaydedildi.");
    return;
  }
  teams.value = [
    ...teams.value,
    {
      id: `team-${Date.now()}`,
      name: `Ekip ${teams.value.length + 1}`,
      services: "Yeni ekip",
      appointments: "Bugün boş",
      availability: "Müsait",
      slots: 0,
    },
  ];
  shell.showToast("Yeni ekip eklendi.");
}

function handleInsightAction() {
  shell.showToast("14:00-17:00 arası indirimli slot önerisi hazırlandı.");
}

function closeToday() {
  shell.showToast("Bugünkü randevu alımı kapatıldı.");
}

function addCustomHour() {
  shell.showToast("Özel saat ekleme akışı açıldı.");
}

function toggleService(service) {
  service.active = !service.active;
  shell.showToast(`${service.name} ${service.active ? "aktif" : "pasif"} yapıldı.`);
}
</script>

<template>
  <AppPage title="Randevu" class="appointment-menu-page" data-testid="calendar-page">
    <section class="appointment-menu" aria-labelledby="appointment-title">
      <div class="appointment-menu__status-row">
        <div>
          <p class="appointment-menu__eyebrow">Randevu durumu</p>
          <h2 id="appointment-title">Hizmetlerini randevuya aç</h2>
        </div>
        <span :class="['appointment-status-pill', isAppointmentOpen ? 'is-open' : 'is-closed']" data-testid="appointment-status-pill">
          <span aria-hidden="true"></span>
          {{ isAppointmentOpen ? "Açık" : "Kapalı" }}
        </span>
      </div>

      <section class="appointment-hero" aria-label="Bugünkü randevu özeti" data-testid="appointment-hero">
        <div class="appointment-hero__top">
          <span class="appointment-hero__icon" aria-hidden="true">
            <AppIcon name="calendar" :size="29" />
          </span>
          <div class="appointment-hero__summary">
            <span>Bugün</span>
            <strong>{{ appointmentSummary.freeHoursToday }} boş saat</strong>
          </div>
        </div>

        <div class="appointment-hero__metrics">
          <article>
            <AppIcon name="clock" :size="22" />
            <strong>{{ appointmentSummary.pendingApprovals }}</strong>
            <span>onay bekliyor</span>
          </article>
          <article>
            <AppIcon name="wallet" :size="22" />
            <strong>{{ appointmentSummary.weeklyRevenue }}</strong>
            <span>hafta</span>
          </article>
          <article>
            <AppIcon name="calendar" :size="22" />
            <strong>{{ appointmentSummary.activeSlots }}</strong>
            <span>aktif slot</span>
          </article>
        </div>

        <div class="appointment-hero__actions">
          <AppButton icon="calendar" size="lg" full-width data-testid="appointment-toggle-button" @click="toggleAppointmentStatus">
            Randevuya Aç
          </AppButton>
          <button class="appointment-icon-button" type="button" aria-label="Randevu ayarları" data-testid="appointment-settings-button" @click="handleSettings">
            <AppIcon name="settings" :size="24" />
          </button>
        </div>
      </section>

      <nav class="appointment-tabs" aria-label="Randevu sekmeleri">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          :class="{ 'is-active': activeTab === tab.id }"
          :aria-selected="activeTab === tab.id ? 'true' : 'false'"
          :data-testid="`appointment-tab-${tab.id}`"
          role="tab"
          @click="selectTab(tab.id)"
        >
          <AppIcon :name="tab.icon" :size="18" />
          <span>{{ tab.label }}</span>
        </button>
      </nav>

      <section v-if="activeTab === 'services'" class="appointment-panel" data-testid="appointment-services-panel">
        <div class="appointment-template-row" aria-label="Hizmet şablonları">
          <button
            v-for="template in appointmentServiceTemplates"
            :key="template.id"
            type="button"
            :class="{ 'is-active': selectedTemplateId === template.id }"
            :aria-pressed="selectedTemplateId === template.id ? 'true' : 'false'"
            :data-testid="`appointment-template-${template.id}`"
            @click="selectTemplate(template.id)"
          >
            {{ template.label }}
          </button>
        </div>

        <div class="appointment-section-head">
          <div>
            <h3>Aktif hizmetler</h3>
            <p>Süre, fiyat ve ekip hazır</p>
          </div>
          <span>{{ filteredServices.length }} hizmet</span>
        </div>

        <div class="appointment-service-list" data-testid="appointment-service-list">
          <article v-for="service in filteredServices" :key="service.id" class="appointment-service-row">
            <span class="appointment-service-row__icon" aria-hidden="true">
              <AppIcon :name="service.icon" :size="22" />
            </span>
            <span class="appointment-service-row__copy">
              <strong>{{ service.name }}</strong>
              <small>{{ service.detail }}</small>
              <em>{{ service.team }}</em>
            </span>
            <button
              type="button"
              :class="['appointment-service-row__status', service.active ? 'is-active' : '']"
              :aria-label="`${service.name} durumunu değiştir`"
              @click="toggleService(service)"
            >
              {{ service.active ? `${service.slots} slot` : "Pasif" }}
            </button>
            <AppIcon name="chevron-right" :size="19" aria-hidden="true" />
          </article>
        </div>

        <article class="appointment-insight-card" data-testid="appointment-insight-card">
          <span aria-hidden="true"><AppIcon name="trend-up" :size="22" /></span>
          <div>
            <strong>{{ appointmentSummary.insight.title }}</strong>
            <p>{{ appointmentSummary.insight.description }}</p>
          </div>
          <button type="button" @click="handleInsightAction">{{ appointmentSummary.insight.actionLabel }}</button>
        </article>
      </section>

      <section v-else-if="activeTab === 'calendar'" class="appointment-panel" data-testid="appointment-calendar-panel">
        <div class="appointment-action-grid">
          <button type="button" @click="closeToday">
            <AppIcon name="pause" :size="19" />
            Bugünü kapat
          </button>
          <button type="button" @click="addCustomHour">
            <AppIcon name="plus" :size="19" />
            Özel saat ekle
          </button>
        </div>

        <div class="appointment-section-head">
          <div>
            <h3>Haftalık uygunluk</h3>
            <p>Randevu alabileceğin günleri belirle</p>
          </div>
        </div>

        <div class="appointment-availability-card">
          <article v-for="day in weeklyAvailability" :key="day.day" class="appointment-availability-row">
            <span>
              <strong>{{ day.day }}</strong>
              <small>{{ day.hours }}</small>
            </span>
            <em :class="{ 'is-closed': day.status === 'Kapalı' }">{{ day.status }}</em>
          </article>
        </div>

        <div class="appointment-section-head">
          <div>
            <h3>Slot kuralları</h3>
            <p>Müşteriye gösterilecek randevu davranışı</p>
          </div>
        </div>

        <div class="appointment-rules-grid">
          <article v-for="rule in slotRules" :key="rule.label">
            <AppIcon :name="rule.icon" :size="19" />
            <span>{{ rule.label }}</span>
            <strong>{{ rule.value }}</strong>
          </article>
        </div>
      </section>

      <section v-else class="appointment-panel" data-testid="appointment-teams-panel">
        <div class="appointment-section-head">
          <div>
            <h3>Ekipler</h3>
            <p>Hangi işi kimin alacağını belirle</p>
          </div>
          <span>{{ teams.length }} ekip</span>
        </div>

        <div class="appointment-team-list">
          <article v-for="team in teams" :key="team.id" class="appointment-team-row">
            <span class="appointment-team-row__icon" aria-hidden="true">
              <AppIcon name="users" :size="23" />
            </span>
            <span class="appointment-team-row__copy">
              <strong>{{ team.name }}</strong>
              <small>{{ team.services }} • {{ team.appointments }}</small>
              <em>{{ team.availability }}</em>
            </span>
            <b>{{ team.slots }} slot</b>
          </article>
        </div>

        <div class="appointment-section-head">
          <div>
            <h3>Atama modu</h3>
            <p>Müşteriye gösterilecek seçim davranışı</p>
          </div>
        </div>

        <div class="appointment-assignment-list" role="radiogroup" aria-label="Ekip atama modu">
          <button
            v-for="mode in assignmentModes"
            :key="mode.id"
            type="button"
            :class="{ 'is-selected': assignmentModeId === mode.id }"
            :aria-checked="assignmentModeId === mode.id ? 'true' : 'false'"
            role="radio"
            @click="assignmentModeId = mode.id"
          >
            <span>
              <strong>{{ mode.label }}</strong>
              <small>{{ mode.description }}</small>
            </span>
            <AppIcon v-if="assignmentModeId === mode.id" name="check" :size="18" />
          </button>
        </div>
      </section>

      <div class="appointment-sticky-action" data-testid="appointment-sticky-action">
        <AppButton :icon="stickyAction.icon" size="lg" full-width @click="handleStickyAction">
          {{ stickyAction.label }}
        </AppButton>
      </div>
    </section>

    <AppSheet :open="isServiceSheetOpen" title="Hizmet ekle" description="Süre, fiyat ve ekip bilgilerini gir" @close="closeServiceSheet">
      <form class="appointment-service-sheet" data-testid="appointment-service-sheet" @submit.prevent="saveService">
        <label>
          <span>Hizmet adı</span>
          <input v-model="serviceDraft.name" type="text" autocomplete="off" data-testid="appointment-service-name" />
        </label>
        <label>
          <span>Kategori</span>
          <select v-model="serviceDraft.category" data-testid="appointment-service-category">
            <option v-for="template in appointmentServiceTemplates" :key="template.id" :value="template.id">
              {{ template.label }}
            </option>
          </select>
        </label>
        <div class="appointment-service-sheet__grid">
          <label>
            <span>Süre</span>
            <input v-model="serviceDraft.duration" type="text" inputmode="numeric" data-testid="appointment-service-duration" />
          </label>
          <label>
            <span>Fiyat</span>
            <input v-model="serviceDraft.price" type="text" inputmode="numeric" data-testid="appointment-service-price" />
          </label>
        </div>
        <label>
          <span>Ekip</span>
          <input v-model="serviceDraft.team" type="text" data-testid="appointment-service-team" />
        </label>
        <button
          class="appointment-service-sheet__toggle"
          type="button"
          :aria-pressed="serviceDraft.active ? 'true' : 'false'"
          @click="serviceDraft.active = !serviceDraft.active"
        >
          <span>
            <strong>Randevuya açık</strong>
            <small>Müşteriler bu hizmet için saat seçebilir.</small>
          </span>
          <em :class="{ 'is-on': serviceDraft.active }"></em>
        </button>
        <AppButton type="submit" size="lg" full-width data-testid="appointment-save-service">Hizmeti Kaydet</AppButton>
      </form>
    </AppSheet>
  </AppPage>
</template>
