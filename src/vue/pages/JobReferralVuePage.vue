<script setup>
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppHeader from "../components/ui/AppHeader.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSectionTitle from "../components/ui/AppSectionTitle.vue";
import { useNavigation } from "../composables/useNavigation.js";

const props = defineProps({
  navigateTo: { type: Function, default: undefined },
});

const { navigateTo, goBack } = useNavigation(props.navigateTo);

const steps = [
  ["Müşteri bilgisini gir", "Telefon, adres ve ihtiyacı hızlıca ekle."],
  ["Lipyum işi doğrular", "Talep kalite ve uygunluk kontrolünden geçer."],
  ["Uygun partner işi yapar", "Saha ekibi müşteriye ulaşır ve işi tamamlar."],
  ["Kazanç alırsın", "İş gerçekleştiğinde bonus veya nakit kazancın oluşur."],
];
</script>

<template>
  <AppPage title="İş Yönlendirme Programı">
    <div class="v-stack">
      <AppHeader
        title="İş Yönlendirme"
        subtitle="Servis talebi gönder, kazanç elde et"
        right-icon="settings"
        right-label="İş yönlendirme ayarları"
        @back="goBack"
      />

      <AppCard padding="lg" variant="hero" class="v-job-hero">
        <div class="v-stack">
          <AppChip tone="success" icon="send">Yeni kazanç kanalı</AppChip>
          <h2>Servis talebi gönder, iş gerçekleşirse kazanç al.</h2>
          <p>Müşteri bilgisini paylaş; Lipyum doğrulasın, uygun partner işi yapsın.</p>
          <AppButton full-width icon="plus" @click="navigateTo('/jobs')">İş Gönder</AppButton>
        </div>
      </AppCard>

      <AppSectionTitle title="Nasıl çalışır?" />

      <div class="v-step-list">
        <article v-for="(step, index) in steps" :key="step[0]" class="v-step">
          <span class="v-step__number">{{ index + 1 }}</span>
          <div>
            <h3>{{ step[0] }}</h3>
            <p>{{ step[1] }}</p>
          </div>
        </article>
      </div>

      <AppCard padding="md" class="v-feature-card">
        <div class="v-feature-card__top">
          <h3>Kazanç türleri</h3>
          <AppIcon name="gift" :size="22" />
        </div>
        <p>Bonus, nakit veya komisyon senaryoları mock veriyle hazırlanmıştır.</p>
      </AppCard>
    </div>
  </AppPage>
</template>
