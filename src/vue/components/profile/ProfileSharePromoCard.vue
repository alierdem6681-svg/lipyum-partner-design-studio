<script setup>
import { computed } from "vue";
import AppIcon from "../ui/AppIcon.vue";
import { useProfileStore } from "../../stores/profileStore.js";

const profile = useProfileStore();

const copy = {
  badge: "ÜCRETSİZ",
  headlineLead: "Profilini Paylaş,",
  headlineStrong: "Daha Fazla İş Al",
  description:
    "Profil linkini Instagram, web siten veya sosyal medyada paylaş. Müşteriler sana ulaşsın, randevu alsın, mesaj göndersin veya teklif istesin.",
};

const benefits = [
  { id: "appointment", icon: "calendar-check", label: "Randevu Al" },
  { id: "message", icon: "message", label: "Mesaj Gönder" },
  { id: "offer", icon: "file-text", label: "Teklif İste" },
];

const steps = [
  { id: "preview", icon: "eye", label: "1. Ön izleme yap" },
  { id: "share", icon: "share", label: "2. Paylaş", emphasized: true },
  { id: "customer", icon: "users", label: "3. Müşteri kazan" },
];

const avatarAlt = computed(() => `${profile.partner.name} profil fotoğrafı`);
</script>

<template>
  <article
    class="profile-share-promo-card"
    data-testid="profile-share-promo-card"
    aria-label="Profilini paylaşarak müşterilerin randevu almasını, mesaj göndermesini ve teklif istemesini sağla. Ücretsiz."
  >
    <div class="profile-share-promo-card__top">
      <div class="profile-share-promo-card__copy">
        <span class="profile-share-promo-card__badge">{{ copy.badge }}</span>
        <h2>
          <span>{{ copy.headlineLead }}</span>
          <span>{{ copy.headlineStrong }}</span>
        </h2>
        <p>{{ copy.description }}</p>
      </div>

      <div class="profile-share-promo-illustration" aria-hidden="true">
        <span class="profile-share-promo-illustration__accent is-one"></span>
        <span class="profile-share-promo-illustration__accent is-two"></span>
        <span class="profile-share-promo-illustration__accent is-three"></span>
        <span class="profile-share-promo-illustration__connector is-instagram"></span>
        <span class="profile-share-promo-illustration__connector is-web"></span>
        <span class="profile-share-promo-illustration__connector is-message"></span>

        <span class="profile-share-promo-illustration__card">
          <img :src="profile.partner.avatar" :alt="avatarAlt" />
          <i></i>
          <i></i>
          <i></i>
        </span>

        <span class="profile-share-promo-illustration__link">
          <AppIcon name="link" :size="26" />
        </span>

        <span class="profile-share-promo-illustration__bubble is-instagram">
          <AppIcon name="instagram" :size="17" />
        </span>
        <span class="profile-share-promo-illustration__bubble is-web">
          <AppIcon name="globe" :size="18" />
        </span>
        <span class="profile-share-promo-illustration__bubble is-message">
          <AppIcon name="message" :size="17" />
        </span>
        <span class="profile-share-promo-illustration__bubble is-users">
          <AppIcon name="users" :size="30" />
        </span>
      </div>
    </div>

    <div class="profile-share-promo-benefits" aria-label="Profil paylaşımıyla alınabilecek aksiyonlar">
      <span v-for="benefit in benefits" :key="benefit.id" class="profile-share-promo-benefit" :data-testid="`profile-share-promo-benefit-${benefit.id}`">
        <AppIcon :name="benefit.icon" :size="20" />
        <strong>{{ benefit.label }}</strong>
      </span>
    </div>

    <div class="profile-share-promo-steps" aria-label="Profil paylaşım akışı">
      <template v-for="step in steps" :key="step.id">
        <span :class="['profile-share-promo-step', step.emphasized ? 'is-emphasized' : '']" :data-testid="`profile-share-promo-step-${step.id}`">
          <span class="profile-share-promo-step__icon" aria-hidden="true">
            <AppIcon :name="step.icon" :size="23" />
          </span>
          <strong>{{ step.label }}</strong>
        </span>
      </template>
    </div>
  </article>
</template>
