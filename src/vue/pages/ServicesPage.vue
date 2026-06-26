<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();
const searchQuery = ref("");
const searchInput = ref(null);
const selectedServices = ref([
  "Bulaşık Makinesi Tamiri",
  "Buzdolabı Tamiri",
  "Çamaşır Makinesi Tamiri",
  "Kurutma Makinesi Tamiri",
]);

const services = [
  "Kombi Tamiri",
  "Fırın Tamiri",
  "Klima Tamiri",
  "Klima Montajı",
  "Petek Temizleme",
  "Televizyon Tamiri",
  "Derin Dondurucu Tamiri",
  "Klima Bakımı",
  "Çilingir",
  "Su Tesisatçısı",
  "Elektrikçi",
  "İlaçlama",
  "Oto Elektrikçi",
  "Oto Kurtarma",
  "Oto Lastikçi",
  "Tıkanıklık Açma",
  "Su Kaçağı Tespiti",
  "Baca Temizleme",
  "Temizlik",
  "Halı Yıkama",
  "Uydu Servisi",
  "Hurda Alımı",
  "Bilgisayar Tamircisi",
  "Camcı",
  "Fayans Ustası",
  "Marangoz",
  "Sıvacı",
  "Şehir İçi Nakliye",
  "Şehirler Arası Nakliye",
  "Çatı Tamiri & Onarım",
  "Çatı Kaplama & Yalıtım Sistemleri",
  "Çatı Oluk, Dere, Yağmur Suyu Sistemleri",
  "Özel Gün & İnsan Odaklı Çekimler",
  "Ticari & İşletme Fotoğrafçılığı",
];

const normalizedQuery = computed(() => searchQuery.value.trim().toLocaleLowerCase("tr-TR"));
const availableServices = computed(() =>
  services.filter((service) => {
    const notSelected = !selectedServices.value.includes(service);
    if (!normalizedQuery.value) return notSelected;
    return notSelected && service.toLocaleLowerCase("tr-TR").includes(normalizedQuery.value);
  }),
);

function focusSearch() {
  searchInput.value?.focus();
  shell.showToast("Hizmetlerini arayıp seçebilirsin.");
}

function addService(service) {
  if (selectedServices.value.includes(service)) return;
  selectedServices.value = [...selectedServices.value, service];
  shell.showToast(`${service} seçili hizmetlerine eklendi.`);
}

function removeService(service) {
  selectedServices.value = selectedServices.value.filter((item) => item !== service);
  shell.showToast(`${service} seçili hizmetlerinden kaldırıldı.`);
}

onMounted(() => {
  window.addEventListener("lipyum:services-edit", focusSearch);
});

onBeforeUnmount(() => {
  window.removeEventListener("lipyum:services-edit", focusSearch);
});
</script>

<template>
  <AppPage title="Hizmetlerim" data-testid="services-page">
    <div class="services-page">
      <label class="services-search" data-testid="services-search">
        <AppIcon name="search" :size="28" class-name="services-search__icon" />
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="search"
          autocomplete="off"
          placeholder="Hizmet ara..."
          data-testid="services-search-input"
          aria-label="Hizmet ara"
        />
      </label>

      <section class="services-section" aria-labelledby="selected-services-title">
        <h2 id="selected-services-title">Seçili Hizmetlerim ({{ selectedServices.length }})</h2>
        <div class="services-selected-grid" data-testid="selected-services">
          <button
            v-for="service in selectedServices"
            :key="service"
            class="services-selected-chip"
            type="button"
            data-testid="selected-service-chip"
            :aria-label="`${service} hizmetini kaldır`"
            @click="removeService(service)"
          >
            <span class="services-selected-chip__icon" aria-hidden="true">
              <AppIcon name="check" :size="18" />
            </span>
            <span>{{ service }}</span>
          </button>
        </div>
      </section>

      <section class="services-section services-section--all" aria-labelledby="all-services-title">
        <h2 id="all-services-title">Tüm Hizmetler</h2>
        <div v-if="availableServices.length" class="services-chip-cloud" data-testid="all-services">
          <button
            v-for="service in availableServices"
            :key="service"
            class="services-add-chip"
            type="button"
            data-testid="service-add-chip"
            :aria-label="`${service} hizmetini ekle`"
            @click="addService(service)"
          >
            <AppIcon name="plus" :size="20" class-name="services-add-chip__icon" />
            <span>{{ service }}</span>
          </button>
        </div>
        <p v-else class="services-empty" data-testid="services-empty">Aramana uygun yeni hizmet bulunamadı.</p>
      </section>

      <AppCard padding="lg" class="services-info-card" data-testid="services-info-card">
        <span class="services-info-card__icon" aria-hidden="true">
          <AppIcon name="info" :size="22" />
        </span>
        <div>
          <h2>Hizmetlerinizi seçin</h2>
          <p>Müşteriler size uygun işleri daha kolay bulabilir. Dilediğiniz zaman güncelleyebilirsiniz.</p>
        </div>
      </AppCard>
    </div>
  </AppPage>
</template>

<style scoped>
.services-page {
  display: grid;
  gap: var(--space-5);
  padding-bottom: calc(var(--bottom-safe-height) + var(--space-5));
}

.services-search {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: 64px;
  border: 1px solid color-mix(in srgb, var(--color-border) 82%, transparent);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
  color: var(--text-muted);
  padding: 0 var(--space-4);
}

.services-search:focus-within {
  border-color: color-mix(in srgb, var(--color-primary-dark) 42%, var(--color-border));
  box-shadow: 0 0 0 3px var(--color-primary-soft), var(--shadow-card);
}

.services-search input {
  min-width: 0;
  width: 100%;
  border: 0;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-family-base);
  font-size: var(--font-size-card-title);
  font-weight: 650;
  outline: 0;
}

.services-search input::placeholder {
  color: var(--text-muted);
  font-weight: 620;
}

.services-section {
  display: grid;
  gap: var(--space-3);
}

.services-section h2,
.services-info-card h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-size-card-title);
  font-weight: 900;
  line-height: var(--line-tight);
}

.services-section--all {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-5);
}

.services-selected-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}

.services-selected-chip,
.services-add-chip {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  min-height: 48px;
  border-radius: var(--radius-card-compact);
  font-family: var(--font-family-base);
  line-height: var(--line-tight);
  white-space: normal;
}

.services-selected-chip {
  justify-content: flex-start;
  gap: var(--space-2);
  border: 1px solid var(--color-primary);
  background: linear-gradient(180deg, var(--color-primary-soft), var(--color-surface));
  color: var(--color-primary-dark);
  font-size: var(--font-size-small);
  font-weight: 850;
  padding: 0 var(--space-3);
  text-align: left;
}

.services-selected-chip > span:last-child,
.services-add-chip > span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.services-selected-chip__icon {
  display: grid;
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 999px;
  background: var(--color-primary-dark);
  color: var(--color-surface);
}

.services-chip-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.services-add-chip {
  gap: var(--space-2);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--text-primary);
  box-shadow: 0 1px 0 color-mix(in srgb, var(--color-border) 45%, transparent);
  font-size: var(--font-size-body);
  font-weight: 720;
  padding: 0 var(--space-3);
}

.services-add-chip__icon {
  color: var(--text-muted);
}

.services-selected-chip:hover,
.services-add-chip:hover {
  transform: translateY(-1px);
}

.services-selected-chip:focus-visible,
.services-add-chip:focus-visible {
  outline: 3px solid var(--color-primary-soft);
  outline-offset: 2px;
}

.services-empty {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-small);
  font-weight: 680;
}

.services-info-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: var(--space-3);
  border-color: color-mix(in srgb, var(--color-border) 80%, transparent);
  box-shadow: var(--shadow-card);
}

.services-info-card__icon {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 16px;
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
}

.services-info-card p {
  margin: var(--space-1) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-body);
  font-weight: 620;
  line-height: var(--line-relaxed);
}

@media (max-width: 360px) {
  .services-selected-grid {
    grid-template-columns: 1fr;
  }

  .services-search {
    min-height: 58px;
  }

  .services-search input,
  .services-selected-chip,
  .services-add-chip {
    font-size: var(--font-size-small);
  }
}
</style>
