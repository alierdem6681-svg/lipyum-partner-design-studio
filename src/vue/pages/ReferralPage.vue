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
    message: "Ahmet aynı cep telefonu numarasıyla kayıt olduğunda ilk bonus açılır.",
    nextStep: "Davet mesajını gördüğünü kısa bir arama ile teyit edebilirsin.",
    rewardRule: "Kayıt ve profil tamamlandığında ilk bonus açılır.",
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
    message: "Profil bilgilerini tamamladığında ilk iş bonus süreci başlar.",
    nextStep: "Kimlik, belge, hizmet alanı ve bölge bilgilerini tamamlamasını hatırlat.",
    rewardRule: "Profil tamamlandığında ilk iş bonusu takip edilir.",
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
    message: "İlk işini aldığında ikinci bonus kazanma adımı açılır.",
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
    message: "Tekrar bakiye yüklediğinde yükleme tutarından %3 bonus kazanırsın.",
    nextStep: "Bakiye yüklediğinde hem o iş alır hem sen bonus kazanırsın.",
    rewardRule: "Aktif partnerlerin sonraki bakiye yüklemelerinde %3 bonus hesaplanır.",
  },
];

const guideTask = {
  id: "guide",
  type: "guide",
  title: "İlk partnerini kazan",
  stage: "Henüz davet edilen partner yoksa",
  message: "Davet ettiğin partner kayıt olur, ilk işini alır ve bakiye yükledikçe sen ömür boyu bonus kazanırsın.",
};

const topEarners = [
  { name: "Hüseyin Usta", value: "32.450 TL", rank: 1 },
  { name: "Murat Servis", value: "24.900 TL", rank: 2 },
  { name: "Ayşe Teknik", value: "18.700 TL", rank: 3 },
];

const taskCards = computed(() => [guideTask, ...partners.slice(0, 4)]);
const selectedPartner = computed(() => partners.find((partner) => partner.id === selectedPartnerId.value) || partners[0]);

const summaryItems = [
  { label: "Toplam", value: "18", icon: "users", tone: "teal" },
  { label: "Aktif", value: "11", icon: "check", tone: "green" },
  { label: "Bekleyen", value: "5", icon: "clock", tone: "amber" },
  { label: "Bu ay", value: "2.450", icon: "gift", tone: "blue" },
];

const earningRules = [
  { title: "Kayıt", value: "100 TL Bonus", body: "Davet ettiğin kişi aynı cep numarasıyla kayıt olur." },
  { title: "İlk iş", value: "500 TL Bonus", body: "Partner ilk işini alınca ikinci ödül açılır." },
  { title: "Bakiye", value: "%3 Bonus", body: "Aktif kaldıkça her bakiye yüklemesinden pay kazanırsın." },
];

const inviteTarget = computed(() => invitePhone.value.trim() || "05xx xxx xx xx");

function sendInvite() {
  sheetType.value = "invite";
}

function openPartnerSheet(partnerId) {
  selectedPartnerId.value = partnerId;
  sheetType.value = "partner";
}

function openEarningSheet() {
  sheetType.value = "earnings";
}

function openInfoSheet() {
  sheetType.value = "info";
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
        <button class="referral-info-button" type="button" aria-label="Partner davet programı nasıl çalışır?" @click="openInfoSheet">
          <AppIcon name="help-circle" :size="18" />
        </button>
        <div class="referral-hero-copy">
          <span class="referral-hero-label">Bu ay kazancın</span>
          <strong class="referral-hero-amount">2.450</strong>
          <span class="referral-hero-bonus">Bonus</span>
          <button class="referral-hero-btn" type="button" @click="router.push('/referral-earnings')">
            Kazançlarını Gör <AppIcon name="chevron-right" :size="16" />
          </button>
        </div>
        <div class="referral-top-earners" aria-label="Bu ay en çok kazananlar">
          <span v-for="earner in topEarners" :key="earner.rank" class="referral-top-earner">
            <b>{{ earner.rank }}</b>
            <span>
              <strong>{{ earner.value }}</strong>
              <small>{{ earner.name }}</small>
            </span>
          </span>
        </div>
      </section>

      <AppCard padding="md" class="referral-phone-card">
        <div class="referral-phone-head">
          <span class="referral-icon-soft"><AppIcon name="phone" :size="20" /></span>
          <span>
            <strong>Yeni partner ekle</strong>
            <small>Cep numarasını gir, davet mesajını gönder.</small>
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
      </AppCard>

      <div class="referral-section-head">
        <h3>Görevlerin</h3>
        <button type="button" data-testid="referral-view-all" @click="router.push('/referral/tasks')">
          Tümünü gör <AppIcon name="chevron-right" :size="16" />
        </button>
      </div>

      <AppHorizontalRail :items="taskCards" :edge-bleed="false" aria-label="Referral görevleri" data-testid="referral-rail">
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
              <span><AppIcon name="users" :size="14" /> 1. Kayıt et</span>
              <span><AppIcon name="briefcase" :size="14" /> 2. İş aldır</span>
              <span><AppIcon name="wallet" :size="14" /> 3. Bakiye yüklet</span>
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
        <button type="button" data-testid="referral-view-partners" @click="router.push('/referral/partners')">
          Partner listesi <AppIcon name="chevron-right" :size="16" />
        </button>
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

      <button class="referral-earn-showcase" type="button" data-testid="referral-earning-showcase" @click="openEarningSheet">
        <span class="earn-gift-badge"><AppIcon name="gift" :size="24" /></span>
        <span class="referral-earn-copy">
          <small>Ömür boyu pasif gelir</small>
          <h3>Partner kazandıkça sen de kazan</h3>
          <p>Kayıt, ilk iş ve her bakiye yüklemesinden bonus al.</p>
        </span>
        <span class="referral-earn-total">
          <strong>%3</strong>
          <small>yükleme bonusu</small>
        </span>
        <span class="earn-coin one">B</span>
        <span class="earn-coin two">B</span>
      </button>
    </div>

    <AppSheet v-if="sheetType === 'invite'" open title="Davet hazır" description="Göndermeden önce numarayı kontrol et." @close="closeSheet">
      <div class="referral-invite-sheet" data-testid="referral-invite-confirmation">
        <section class="referral-invite-target">
          <span><AppIcon name="phone" :size="18" /></span>
          <strong>{{ inviteTarget }}</strong>
          <small>Bu numaraya WhatsApp davet mesajı hazırlanacak.</small>
        </section>
        <section class="referral-person-note referral-person-note--warning">
          <strong>Önemli</strong>
          <span>Aynı cep numarasıyla kayıt olursa partner senin davetinle eşleşir ve bonus takibi açılır.</span>
        </section>
        <div class="referral-person-actions">
          <AppButton icon="message" @click="closeSheet">WhatsApp'a Geç</AppButton>
          <AppButton variant="secondary" icon="edit" @click="closeSheet">Numarayı Düzenle</AppButton>
        </div>
      </div>
    </AppSheet>

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
      description="Kayıt, ilk iş ve bakiye yüklemelerinden bonus kazan."
      @close="closeSheet"
    >
      <div class="referral-earning-sheet">
        <div class="referral-earning-hero">
          <strong>Bir partner büyüdükçe kazancın devam eder.</strong>
          <span>Aktif partnerlerin bakiye yüklemeleri sana pasif bonus üretir.</span>
        </div>
        <div v-for="rule in earningRules" :key="rule.title" class="referral-earning-rule">
          <span><AppIcon name="gift" :size="17" /></span>
          <strong>{{ rule.title }}</strong>
          <em>{{ rule.value }}</em>
          <small>{{ rule.body }}</small>
        </div>
      </div>
    </AppSheet>

    <AppSheet
      v-if="sheetType === 'info'"
      open
      title="Partner Davet Programı"
      description="Sistem nasıl çalışır?"
      @close="closeSheet"
    >
      <div class="referral-info-sheet" data-testid="referral-info-sheet">
        <section class="referral-info-hero">
          <span><AppIcon name="sparkles" :size="22" /></span>
          <strong>Bir partner getir, aktif kaldıkça kazan.</strong>
          <small>Davet ettiğin kişi kayıt olur, iş alır ve bakiye yükledikçe bonusların devam eder.</small>
        </section>
        <div class="referral-info-grid">
          <span>
            <AppIcon name="users" :size="20" />
            <strong>Kayıt et</strong>
            <small>Aynı cep numarasıyla kayıt olursa sana bağlanır.</small>
          </span>
          <span>
            <AppIcon name="briefcase" :size="20" />
            <strong>İş aldır</strong>
            <small>İlk iş alındığında ikinci bonus açılır.</small>
          </span>
          <span>
            <AppIcon name="wallet" :size="20" />
            <strong>Bakiye yüklet</strong>
            <small>Her yüklemede %3 pasif bonus kazanırsın.</small>
          </span>
        </div>
      </div>
    </AppSheet>
  </AppPage>
</template>
