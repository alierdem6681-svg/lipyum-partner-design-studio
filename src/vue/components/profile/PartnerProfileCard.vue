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
  showMetrics: { type: Boolean, default: true },
  showBadges: { type: Boolean, default: true },
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
const isDraggingPhoto = ref(false);
const dragOrigin = ref({ x: 0, y: 0, xLevel: 2, yLevel: 2 });
const publicMetrics = [
  { id: "response", icon: "clock", label: "Yanıt Süresi", value: "Genelde <2 dk" },
  { id: "jobs", icon: "briefcase", label: "İş Sayısı", value: "428" },
  { id: "favorites", icon: "star", label: "Favoriye Alanlar", value: "69" },
];

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

function addToFavorites() {
  shell.showToast("Favorilerine eklendi.");
}

function openPhotoEditor() {
  editorOpen.value = true;
  draftImage.value = "";
  zoomLevel.value = 1;
  xLevel.value = 2;
  yLevel.value = 2;
  isDraggingPhoto.value = false;
}

function closePhotoEditor() {
  editorOpen.value = false;
  draftImage.value = "";
  isDraggingPhoto.value = false;
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
    isDraggingPhoto.value = false;
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

function adjustZoom(delta) {
  zoomLevel.value = clamp(Number(zoomLevel.value) + delta, 0, 4);
}

function nudgePhoto(axis, delta) {
  if (axis === "x") xLevel.value = clamp(Number(xLevel.value) + delta, 0, 4);
  if (axis === "y") yLevel.value = clamp(Number(yLevel.value) + delta, 0, 4);
}

function centerPhoto() {
  zoomLevel.value = 1;
  xLevel.value = 2;
  yLevel.value = 2;
}

function startPhotoDrag(event) {
  if (!draftImage.value) return;
  isDraggingPhoto.value = true;
  dragOrigin.value = {
    x: event.clientX,
    y: event.clientY,
    xLevel: Number(xLevel.value),
    yLevel: Number(yLevel.value),
  };
  event.currentTarget?.setPointerCapture?.(event.pointerId);
}

function dragPhoto(event) {
  if (!isDraggingPhoto.value) return;
  const deltaX = event.clientX - dragOrigin.value.x;
  const deltaY = event.clientY - dragOrigin.value.y;
  xLevel.value = clamp(Math.round(dragOrigin.value.xLevel - deltaX / 34), 0, 4);
  yLevel.value = clamp(Math.round(dragOrigin.value.yLevel - deltaY / 34), 0, 4);
}

function stopPhotoDrag(event) {
  if (!isDraggingPhoto.value) return;
  isDraggingPhoto.value = false;
  event.currentTarget?.releasePointerCapture?.(event.pointerId);
}

function handlePhotoKeydown(event) {
  if (event.key === "ArrowLeft") nudgePhoto("x", -1);
  else if (event.key === "ArrowRight") nudgePhoto("x", 1);
  else if (event.key === "ArrowUp") nudgePhoto("y", -1);
  else if (event.key === "ArrowDown") nudgePhoto("y", 1);
  else if (event.key === "+" || event.key === "=") adjustZoom(1);
  else if (event.key === "-" || event.key === "_") adjustZoom(-1);
  else if (event.key === "0") centerPhoto();
  else return;
  event.preventDefault();
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

    <div v-if="showMetrics && variant !== 'drawer'" class="partner-profile-public-metrics" data-testid="partner-public-metrics" aria-label="Profil öne çıkan bilgileri">
      <span
        v-for="metric in publicMetrics"
        :key="metric.id"
        class="partner-profile-public-metric"
        :data-testid="`partner-public-metric-${metric.id}`"
      >
        <span class="partner-profile-public-metric__label">
          <AppIcon :name="metric.icon" :size="13" class-name="icon" />
          <small>{{ metric.label }}</small>
        </span>
        <strong>{{ metric.value }}</strong>
      </span>
    </div>

    <div v-if="showBadges" :class="badgesClasses" aria-label="Profil rozetleri">
      <span
        v-for="(badge, index) in visibleBadges"
        :key="badge.label"
        :class="badgeClass(index)"
        :data-testid="variant === 'public' ? 'partner-public-badge' : undefined"
      >
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

    <button
      v-if="variant === 'public'"
      class="partner-profile-favorite-button"
      type="button"
      data-testid="partner-profile-favorite-button"
      @click="addToFavorites"
    >
      <AppIcon name="star" :size="15" class-name="icon" />
      Favorilerime Ekle
    </button>

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
          <div class="profile-photo-editor-stage">
            <div
              class="profile-photo-editor-preview"
              :class="{ 'is-dragging': isDraggingPhoto }"
              role="application"
              tabindex="0"
              data-testid="profile-photo-crop-area"
              aria-label="Profil fotoğrafını dairesel alan içinde konumlandır"
              @pointerdown="startPhotoDrag"
              @pointermove="dragPhoto"
              @pointerup="stopPhotoDrag"
              @pointercancel="stopPhotoDrag"
              @keydown="handlePhotoKeydown"
            >
              <img :class="previewImageClasses" :src="draftImage" alt="Seçilen profil fotoğrafı" draggable="false" />
              <span class="profile-photo-crop-ring" aria-hidden="true"></span>
              <span class="profile-photo-crop-hint">Sürükle ve yerleştir</span>
            </div>

            <div class="profile-photo-tool-row" aria-label="Profil fotoğrafı araçları">
              <button
                class="profile-photo-tool"
                type="button"
                data-testid="profile-photo-zoom-out"
                aria-label="Uzaklaştır"
                @click="adjustZoom(-1)"
              >
                <AppIcon name="minus" :size="17" />
              </button>
              <span class="profile-photo-zoom-label">Yakınlık {{ Number(zoomLevel) + 1 }}/5</span>
              <button
                class="profile-photo-tool"
                type="button"
                data-testid="profile-photo-zoom-in"
                aria-label="Yakınlaştır"
                @click="adjustZoom(1)"
              >
                <AppIcon name="plus" :size="17" />
              </button>
              <button class="profile-photo-center-btn" type="button" data-testid="profile-photo-center" @click="centerPhoto">
                <AppIcon name="refresh" :size="16" />
                Ortala
              </button>
            </div>

            <p class="profile-photo-editor-tip">Fotoğrafı dairesel alan içinde sürükle; artı ve eksi ile yakınlığı ayarla.</p>
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
