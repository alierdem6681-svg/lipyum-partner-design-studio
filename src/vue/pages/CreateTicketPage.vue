<script setup>
import { computed, nextTick, ref } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const router = useRouter();
const submitted = ref(false);
const description = ref("");
const descriptionFocused = ref(false);
const category = ref("Sistem ile ilgili konular");
const priority = ref("Normal");
const imageFiles = ref([]);
const documentFiles = ref([]);
const descriptionRef = ref(null);
const imageInputRef = ref(null);
const fileInputRef = ref(null);
const maxDescriptionLength = 500;
const descriptionPlaceholder = "Profilime daha fazla bölge eklemek için yardım istiyorum.";
const ticketCategories = [
  "Sistem ile ilgili konular",
  "Şikayet bildirmek istiyorum",
  "Bir istekte bulunacağım",
  "Diğer",
];
const priorityOptions = [
  { label: "Düşük", value: "Düşük" },
  { label: "Normal", value: "Normal" },
  { label: "Acil", value: "Acil" },
  { label: "Kritik", value: "Kritik" },
];
const remainingCharacters = computed(() => maxDescriptionLength - description.value.length);

function submitTicket() {
  submitted.value = true;
}

function resetTicket() {
  submitted.value = false;
  description.value = "";
  category.value = "Sistem ile ilgili konular";
  priority.value = "Normal";
  imageFiles.value = [];
  documentFiles.value = [];
  nextTick(resizeDescription);
}

function resizeDescription() {
  const textarea = descriptionRef.value;
  if (!textarea) return;
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function updateDescription(event) {
  description.value = event.target.value.slice(0, maxDescriptionLength);
  nextTick(resizeDescription);
}

function openImagePicker() {
  imageInputRef.value?.click();
}

function openFilePicker() {
  fileInputRef.value?.click();
}

function onImageSelected(event) {
  imageFiles.value = Array.from(event.target.files || []);
}

function onFileSelected(event) {
  documentFiles.value = Array.from(event.target.files || []);
}
</script>

<template>
  <AppPage title="Talep Oluştur" class="support-new-page" data-testid="support-ticket-page">
    <AppCard v-if="submitted" class="ticket-success-card" data-testid="support-ticket-success">
      <span class="ticket-success-icon"><AppIcon name="check" :size="22" /></span>
      <h2>Talebin oluşturuldu</h2>
      <p>Ekibimiz konuyu takip edecek. Talep numaran:</p>
      <strong>LP-000123</strong>
      <AppButton class="primary-btn" icon="plus" data-testid="support-ticket-new" @click="resetTicket">
        Yeni Talep Oluştur
      </AppButton>
      <AppButton class="secondary-btn" variant="secondary" icon="message" @click="router.push('/support/live')">
        Canlı desteğe geç
      </AppButton>
    </AppCard>

    <AppCard v-else as="form" class="ticket-form-card" data-testid="support-ticket-form" @submit.prevent="submitTicket">
      <label>
        <span>Kategori</span>
        <select v-model="category" data-testid="support-ticket-category" name="category">
          <option v-for="item in ticketCategories" :key="item" :value="item">{{ item }}</option>
        </select>
      </label>
      <label class="ticket-description-field">
        <span>Açıklama</span>
        <textarea
          ref="descriptionRef"
          :value="description"
          class="ticket-description-textarea"
          data-testid="support-ticket-description"
          name="description"
          rows="3"
          :maxlength="maxDescriptionLength"
          :placeholder="descriptionFocused ? '' : descriptionPlaceholder"
          @input="updateDescription"
          @focus="descriptionFocused = true; resizeDescription()"
          @blur="descriptionFocused = false"
        ></textarea>
        <small class="ticket-character-count" data-testid="support-ticket-character-count">
          {{ remainingCharacters }} karakter kaldı
        </small>
      </label>
      <label>
        <span>Öncelik</span>
        <select v-model="priority" data-testid="support-ticket-priority" name="priority">
          <option v-for="item in priorityOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
      </label>
      <div class="ticket-attachment-grid" aria-label="Talep ekleri">
        <button class="ticket-upload-placeholder" type="button" data-testid="support-ticket-image-upload" @click="openImagePicker">
          <AppIcon name="plus" :size="18" />
          <span>{{ imageFiles.length ? `${imageFiles.length} resim seçildi` : "Resim ekle" }}</span>
        </button>
        <button class="ticket-upload-placeholder" type="button" data-testid="support-ticket-file-upload" @click="openFilePicker">
          <AppIcon name="file-text" :size="18" />
          <span>{{ documentFiles.length ? `${documentFiles.length} dosya seçildi` : "Dosya ekle" }}</span>
        </button>
      </div>
      <input
        ref="imageInputRef"
        class="sr-only"
        type="file"
        accept="image/*"
        multiple
        data-testid="support-ticket-image-input"
        @change="onImageSelected"
      />
      <input
        ref="fileInputRef"
        class="sr-only"
        type="file"
        data-testid="support-ticket-file-input"
        @change="onFileSelected"
      />
      <AppButton class="primary-btn" type="submit" data-testid="support-ticket-submit">Talep Oluştur</AppButton>
    </AppCard>
  </AppPage>
</template>
