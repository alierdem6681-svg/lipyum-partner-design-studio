<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../ui/AppButton.vue";
import AppIcon from "../ui/AppIcon.vue";
import AppModal from "../ui/AppModal.vue";
import { useAppShellStore } from "../../stores/appShellStore.js";
import { useProfileStore } from "../../stores/profileStore.js";

const props = defineProps({
  variant: { type: String, default: "page" },
  compact: { type: Boolean, default: false },
  showActions: { type: Boolean, default: true },
  expandBadges: { type: Boolean, default: false },
});

const router = useRouter();
const shell = useAppShellStore();
const profile = useProfileStore();
const fileInput = ref(null);
const editorOpen = ref(false);
const draftImage = ref("");
const zoomLevel = ref(1);
const xLevel = ref(2);
const yLevel = ref(2);

const isDrawer = computed(() => props.variant === "drawer");
const badgeExpanded = computed(() => props.expandBadges || (isDrawer.value ? profile.drawerBadgesExpanded : profile.expandedBadges));
const visibleBadges = computed(() => {
  if (props.expandBadges) return profile.partner.badges;
  return isDrawer.value ? profile.drawerVisibleBadges : profile.visibleBadges;
});
const hiddenBadgeCount = computed(() => {
  if (props.expandBadges) return 0;
  return isDrawer.value ? profile.drawerHiddenBadgeCount : profile.hiddenBadgeCount;
});
const moreTestId = computed(() => (isDrawer.value ? "drawer-profile-badge-more" : "profile-badge-more"));
const moreAction = computed(() => (isDrawer.value ? "toggle-drawer-badges" : "toggle-profile-badges"));

const cardClasses = computed(() => [
  "partner-profile-card",
  `partner-profile-card--${props.variant}`,
  isDrawer.value ? "drawer-profile-card" : "",
  props.compact ? "partner-profile-card--compact" : "",
]);
const badgesClasses = computed(() => ["partner-profile-chips", badgeExpanded.value ? "is-expanded" : ""]);
const moreBadgeClasses = computed(() => ["partner-profile-chip", "is-more"]);
const previewImageClasses = computed(() => [
  "profile-photo-editor-image",
  `is-zoom-${zoomLevel.value}`,
  `is-x-${xLevel.value}`,
  `is-y-${yLevel.value}`,
]);

function badgeClass(index) {
  return ["partner-profile-chip", index >= 3 ? "is-extra" : ""];
}

function showAllBadges() {
  if (isDrawer.value) profile.showAllDrawerBadges();
  else profile.showAllBadges();
}

function openShareSheet() {
  shell.closeDrawer();
  shell.openSheet({
    title: "Profil paylaşımı",
    description: "Partner kartı",
    body: "Sosyal profil, WhatsApp, QR, e-posta ve link kopyalama seçenekleri hazır.",
  });
}

function openPreview() {
  shell.closeDrawer();
  router.push("/partner-card-preview");
}

function openPhotoEditor() {
  editorOpen.value = true;
  draftImage.value = "";
  zoomLevel.value = 1;
  xLevel.value = 2;
  yLevel.value = 2;
}

function closePhotoEditor() {
  editorOpen.value = false;
  draftImage.value = "";
}

function choosePhoto() {
  fileInput.value?.click();
}

function onFileSelected(event) {
  const [file] = event.target.files || [];
  event.target.value = "";
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    shell.showToast("Lütfen bir resim dosyası seç.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    draftImage.value = String(reader.result || "");
    zoomLevel.value = 1;
    xLevel.value = 2;
    yLevel.value = 2;
  };
  reader.onerror = () => shell.showToast("Resim okunamadı.");
  reader.readAsDataURL(file);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

async function cropImageToAvatar(src) {
  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  const size = 420;
  const scaleMap = [1, 1.08, 1.16, 1.26, 1.36];
  const scale = scaleMap[Number(zoomLevel.value)] || 1.08;
  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight) / scale;
  const maxX = Math.max(0, image.naturalWidth - sourceSize);
  const maxY = Math.max(0, image.naturalHeight - sourceSize);
  const xFactor = Number(xLevel.value) / 4;
  const yFactor = Number(yLevel.value) / 4;
  const sourceX = clamp(maxX * xFactor, 0, maxX);
  const sourceY = clamp(maxY * yFactor, 0, maxY);
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);
  return canvas.toDataURL("image/jpeg", 0.9);
}

async function savePhoto() {
  if (!draftImage.value) {
    choosePhoto();
    return;
  }
  try {
    const croppedAvatar = await cropImageToAvatar(draftImage.value);
    profile.updatePartnerAvatar(croppedAvatar);
    closePhotoEditor();
    shell.showToast("Profil fotoğrafı güncellendi.");
  } catch {
    shell.showToast("Fotoğraf kaydedilemedi.");
  }
}
</script>

<template>
  <section
    :class="cardClasses"
    data-testid="partner-profile-card"
    data-component="PartnerProfileCard"
    :data-profile-card-variant="variant"
    :aria-label="isDrawer ? 'Partner profili' : 'Partner profil kartı'"
  >
    <div class="partner-profile-main">
      <button
        class="partner-profile-avatar-btn"
        type="button"
        data-testid="partner-profile-avatar-button"
        aria-label="Profil fotoğrafı ekle"
        @click="openPhotoEditor"
      >
        <img :src="profile.partner.avatar" :alt="`${profile.partner.name} profil fotoğrafı`" />
        <span class="partner-profile-add" aria-hidden="true">
          <AppIcon name="plus" :size="16" class-name="icon" />
        </span>
      </button>

      <div class="partner-profile-copy">
        <div class="partner-profile-name-row">
          <h3 class="partner-profile-name">{{ profile.partner.name }}</h3>
          <span class="partner-profile-tier">
            <AppIcon name="crown" :size="14" class-name="icon" />
            {{ profile.partner.tier }}
          </span>
        </div>
        <span class="partner-profile-rating">
          <AppIcon name="star" :size="15" class-name="icon" />
          {{ profile.partner.rating }} Puan <span aria-hidden="true">·</span> {{ profile.partner.reviewCount }} Değerlendirme
        </span>
      </div>
    </div>

    <div :class="badgesClasses" aria-label="Profil rozetleri">
      <span v-for="(badge, index) in visibleBadges" :key="badge.label" :class="badgeClass(index)">
        <AppIcon :name="badge.icon" :size="14" class-name="icon" />
        {{ badge.label }}
      </span>
      <button
        v-if="hiddenBadgeCount"
        :class="moreBadgeClasses"
        type="button"
        :data-testid="moreTestId"
        :data-action="moreAction"
        aria-label="Ek rozetleri göster"
        :aria-expanded="badgeExpanded ? 'true' : 'false'"
        @click="showAllBadges"
      >
        <span>+{{ hiddenBadgeCount }}</span>
      </button>
    </div>

    <div v-if="showActions" class="partner-profile-actions">
      <button
        class="ghost-action"
        type="button"
        data-testid="partner-share-button"
        data-action="open-partner-share"
        @click="openShareSheet"
      >
        <AppIcon name="share" :size="16" class-name="icon" />
        Paylaş
      </button>
      <button
        class="ghost-action"
        type="button"
        data-testid="partner-preview-button"
        data-action="profile-preview"
        @click="openPreview"
      >
        <AppIcon name="eye" :size="16" class-name="icon" />
        Önizle
      </button>
    </div>

    <AppModal
      :open="editorOpen"
      title="Profil fotoğrafı"
      description="Fotoğrafını seç, konumlandır ve kaydet."
      @close="closePhotoEditor"
    >
      <div class="profile-photo-editor" data-testid="profile-photo-editor">
        <input
          ref="fileInput"
          class="profile-photo-file-input"
          type="file"
          accept="image/*"
          data-testid="profile-photo-file-input"
          @change="onFileSelected"
        />

        <button
          v-if="!draftImage"
          class="profile-photo-upload-zone"
          type="button"
          data-testid="profile-photo-upload-zone"
          @click="choosePhoto"
        >
          <AppIcon name="upload" :size="22" />
          <strong>Resim seç</strong>
          <span>JPG veya PNG yükleyebilirsin.</span>
        </button>

        <template v-else>
          <div class="profile-photo-editor-preview" aria-label="Profil fotoğrafı önizleme">
            <img :class="previewImageClasses" :src="draftImage" alt="Seçilen profil fotoğrafı" />
          </div>

          <div class="profile-photo-controls">
            <label>
              <span>Yakınlaştır</span>
              <input v-model="zoomLevel" type="range" min="0" max="4" step="1" data-testid="profile-photo-zoom" />
            </label>
            <label>
              <span>Yatay konum</span>
              <input v-model="xLevel" type="range" min="0" max="4" step="1" data-testid="profile-photo-x" />
            </label>
            <label>
              <span>Dikey konum</span>
              <input v-model="yLevel" type="range" min="0" max="4" step="1" data-testid="profile-photo-y" />
            </label>
          </div>
        </template>

        <div class="profile-photo-editor-actions">
          <AppButton variant="secondary" type="button" icon="upload" data-testid="profile-photo-change" @click="choosePhoto">
            Resim seç
          </AppButton>
          <AppButton type="button" icon="check" data-testid="profile-photo-save" @click="savePhoto">
            Kaydet
          </AppButton>
        </div>
      </div>
    </AppModal>
  </section>
</template>
