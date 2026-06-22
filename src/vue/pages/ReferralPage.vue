<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppHorizontalRail from "../components/ui/AppHorizontalRail.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSheet from "../components/ui/AppSheet.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const router = useRouter();
const shell = useAppShellStore();
const invitePhone = ref("");
const selectedPartnerId = ref("");
const sheetType = ref("");

const partners = [
  {
    id: "ahmet-kaya",
    name: "Ahmet Kaya",
    initials: "A",
    city: "İstanbul",
    stage: "Davet gönderildi",
    status: "Kayıt olmalı",
    bonus: "100 TL",
    bonusUnit: "Bonus",
    earnedTotal: "15.876 TL Bonus",
    phone: "+90 532 224 18 74",
    avatarTone: "amber",
    cardTone: "invited",
    steps: [
      { label: "Bekleniyor", icon: "send", current: true },
      { label: "Kayıt oldu", icon: "check", done: false },
      { label: "İlk işi aldı", icon: "briefcase", done: false },
      { label: "Bakiye yükledi", icon: "wallet", done: false },
    ],
    message: "Ahmet Kaya aynı cep telefonu numarasıyla kayıt olduğunda 100 TL bonus kazanacaksın.",
    nextStep: "Davet mesajını gördüğünü kısa bir arama ile teyit edebilirsin.",
    rewardRule: "Kayıt ve profilini tamamladığında ilk bonus açılır.",
  },
  {
    id: "mehmet-yilmaz",
    name: "Mehmet Yılmaz",
    initials: "M",
    city: "Ankara",
    stage: "Profil eksik",
    status: "Profilini tamamlamalı",
    bonus: "500 TL",
    bonusUnit: "Bonus",
    earnedTotal: "8.420 TL Bonus",
    phone: "+90 535 118 32 90",
    avatarTone: "blue",
    cardTone: "profile",
    steps: [
      { label: "Kayıt oldu", icon: "check", done: true },
      { label: "Bekleniyor", icon: "user", current: true },
      { label: "İlk işi aldı", icon: "briefcase", done: false },
      { label: "Bakiye yükledi", icon: "wallet", done: false },
    ],
    message: "Profil bilgilerini tamamladığında 500 TL bonus süreci açılacak.",
    nextStep: "Kimlik, belge, hizmet alanı ve bölge bilgilerini tamamlamasını hatırlat.",
    rewardRule: "Profil tamamlandığında ilk iş bonus süreci başlar.",
  },
  {
    id: "ayse-demir",
    name: "Ayşe Demir",
    initials: "A",
    city: "İzmir",
    stage: "İlk iş bekleniyor",
    status: "İlk işini almalı",
    bonus: "500 TL",
    bonusUnit: "Bonus",
    earnedTotal: "6.950 TL Bonus",
    phone: "+90 536 902 10 44",
    avatarTone: "violet",
    cardTone: "need-job",
    steps: [
      { label: "Kayıt oldu", icon: "check", done: true },
      { label: "Profil tamam", icon: "check", done: true },
      { label: "Bekleniyor", icon: "briefcase", current: true },
      { label: "Bakiye yükledi", icon: "wallet", done: false },
    ],
    message: "Ayşe Demir ilk işini aldığında 500 TL bonus kazanacaksın.",
    nextStep: "İlk işi alması için bölge ve bakiye ayarlarını kontrol etmesini öner.",
    rewardRule: "İlk hazır iş veya havuz işi alındığında bonus hak edişe döner.",
  },
  {
    id: "derya-aksoy",
    name: "Derya Aksoy",
    initials: "D",
    city: "Bursa",
    stage: "Bakiye yüklemeli",
    status: "Tekrar bakiye yüklemeli",
    bonus: "%3",
    bonusUnit: "Bonus",
    earnedTotal: "12.240 TL Bonus",
    phone: "+90 533 440 72 16",
    avatarTone: "green",
    cardTone: "topup",
    steps: [
      { label: "Kayıt oldu", icon: "check", done: true },
      { label: "İlk işi aldı", icon: "check", done: true },
      { label: "Bekleniyor", icon: "wallet", current: true },
    ],
    message: "Derya Aksoy tekrar bakiye yüklediğinde yükleme tutarından %3 bonus kazanacaksın.",
    nextStep: "Bakiye yüklediğinde hem o iş alır hem sen bonus kazanırsın.",
    rewardRule: "Aktif partnerlerin sonraki bakiye yüklemelerinde %3 bonus hesaplanır.",
  },
];

const guideTask = {
  id: "guide",
  type: "guide",
  title: "İlk partnerini kazan",
  stage: "Henüz davet edilen partner yoksa",
  message: "Birini getir, önce 100 TL bonus, sonra 500 TL bonus ve sonra her bakiye yüklemesinden %3 bonus kazan.",
};

const taskCards = computed(() => [guideTask, ...partners.slice(0, 4)]);
const selectedPartner = computed(() => partners.find((partner) => partner.id === selectedPartnerId.value) || partners[0]);

const summaryItems = [
  { label: "Toplam", value: "18", icon: "users", tone: "teal" },
  { label: "Aktif", value: "11", icon: "check", tone: "green" },
  { label: "Bekleyen", value: "5", icon: "clock", tone: "amber" },
  { label: "Bu ay", value: "2.450", icon: "gift", tone: "blue" },
];

const earningRules = [
  { title: "Kayıt Olma", value: "100 TL Bonus" },
  { title: "İlk İş", value: "500 TL Bonus" },
  { title: "Bakiye Yükleme", value: "%3 Bonus" },
];

function sendInvite() {
  const target = invitePhone.value.trim() || "Girilen numaraya";
  shell.showToast(`${target} için WhatsApp davet mesajı hazırlandı.`);
}

function openPartnerSheet(partnerId) {
  selectedPartnerId.value = partnerId;
  sheetType.value = "partner";
}

function openEarningSheet() {
  sheetType.value = "earnings";
}

function closeSheet() {
  sheetType.value = "";
}

function callPartner() {
  shell.showToast(`${selectedPartner.value.name} aranıyor.`);
}

function messagePartner() {
  shell.showToast(`${selectedPartner.value.name} için WhatsApp mesajı hazırlanıyor.`);
}
</script>

<template>
  <AppPage title="Partner Davet Programı" data-testid="referral-page">
    <div class="referral-page-rich">
      <section class="referral-hero">
        <div class="referral-hero-copy">
          <span class="referral-hero-label">Bu ay kazancın <AppIcon name="help-circle" :size="14" /></span>
          <strong class="referral-hero-amount">2.450</strong>
          <span class="referral-hero-bonus">Bonus</span>
          <button class="referral-hero-btn" type="button" @click="router.push('/referral-earnings')">
            Kazançlarını Gör <AppIcon name="chevron-right" :size="16" />
          </button>
        </div>
        <div class="referral-wallet-art" aria-hidden="true">
          <span class="referral-wallet"></span>
          <span class="referral-coin one">B</span>
          <span class="referral-coin two">B</span>
          <span class="referral-coin three">B</span>
        </div>
      </section>

      <AppCard padding="md" class="referral-phone-card">
        <div class="referral-phone-head">
          <span class="referral-icon-soft"><AppIcon name="phone" :size="20" /></span>
          <span>
            <strong>Yeni partner davet et</strong>
            <small>Cep telefonu numarasını gir. Sistem bu kişiye WhatsApp davet mesajı hazırlar.</small>
          </span>
        </div>
        <div class="referral-phone-form">
          <input
            v-model="invitePhone"
            class="referral-phone-input"
            type="tel"
            inputmode="tel"
            placeholder="05xx xxx xx xx"
            aria-label="Davet edilecek cep telefonu"
          />
          <AppButton icon="send" data-testid="referral-invite-button" @click="sendInvite">Davet Gönder</AppButton>
        </div>
        <span class="referral-phone-note">
          <AppIcon name="check" :size="16" /> Aynı cep numarasıyla kayıt olursa partner senin davetinle kazanılmış sayılır.
        </span>
      </AppCard>

      <div class="referral-section-head">
        <h3>Görevlerin</h3>
        <button type="button" data-testid="referral-view-all" @click="router.push('/referral/partners')">
          Tümünü gör <AppIcon name="chevron-right" :size="16" />
        </button>
      </div>

      <AppHorizontalRail :items="taskCards" aria-label="Referral görevleri" data-testid="referral-rail">
        <template #default="{ item }">
          <AppCard
            v-if="item.type === 'guide'"
            padding="md"
            class="referral-task-card referral-task-card--guide"
            data-testid="referral-guide-card"
          >
            <div class="referral-candidate-main referral-guide-main">
              <span class="referral-guide-visual"><AppIcon name="users" :size="24" /></span>
              <span class="referral-candidate-copy">
                <strong>{{ item.title }}</strong>
                <small>{{ item.stage }}</small>
              </span>
              <AppIcon name="chevron-right" :size="17" />
            </div>
            <div class="referral-guide-actions">
              <span><AppIcon name="phone" :size="14" /> 1. Telefon gir</span>
              <span><AppIcon name="message" :size="14" /> 2. Davet gönder</span>
              <span><AppIcon name="gift" :size="14" /> 3. Ödülleri kazan</span>
            </div>
            <p class="referral-task-message">{{ item.message }}</p>
          </AppCard>

          <button
            v-else
            type="button"
            :class="['referral-task-card', `referral-task-card--${item.cardTone}`]"
            data-testid="referral-partner-card"
            @click="openPartnerSheet(item.id)"
          >
            <span class="referral-candidate-main">
              <span :class="['referral-avatar', `is-${item.avatarTone}`]">{{ item.initials }}</span>
              <span class="referral-candidate-copy">
                <strong>{{ item.name }}</strong>
                <small>{{ item.stage }}</small>
              </span>
              <span class="referral-bonus"><strong>{{ item.bonus }}</strong><small>{{ item.bonusUnit }}</small></span>
              <AppIcon name="chevron-right" :size="17" />
            </span>
            <span class="referral-progress">
              <span
                v-for="step in item.steps"
                :key="`${item.id}-${step.label}`"
                :class="['referral-step', step.done ? 'is-done' : '', step.current ? 'is-current' : '']"
              >
                <span class="referral-step-dot">
                  <em v-if="step.current">Bekleniyor</em>
                  <AppIcon :name="step.icon" :size="13" />
                </span>
                <small>{{ step.label }}</small>
              </span>
            </span>
            <span class="referral-task-message">{{ item.message }}</span>
          </button>
        </template>
      </AppHorizontalRail>

      <div class="referral-task-dots" aria-hidden="true">
        <span class="active"></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div class="referral-section-head">
        <h3>Partner Özeti</h3>
      </div>
      <section class="referral-summary-strip" aria-label="Partner özeti">
        <button
          v-for="summary in summaryItems"
          :key="summary.label"
          :class="['referral-summary-card', `is-${summary.tone}`]"
          type="button"
          @click="router.push('/referral/partners')"
        >
          <span class="referral-summary-icon"><AppIcon :name="summary.icon" :size="17" /></span>
          <strong>{{ summary.value }}</strong>
          <small>{{ summary.label }}</small>
        </button>
      </section>

      <button class="referral-earn-showcase" type="button" @click="openEarningSheet">
        <span class="earn-gift-badge"><AppIcon name="gift" :size="24" /></span>
        <span>
          <h3>Ne kadar kazanırım?</h3>
          <span class="earn-rule-list">
            <span v-for="rule in earningRules" :key="rule.title">
              <i></i><b>{{ rule.title }}:</b><em>{{ rule.value }}</em>
            </span>
          </span>
        </span>
        <span class="earn-coin one">B</span>
        <span class="earn-coin two">B</span>
      </button>
    </div>

    <AppSheet
      v-if="sheetType === 'partner'"
      open
      title="Partner Detayı"
      description="Davet, iletişim ve bonus takibi"
      @close="closeSheet"
    >
      <div class="referral-detail-sheet" data-testid="referral-partner-detail">
        <section class="referral-person-head">
          <span :class="['referral-avatar', `is-${selectedPartner.avatarTone}`]">{{ selectedPartner.initials }}</span>
          <span class="referral-person-title">
            <strong>{{ selectedPartner.name }}</strong>
            <small>{{ selectedPartner.status }}</small>
          </span>
        </section>
        <div class="referral-person-phone"><AppIcon name="phone" :size="17" /> {{ selectedPartner.phone }}</div>
        <div class="referral-person-actions">
          <AppButton icon="phone" @click="callPartner">Ara</AppButton>
          <AppButton variant="secondary" icon="message" @click="messagePartner">WhatsApp</AppButton>
        </div>
        <section class="referral-earned-card">
          <span>Bugüne kadar kazandırdı</span>
          <strong>{{ selectedPartner.earnedTotal }}</strong>
          <small>{{ selectedPartner.name }} isimli partner bugüne kadar size {{ selectedPartner.earnedTotal }} kazandırdı.</small>
        </section>
        <section class="referral-person-note">
          <strong>Bonus şartı</strong>
          <span>{{ selectedPartner.rewardRule }}</span>
        </section>
        <section class="referral-person-note">
          <strong>Sıradaki adım</strong>
          <span>{{ selectedPartner.nextStep }}</span>
        </section>
      </div>
    </AppSheet>

    <AppSheet
      v-if="sheetType === 'earnings'"
      open
      title="Ne kadar kazanırım?"
      description="Partner davet kazanç kuralları"
      @close="closeSheet"
    >
      <div class="referral-earning-sheet">
        <div v-for="rule in earningRules" :key="rule.title" class="referral-earning-rule">
          <span><AppIcon name="gift" :size="17" /></span>
          <strong>{{ rule.title }}</strong>
          <em>{{ rule.value }}</em>
        </div>
        <p>Davet edilen partner aktif oldukça bonus ve yükleme kazançlarını bu ekrandan takip edebilirsin.</p>
      </div>
    </AppSheet>
  </AppPage>
</template>
