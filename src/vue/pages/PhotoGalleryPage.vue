<script setup>
import { onBeforeUnmount, reactive } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();
const uploadInputs = reactive({});

const gallerySections = reactive([
  {
    id: "profile",
    title: "Profil fotoğrafları",
    description: "Müşterinin ilk gördüğü güçlü profil görselleri.",
    icon: "user",
    limitText: "Birden fazla profil fotoğrafı ekleyebilirsin.",
    photos: [
      {
        id: "profile-1",
        src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80",
        alt: "Profil fotoğrafı",
        local: false,
      },
    ],
  },
  {
    id: "workplace",
    title: "İş yeri fotoğrafları",
    description: "Servis alanı, ekipman ve çalışma düzenini göster.",
    icon: "briefcase",
    limitText: "İş yerinden farklı açıları ekleyebilirsin.",
    photos: [
      {
        id: "workplace-1",
        src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=320&q=80",
        alt: "İş yeri fotoğrafı",
        local: false,
      },
      {
        id: "workplace-2",
        src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=320&q=80",
        alt: "Ekipman fotoğrafı",
        local: false,
      },
    ],
  },
  {
    id: "service",
    title: "Hizmet fotoğrafları",
    description: "Tamamladığın işleri ve hizmet kaliteni anlat.",
    icon: "image",
    limitText: "Öncesi, sonrası ve detay fotoğrafları ekleyebilirsin.",
    photos: [
      {
        id: "service-1",
        src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=320&q=80",
        alt: "Hizmet fotoğrafı",
        local: false,
      },
    ],
  },
]);

function handleUpload(section, event) {
  const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith("image/"));
  if (!files.length) return;

  const newPhotos = files.map((file, index) => ({
    id: `${section.id}-${Date.now()}-${index}`,
    src: URL.createObjectURL(file),
    alt: file.name || `${section.title} görseli`,
    local: true,
  }));

  section.photos.push(...newPhotos);
  event.target.value = "";
  shell.showToast(`${section.title} alanına ${newPhotos.length} fotoğraf eklendi.`);
}

function setUploadInput(sectionId, element) {
  if (element) uploadInputs[sectionId] = element;
}

function openUpload(sectionId) {
  uploadInputs[sectionId]?.click();
}

function removePhoto(section, photo) {
  section.photos = section.photos.filter((item) => item.id !== photo.id);
  if (photo.local) URL.revokeObjectURL(photo.src);
}

onBeforeUnmount(() => {
  gallerySections.forEach((section) => {
    section.photos.forEach((photo) => {
      if (photo.local) URL.revokeObjectURL(photo.src);
    });
  });
});
</script>

<template>
  <AppPage title="Fotoğraflarım" class="photo-gallery-page" data-testid="photo-gallery-page">
    <AppCard class="photo-gallery-intro" variant="elevated" padding="md">
      <span class="photo-gallery-intro__icon" aria-hidden="true">
        <AppIcon name="image" :size="24" />
      </span>
      <span class="photo-gallery-intro__copy">
        <strong>Fotoğraflarını düzenle</strong>
        <small>Profil, iş yeri ve hizmet fotoğraflarını ayrı ayrı yönet.</small>
      </span>
    </AppCard>

    <section
      v-for="section in gallerySections"
      :key="section.id"
      class="photo-gallery-section"
      :data-testid="`photo-gallery-section-${section.id}`"
    >
      <AppCard class="photo-gallery-card" variant="default" padding="md">
        <div class="photo-gallery-card__header">
          <span class="photo-gallery-card__icon" aria-hidden="true">
            <AppIcon :name="section.icon" :size="20" />
          </span>
          <span class="photo-gallery-card__title">
            <strong>{{ section.title }}</strong>
            <small>{{ section.description }}</small>
          </span>
          <span class="photo-gallery-card__count">{{ section.photos.length }} fotoğraf</span>
        </div>

        <div class="photo-gallery-grid" :aria-label="section.title">
          <figure v-for="photo in section.photos" :key="photo.id" class="photo-gallery-thumb">
            <img :src="photo.src" :alt="photo.alt" loading="lazy" />
            <button
              class="photo-gallery-thumb__remove"
              type="button"
              :aria-label="`${photo.alt} kaldır`"
              @click="removePhoto(section, photo)"
            >
              <AppIcon name="x" :size="14" />
            </button>
          </figure>

          <label class="photo-gallery-add" :data-testid="`photo-gallery-upload-${section.id}`">
            <input
              :ref="(element) => setUploadInput(section.id, element)"
              class="photo-gallery-add__input"
              type="file"
              accept="image/*"
              multiple
              @change="handleUpload(section, $event)"
            />
            <span aria-hidden="true">
              <AppIcon name="plus" :size="22" />
            </span>
            <strong>Fotoğraf ekle</strong>
          </label>
        </div>

        <div class="photo-gallery-card__footer">
          <span>
            <AppIcon name="check" :size="14" />
            {{ section.limitText }}
          </span>
          <AppButton
            class="photo-gallery-card__button"
            variant="subtle"
            size="sm"
            icon="plus"
            :data-testid="`photo-gallery-button-${section.id}`"
            @click="openUpload(section.id)"
          >
            Yükle
          </AppButton>
        </div>
      </AppCard>
    </section>
  </AppPage>
</template>

<style scoped>
.photo-gallery-page {
  display: grid;
  gap: 12px;
  padding-bottom: 128px;
}

.photo-gallery-intro {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  border-color: color-mix(in srgb, var(--color-primary) 22%, var(--color-border));
  background: linear-gradient(180deg, color-mix(in srgb, var(--color-primary-soft) 54%, var(--color-surface)), var(--color-surface));
}

.photo-gallery-intro__icon,
.photo-gallery-card__icon,
.photo-gallery-add span {
  display: grid;
  place-items: center;
  color: var(--color-primary-dark);
  background: var(--color-primary-soft);
  border: 1px solid var(--color-primary-border);
}

.photo-gallery-intro__icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-card-compact);
}

.photo-gallery-intro__copy,
.photo-gallery-card__title {
  min-width: 0;
  display: grid;
  gap: 3px;
}

.photo-gallery-intro__copy strong,
.photo-gallery-card__title strong {
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 930;
  line-height: 1.1;
}

.photo-gallery-intro__copy small,
.photo-gallery-card__title small,
.photo-gallery-card__footer {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.28;
}

.photo-gallery-card {
  display: grid;
  gap: 12px;
}

.photo-gallery-card__header {
  min-width: 0;
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
}

.photo-gallery-card__icon {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-card-compact);
}

.photo-gallery-card__count {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface-subtle);
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 900;
  white-space: nowrap;
}

.photo-gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.photo-gallery-thumb,
.photo-gallery-add {
  position: relative;
  aspect-ratio: 1;
  margin: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card-compact);
  overflow: hidden;
  background: var(--color-surface-subtle);
}

.photo-gallery-thumb img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.photo-gallery-thumb__remove {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-surface) 88%, transparent);
  color: var(--text-primary);
}

.photo-gallery-add {
  display: grid;
  place-items: center;
  gap: 5px;
  padding: 8px;
  color: var(--color-primary-dark);
  text-align: center;
  cursor: pointer;
}

.photo-gallery-add__input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.photo-gallery-add span {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-pill);
}

.photo-gallery-add strong {
  font-size: 11px;
  font-weight: 900;
  line-height: 1.1;
}

.photo-gallery-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.photo-gallery-card__footer span {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.photo-gallery-card__footer .v-icon {
  flex: 0 0 auto;
  color: var(--color-primary-dark);
}

.photo-gallery-card__button {
  flex: 0 0 auto;
}

@media (max-width: 360px) {
  .photo-gallery-card__header {
    grid-template-columns: 38px minmax(0, 1fr);
  }

  .photo-gallery-card__count {
    grid-column: 2;
    justify-self: start;
  }

  .photo-gallery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .photo-gallery-card__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .photo-gallery-card__button {
    width: 100%;
  }
}
</style>
