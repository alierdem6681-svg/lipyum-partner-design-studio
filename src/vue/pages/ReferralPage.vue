<script setup>
import { useRouter } from "vue-router";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const router = useRouter();
const shell = useAppShellStore();

const heroSteps = [
  { step: "1", name: "Ayşe Durmaz Koç", detail: "Kayıt oldu" },
  { step: "2", name: "Mehmet Yılmaz Arı", detail: "İlk işini aldı" },
  { step: "3", name: "Derya Aksoy Tunç", detail: "Bakiye yükledi" },
];

const partnerCards = [
  {
    id: "ahmet-kaya",
    initials: "AK",
    name: "Ahmet Kaya",
    reward: "100 TL",
    rewardLabel: "Bonus",
    status: "Davet gönderildi",
    tone: "amber",
    currentStep: 1,
    message: "Ahmet Kaya kayıt olduğunda ilk bonusun hazır olacak.",
  },
  {
    id: "mehmet-yilmaz",
    initials: "MY",
    name: "Mehmet Yılmaz",
    reward: "500 TL",
    rewardLabel: "Bonus",
    status: "Profil tamamlanmalı",
    tone: "blue",
    currentStep: 2,
    message: "Mehmet Yılmaz profilini tamamladığında yeni kazanç adımı açılır.",
  },
  {
    id: "ayse-demir",
    initials: "AD",
    name: "Ayşe Demir",
    reward: "500 TL",
    rewardLabel: "Bonus",
    status: "İlk iş bekleniyor",
    tone: "green",
    currentStep: 2,
    message: "Ayşe Demir ilk işini aldığında ek bonus kazanırsın.",
  },
  {
    id: "derya-aksoy",
    initials: "DA",
    name: "Derya Aksoy",
    reward: "%3",
    rewardLabel: "Pay",
    status: "Bakiye yüklet",
    tone: "violet",
    currentStep: 3,
    message: "Derya Aksoy tekrar bakiye yüklediğinde yükleme üzerinden pay kazanırsın.",
  },
];

const summary = [
  { label: "Toplam", value: "18", icon: "users" },
  { label: "Aktif", value: "11", icon: "check" },
  { label: "Bekleyen", value: "5", icon: "clock" },
  { label: "Bu ay", value: "2.450 TL", icon: "wallet" },
];

const timeline = ["Kayıt oldu", "İş aldı", "Bakiye yükledi"];

function invite() {
  shell.showToast("WhatsApp davet mesajı hazırlandı.");
}
</script>

<template>
  <AppPage title="Partner Davet Programı" data-testid="referral-page">
    <div class="v-stack v-referral-v2">
      <section class="v-referral-hero">
        <div class="v-referral-hero__copy">
          <span class="v-referral-kicker"><AppIcon name="sparkles" :size="15" /> Ömür boyu pasif gelir</span>
          <h2>Bir partner getir, her büyümesinden kazan.</h2>
          <p>Davet ettiğin partner kayıt olur, iş alır ve bakiye yükledikçe kazancın devam eder.</p>
          <button type="button" class="v-referral-hero__button" data-testid="referral-invite-button" @click="invite">
            <AppIcon name="send" :size="16" />
            Yeni partner ekle
          </button>
        </div>

        <div class="v-referral-hero__steps" aria-label="Kazanç adımları">
          <article v-for="item in heroSteps" :key="item.step" class="v-referral-hero-step">
            <strong>{{ item.step }}</strong>
            <span>{{ item.name }}</span>
            <small>{{ item.detail }}</small>
          </article>
        </div>
      </section>

      <section>
        <div class="v-section-title v-referral-section-title">
          <h2>Görevlerin</h2>
          <button type="button" class="v-referral-game-link" @click="router.push('/referral/tasks')">
            <AppIcon name="zap" :size="15" />
            Görevlerim
          </button>
        </div>

        <div class="v-referral-rail" data-testid="referral-rail" aria-label="Partner görev kartları">
          <AppCard padding="md" as="article" class="v-referral-task-card v-referral-task-card--guide">
            <div class="v-referral-task-main">
              <span class="v-referral-task-icon"><AppIcon name="users" :size="22" /></span>
              <span>
                <strong>İlk partnerini kazan</strong>
                <small>İlk davetini tamamla ve kazanç akışını başlat.</small>
              </span>
            </div>
            <div class="v-referral-guide-actions" aria-label="İlk partner adımları">
              <span><AppIcon name="phone" :size="13" /> Kayıt et</span>
              <span><AppIcon name="briefcase" :size="13" /> İş aldır</span>
              <span><AppIcon name="wallet" :size="13" /> Bakiye yüklet</span>
            </div>
            <p class="v-referral-task-message">Birini getir; kayıt, ilk iş ve bakiye adımlarında bonus kazan.</p>
          </AppCard>

          <button
            v-for="partner in partnerCards"
            :key="partner.id"
            :class="['v-referral-task-card', `v-referral-task-card--${partner.tone}`]"
            type="button"
            data-testid="referral-partner-card"
            @click="router.push(`/referral/partner/${partner.id}`)"
          >
            <div class="v-referral-task-main">
              <span class="v-referral-avatar">{{ partner.initials }}</span>
              <span class="v-referral-person">
                <strong>{{ partner.name }}</strong>
                <small aria-hidden="true">&nbsp;</small>
              </span>
              <span class="v-referral-reward">
                <strong>{{ partner.reward }}</strong>
                <small>{{ partner.rewardLabel }}</small>
              </span>
              <AppIcon name="chevron-right" :size="17" />
            </div>

            <div class="v-referral-progress" aria-label="Partner süreci">
              <span
                v-for="(step, index) in timeline"
                :key="step"
                :class="['v-referral-step', index + 1 < partner.currentStep ? 'is-done' : '', index + 1 === partner.currentStep ? 'is-current' : '']"
              >
                <i>
                  <AppIcon v-if="index + 1 < partner.currentStep" name="check" :size="13" />
                  <AppIcon v-else name="clock" :size="13" />
                  <b v-if="index + 1 === partner.currentStep">Bekleniyor</b>
                </i>
                <small>{{ step }}</small>
              </span>
            </div>
            <p class="v-referral-task-message">{{ partner.message }}</p>
          </button>
        </div>
      </section>

      <button type="button" class="v-referral-summary-panel" data-testid="referral-view-all" @click="router.push('/referral/partners')">
        <span v-for="item in summary" :key="item.label" class="v-referral-summary-panel__item">
          <AppIcon :name="item.icon" :size="18" />
          <strong>{{ item.value }}</strong>
          <small>{{ item.label }}</small>
        </span>
      </button>
    </div>
  </AppPage>
</template>
