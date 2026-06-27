<script setup>
import { computed, ref } from "vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();
const assetBase = `${import.meta.env.BASE_URL}assets/lipyum-regions/`;

const quickFilters = [
  { id: "global", label: "Global", icon: "globe" },
  { id: "turkey", label: "Türkiye", icon: "map-pin" },
  { id: "city", label: "Kendi Şehrim", icon: "map-pin" },
  { id: "selected", label: "Seçilen Bölgeler", icon: "check" },
];

const regions = [
  { id: "mersin", title: "Mersin", subtitle: "Tüm şehir", icon: "icon-region-map.svg", scope: "city" },
  { id: "yenisehir", title: "Yenişehir", subtitle: "Merkez ilçe", icon: "icon-building.svg", scope: "city" },
  { id: "mezitli", title: "Mezitli", subtitle: "Merkez ilçe", icon: "icon-waves.svg", scope: "city" },
  { id: "toroslar", title: "Toroslar", subtitle: "Merkez ilçe", icon: "icon-mountain.svg", scope: "city" },
  { id: "akdeniz", title: "Akdeniz", subtitle: "Merkez ilçe", icon: "icon-lighthouse.svg", scope: "city" },
  { id: "tarsus", title: "Tarsus", subtitle: "İlçe", icon: "icon-route.svg", scope: "city" },
  { id: "erdemli", title: "Erdemli", subtitle: "İlçe", icon: "icon-tree.svg", scope: "city" },
  { id: "silifke", title: "Silifke", subtitle: "Sahil ilçesi", icon: "icon-waves.svg", scope: "city" },
  { id: "anamur", title: "Anamur", subtitle: "Sahil ilçesi", icon: "icon-lighthouse.svg", scope: "city" },
  { id: "mut", title: "Mut", subtitle: "İlçe", icon: "icon-mountain.svg", scope: "city" },
  { id: "bozyazi", title: "Bozyazı", subtitle: "Sahil ilçesi", icon: "icon-tree.svg", scope: "city" },
  { id: "gulnar", title: "Gülnar", subtitle: "İlçe", icon: "icon-route.svg", scope: "city" },
];

const searchQuery = ref("");
const activeQuickFilter = ref("city");
const selectedRegionIds = ref(["mersin", "yenisehir", "mezitli", "silifke", "anamur", "mut", "bozyazi", "gulnar"]);
const saveState = ref("idle");

const selectedCount = computed(() => selectedRegionIds.value.length);
const normalizedQuery = computed(() => searchQuery.value.trim().toLocaleLowerCase("tr-TR"));

const filteredRegions = computed(() => {
  return regions.filter((region) => {
    if (activeQuickFilter.value === "selected" && !selectedRegionIds.value.includes(region.id)) {
      return false;
    }

    if (!normalizedQuery.value) {
      return true;
    }

    return `${region.title} ${region.subtitle}`.toLocaleLowerCase("tr-TR").includes(normalizedQuery.value);
  });
});

function iconPath(fileName) {
  return `${assetBase}${fileName}`;
}

function isSelected(regionId) {
  return selectedRegionIds.value.includes(regionId);
}

function setQuickFilter(filterId) {
  activeQuickFilter.value = filterId;
}

function toggleRegion(regionId) {
  if (isSelected(regionId)) {
    selectedRegionIds.value = selectedRegionIds.value.filter((id) => id !== regionId);
    return;
  }

  selectedRegionIds.value = [...selectedRegionIds.value, regionId];
}

function saveRegions() {
  saveState.value = "saved";
  shell.showToast(`${selectedCount.value} bölge kaydedildi.`);
  window.setTimeout(() => {
    saveState.value = "idle";
  }, 1800);
}
</script>

<template>
  <AppPage title="Bölgelerim" data-testid="regions-page">
    <div class="profile-regions">
      <label class="profile-regions__search" data-testid="regions-search">
        <AppIcon name="search" :size="21" class-name="profile-regions__search-icon" />
        <input
          v-model="searchQuery"
          type="search"
          autocomplete="off"
          placeholder="İl, ilçe veya mahalle ara"
          aria-label="Bölge ara"
          data-testid="regions-search-input"
        />
      </label>

      <section class="profile-regions__quick" aria-labelledby="regions-quick-title">
        <h2 id="regions-quick-title">Hızlı Seçiciler</h2>
        <div class="profile-regions__chips" data-testid="regions-quick-filters">
          <button
            v-for="filter in quickFilters"
            :key="filter.id"
            class="profile-regions__chip"
            type="button"
            :aria-pressed="activeQuickFilter === filter.id"
            @click="setQuickFilter(filter.id)"
          >
            <AppIcon :name="filter.icon" :size="15" />
            <span>{{ filter.label }}</span>
          </button>
        </div>
      </section>

      <section class="profile-regions__status" aria-label="Bölge durumu">
        <span class="profile-regions__status-icon" aria-hidden="true">
          <img :src="iconPath('icon-region-map.svg')" alt="" />
        </span>
        <div>
          <strong>Mersin içinde iş alıyorsun</strong>
          <p>{{ selectedCount }} bölge seçili · İstediğin zaman değiştirebilirsin</p>
        </div>
      </section>

      <section class="profile-regions__section" aria-labelledby="regions-list-title">
        <div class="profile-regions__section-head">
          <h2 id="regions-list-title">Bölgeler</h2>
          <span>{{ selectedCount }} seçili</span>
        </div>

        <div class="profile-regions__list" role="list" data-testid="regions-list">
          <button
            v-for="region in filteredRegions"
            :key="region.id"
            class="profile-regions__row"
            type="button"
            role="checkbox"
            :aria-checked="isSelected(region.id)"
            :data-testid="`region-row-${region.id}`"
            @click="toggleRegion(region.id)"
          >
            <span class="profile-regions__row-icon" aria-hidden="true">
              <img :src="iconPath(region.icon)" alt="" />
            </span>
            <span class="profile-regions__row-copy">
              <strong>{{ region.title }}</strong>
              <small>{{ region.subtitle }}</small>
            </span>
            <span class="profile-regions__check" aria-hidden="true">
              <AppIcon v-if="isSelected(region.id)" name="check" :size="15" />
            </span>
          </button>

          <p v-if="!filteredRegions.length" class="profile-regions__empty" role="status">
            Aramana uygun bölge bulunamadı.
          </p>
        </div>
      </section>

      <div class="profile-regions__save-bar">
        <button
          class="profile-regions__save-button"
          type="button"
          data-testid="regions-save-button"
          @click="saveRegions"
        >
          <span aria-hidden="true">
            <img :src="iconPath('icon-save.svg')" alt="" />
          </span>
          <strong>{{ saveState === "saved" ? "Seçimler Kaydedildi" : "Seçimleri Kaydet" }}</strong>
        </button>
      </div>
    </div>
  </AppPage>
</template>

<style scoped>
.profile-regions {
  display: grid;
  gap: var(--space-4);
  padding-bottom: calc(78px + env(safe-area-inset-bottom, 0px));
}

.profile-regions__search {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 50px;
  border: 1px solid color-mix(in srgb, var(--color-border) 88%, transparent);
  border-radius: var(--radius-card-compact);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
  color: var(--text-muted);
  padding: 0 13px;
}

.profile-regions__search:focus-within {
  border-color: color-mix(in srgb, var(--color-primary-dark) 42%, var(--color-border));
  box-shadow: 0 0 0 3px var(--color-primary-soft), var(--shadow-card);
}

.profile-regions__search input {
  min-width: 0;
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-family-base);
  font-size: var(--font-size-small);
  font-weight: 760;
}

.profile-regions__search input::placeholder {
  color: var(--text-muted);
  font-weight: 720;
}

.profile-regions__quick,
.profile-regions__section {
  display: grid;
  gap: 10px;
}

.profile-regions__quick h2,
.profile-regions__section-head h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-size-small);
  font-weight: 950;
  line-height: var(--line-tight);
}

.profile-regions__chips {
  display: flex;
  gap: 6px;
  overflow: visible;
  padding-bottom: 2px;
  scrollbar-width: none;
}

.profile-regions__chips::-webkit-scrollbar {
  display: none;
}

.profile-regions__chip {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 38px;
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card-compact);
  background: var(--color-surface);
  color: var(--text-primary);
  font-family: var(--font-family-base);
  font-size: 10px;
  font-weight: 850;
  padding: 0 7px;
  white-space: nowrap;
}

.profile-regions__chip .v-icon {
  width: 13px;
  height: 13px;
}

.profile-regions__chip[aria-pressed="true"] {
  border-color: color-mix(in srgb, var(--color-primary-dark) 44%, var(--color-border));
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  box-shadow: 0 9px 18px rgba(7, 148, 85, 0.08);
}

.profile-regions__status {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  min-height: 76px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 26%, var(--color-border));
  border-radius: var(--radius-card);
  background:
    radial-gradient(circle at 90% 12%, color-mix(in srgb, var(--color-primary-soft) 70%, transparent), transparent 42%),
    var(--color-surface);
  box-shadow: var(--shadow-card);
  padding: 12px;
}

.profile-regions__status-icon,
.profile-regions__row-icon {
  display: grid;
  place-items: center;
  border-radius: 15px;
  background: var(--color-primary-soft);
}

.profile-regions__status-icon {
  width: 42px;
  height: 42px;
}

.profile-regions__status-icon img {
  width: 23px;
  height: 23px;
}

.profile-regions__status strong,
.profile-regions__row strong {
  color: var(--text-primary);
  font-size: var(--font-size-body);
  font-weight: 950;
  line-height: var(--line-tight);
}

.profile-regions__status p {
  margin: 4px 0 0;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 760;
  line-height: var(--line-normal);
}

.profile-regions__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-inline: 2px;
}

.profile-regions__section-head span {
  color: var(--color-primary-dark);
  font-size: var(--font-size-caption);
  font-weight: 950;
}

.profile-regions__list {
  display: grid;
  gap: 10px;
}

.profile-regions__row {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 28px;
  align-items: center;
  gap: 10px;
  min-height: 68px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card-compact);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
  color: var(--text-primary);
  font-family: var(--font-family-base);
  padding: 10px;
  text-align: left;
}

.profile-regions__row[aria-checked="true"] {
  border-color: color-mix(in srgb, var(--color-primary-dark) 50%, var(--color-border));
  background: color-mix(in srgb, var(--color-primary-soft) 66%, var(--color-surface));
  box-shadow: 0 11px 22px rgba(7, 148, 85, 0.08);
}

.profile-regions__row:focus-visible,
.profile-regions__chip:focus-visible,
.profile-regions__save-button:focus-visible {
  outline: 3px solid var(--color-primary-soft);
  outline-offset: 2px;
}

.profile-regions__row-icon {
  width: 42px;
  height: 42px;
}

.profile-regions__row-icon img {
  width: 22px;
  height: 22px;
}

.profile-regions__row-copy {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.profile-regions__row small {
  color: var(--text-muted);
  font-size: var(--font-size-caption);
  font-weight: 800;
  line-height: var(--line-tight);
}

.profile-regions__check {
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-surface);
  background: var(--color-surface);
}

.profile-regions__row[aria-checked="true"] .profile-regions__check {
  border-color: var(--color-primary-dark);
  background: var(--color-primary-dark);
}

.profile-regions__empty {
  margin: 0;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-card-compact);
  background: var(--color-surface);
  color: var(--text-muted);
  font-size: var(--font-size-small);
  font-weight: 760;
  padding: 14px;
  text-align: center;
}

.profile-regions__save-bar {
  position: sticky;
  z-index: 6;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 10px);
  margin-top: var(--space-1);
  padding-top: 18px;
  background: linear-gradient(180deg, rgba(245, 247, 251, 0), var(--color-app-bg) 42%);
}

.profile-regions__save-button {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: center;
  justify-items: center;
  gap: 8px;
  width: 100%;
  min-height: 54px;
  border: 0;
  border-radius: 18px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  box-shadow: 0 18px 34px rgba(7, 148, 85, 0.2);
  color: var(--color-surface);
  font-family: var(--font-family-base);
  padding: 0 16px;
}

.profile-regions__save-button span {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.18);
}

.profile-regions__save-button img {
  width: 17px;
  height: 17px;
}

.profile-regions__save-button strong {
  font-size: var(--font-size-body);
  font-weight: 950;
  line-height: var(--line-tight);
}

@media (max-width: 340px) {
  .profile-regions {
    gap: 12px;
  }

  .profile-regions__chip {
    min-width: auto;
    padding-inline: 6px;
    font-size: 9px;
  }

  .profile-regions__row {
    grid-template-columns: 40px minmax(0, 1fr) 26px;
    gap: 8px;
    min-height: 64px;
    padding: 9px;
  }

  .profile-regions__row-icon {
    width: 38px;
    height: 38px;
  }
}
</style>
