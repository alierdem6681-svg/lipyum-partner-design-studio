<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppModal from "../components/ui/AppModal.vue";
import AppPage from "../components/ui/AppPage.vue";
import { accountTypeOptions, MAX_ABOUT_LENGTH, useAboutStore } from "../stores/aboutStore.js";

const about = useAboutStore();

const editorOpen = ref(false);
const draftAccountType = ref(about.accountType);
const draftCompanyName = ref(about.companyName);
const draftCompanyAddress = ref(about.companyAddress);
const draftTaxNumber = ref(about.taxNumber);
const draftAbout = ref(about.aboutText);

const remainingCharacters = computed(() => Math.max(0, MAX_ABOUT_LENGTH - draftAbout.value.length));
const isNearLimit = computed(() => remainingCharacters.value <= 50);
const companyRows = computed(() => [
  { icon: "briefcase", label: "Hesap Türü", value: about.accountType, tone: "success" },
  { icon: "home", label: "Firma Adı", value: about.companyName },
  { icon: "map-pin", label: "Adres", value: about.companyAddress, actionable: true },
  { icon: "receipt", label: "Vergi No", value: about.taxNumber },
]);

function syncDrafts() {
  draftAccountType.value = about.accountType;
  draftCompanyName.value = about.companyName;
  draftCompanyAddress.value = about.companyAddress;
  draftTaxNumber.value = about.taxNumber;
  draftAbout.value = about.aboutText;
}

function openEditor() {
  syncDrafts();
  editorOpen.value = true;
}

function closeEditor() {
  editorOpen.value = false;
}

function clampDraft() {
  if (draftAbout.value.length > MAX_ABOUT_LENGTH) {
    draftAbout.value = draftAbout.value.slice(0, MAX_ABOUT_LENGTH);
  }
}

function saveAbout() {
  about.saveProfile({
    accountType: draftAccountType.value,
    companyName: draftCompanyName.value,
    companyAddress: draftCompanyAddress.value,
    taxNumber: draftTaxNumber.value,
    aboutText: draftAbout.value,
  });
  closeEditor();
}

onMounted(() => {
  window.addEventListener("lipyum:about-edit", openEditor);
});

onBeforeUnmount(() => {
  window.removeEventListener("lipyum:about-edit", openEditor);
});
</script>

<template>
  <AppPage title="Hakkımızda" data-testid="route--about">
    <div class="about-page">
      <AppCard padding="lg" class="about-intro-card">
        <div class="about-card-heading">
          <span class="about-card-heading__icon" aria-hidden="true">
            <AppIcon name="user" :size="22" />
          </span>
          <h2>Hakkımızda</h2>
        </div>

        <div class="about-intro-card__text" data-testid="about-intro-text">
          {{ about.aboutText }}
        </div>
      </AppCard>

      <AppCard padding="lg" class="about-company-card">
        <div class="about-card-heading">
          <span class="about-card-heading__icon" aria-hidden="true">
            <AppIcon name="receipt" :size="22" />
          </span>
          <h2>Firma Bilgileri</h2>
        </div>

        <div class="about-company-list" role="list">
          <div v-for="row in companyRows" :key="row.label" class="about-company-row" role="listitem">
            <span class="about-company-row__icon" aria-hidden="true">
              <AppIcon :name="row.icon" :size="21" />
            </span>
            <span class="about-company-row__label">{{ row.label }}</span>
            <strong :class="{ 'is-success': row.tone === 'success' }">{{ row.value }}</strong>
            <AppIcon v-if="row.actionable" name="chevron-right" :size="20" class-name="about-company-row__chevron" />
          </div>
        </div>
      </AppCard>
    </div>

    <AppModal
      :open="editorOpen"
      title="Hakkımızda bilgileri"
      description="Müşteriye görünen tanıtım alanını düzenle."
      close-label="Formu kapat"
      @close="closeEditor"
    >
      <form class="about-editor-form" data-testid="about-editor-form" @submit.prevent="saveAbout">
        <label>
          <span>Çalışma türü</span>
          <select v-model="draftAccountType" data-testid="about-account-type-select">
            <option v-for="option in accountTypeOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </label>

        <label>
          <span>Firma adı</span>
          <input
            v-model="draftCompanyName"
            type="text"
            data-testid="about-company-name-input"
            placeholder="Firma adını yaz"
          />
        </label>

        <label>
          <span>Adres</span>
          <textarea
            v-model="draftCompanyAddress"
            rows="2"
            data-testid="about-company-address-input"
            placeholder="Müşteriye görünen adresi yaz"
          ></textarea>
        </label>

        <label>
          <span>Vergi numarası</span>
          <input
            v-model="draftTaxNumber"
            type="text"
            inputmode="numeric"
            data-testid="about-tax-number-input"
            placeholder="Vergi numarasını yaz"
          />
        </label>

        <label>
          <span>Hakkımızda yazısı</span>
          <textarea
            v-model="draftAbout"
            maxlength="500"
            rows="6"
            data-testid="about-textarea"
            placeholder="Müşteriye kendini kısa ve net şekilde anlat."
            @input="clampDraft"
          ></textarea>
        </label>

        <div class="about-editor-form__meta" :class="{ 'is-near-limit': isNearLimit }" aria-live="polite">
          <span>{{ remainingCharacters }} karakter kaldı</span>
          <span>Maksimum 500 karakter</span>
        </div>

        <div class="about-editor-form__actions">
          <AppButton variant="secondary" full-width @click="closeEditor">Vazgeç</AppButton>
          <AppButton type="submit" icon="check" full-width data-testid="about-save-button">Kaydet</AppButton>
        </div>
      </form>
    </AppModal>
  </AppPage>
</template>

<style scoped>
.about-page {
  display: grid;
  gap: var(--space-4);
  padding-bottom: calc(var(--bottom-safe-height) + var(--space-4));
}

.about-intro-card,
.about-company-card {
  display: grid;
  gap: var(--space-3);
  border-color: color-mix(in srgb, var(--color-border) 86%, transparent);
  box-shadow: var(--shadow-card);
}

.about-card-heading {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.about-card-heading__icon {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 14px;
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
}

.about-card-heading h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-size-card-title);
  font-weight: 950;
  line-height: var(--line-tight);
}

.about-intro-card__text {
  min-height: 116px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: linear-gradient(180deg, var(--color-neutral-50), var(--color-surface));
  color: var(--text-primary);
  font-size: var(--font-size-body);
  font-weight: 520;
  line-height: var(--line-relaxed);
  padding: var(--space-4);
}

.about-company-list {
  display: grid;
}

.about-company-row {
  display: grid;
  grid-template-columns: 24px 72px minmax(0, 1fr) 14px;
  gap: var(--space-2);
  align-items: center;
  min-height: 52px;
  border-top: 1px solid var(--color-border);
  color: var(--text-primary);
}

.about-company-row:first-child {
  border-top: 0;
}

.about-company-row__icon {
  display: grid;
  place-items: center;
  color: var(--text-secondary);
}

.about-company-row__label {
  color: var(--text-secondary);
  font-size: var(--font-size-small);
  font-weight: 680;
}

.about-company-row strong {
  min-width: 0;
  color: var(--text-primary);
  font-size: var(--font-size-small);
  font-weight: 720;
  line-height: var(--line-normal);
  text-align: right;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.about-company-row strong.is-success {
  color: var(--color-primary-dark);
  font-weight: 950;
}

.about-company-row__chevron {
  color: var(--text-muted);
}

.about-editor-form {
  display: grid;
  max-height: min(620px, calc(100vh - 168px));
  gap: 10px;
  overflow-y: auto;
  padding-right: 2px;
}

.about-editor-form label {
  display: grid;
  gap: 6px;
}

.about-editor-form label span,
.about-editor-form__meta {
  color: var(--text-muted);
  font-size: var(--font-size-caption);
  font-weight: 900;
}

.about-editor-form select,
.about-editor-form input,
.about-editor-form textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card-compact);
  background: var(--color-surface);
  color: var(--text-primary);
  font-family: var(--font-family-base);
  font-size: var(--font-size-small);
  font-weight: 750;
  line-height: 1.35;
  padding: 10px 12px;
}

.about-editor-form textarea {
  resize: none;
}

.about-editor-form select:focus,
.about-editor-form input:focus,
.about-editor-form textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
  outline: none;
}

.about-editor-form__meta,
.about-editor-form__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  gap: var(--space-2);
}

.about-editor-form__meta span:last-child {
  text-align: right;
}

.about-editor-form__meta.is-near-limit span:first-child {
  color: var(--color-warning);
}

@media (max-width: 340px) {
  .about-editor-form__actions {
    grid-template-columns: 1fr;
  }

  .about-company-row {
    grid-template-columns: 1fr;
  }

  .about-company-row {
    gap: 6px;
    padding: var(--space-3) 0;
  }

  .about-company-row__icon,
  .about-company-row__chevron {
    display: none;
  }

  .about-company-row strong {
    text-align: left;
  }

  .about-editor-form__meta {
    grid-template-columns: 1fr;
  }

  .about-editor-form__meta span:last-child {
    text-align: left;
  }
}
</style>
