<script setup>
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppHorizontalRail from "../components/ui/AppHorizontalRail.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppMetricCard from "../components/ui/AppMetricCard.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const router = useRouter();
const shell = useAppShellStore();
const tasks = [
  { id: "invite", title: "3 partner davet et", body: "Tamamlanınca 120 bonus." },
  { id: "first-job", title: "İlk işi tamamlat", body: "Ek yönlendirme kazancı." },
  { id: "profile", title: "Davet profilini tamamlat", body: "Partner görünürlüğünü artır." },
];
const partners = [
  { id: "huseyfe", title: "Hüzeyfe A.", body: "Aktif partner, Ümraniye." },
  { id: "murat", title: "Murat K.", body: "Davet beklemede." },
];

function invite() {
  shell.showToast("WhatsApp davet mesajı hazırlandı.");
}
</script>

<template>
  <AppPage title="Partner Davet Programı" data-testid="referral-page">
    <div class="v-stack">
      <AppCard padding="lg" variant="hero" class="v-route-hero">
        <div>
          <h2>Partner Davet Programı</h2>
          <p>Davetlerinden bonus ve gelir fırsatı kazan.</p>
        </div>
        <AppButton icon="send" data-testid="referral-invite-button" @click="invite">Davet Et</AppButton>
      </AppCard>

      <div class="v-content-metric-grid">
        <AppMetricCard label="Toplam kazanç" value="₺3.240" icon="wallet" />
        <AppMetricCard label="Aktif partner" value="8" icon="users" tone="info" />
      </div>

      <section>
        <div class="v-section-title">
          <h2>Görevler</h2>
          <button type="button" @click="router.push('/referral/tasks')">Tümünü gör</button>
        </div>
        <AppHorizontalRail :items="tasks" aria-label="Referral görevleri">
          <template #default="{ item }">
            <AppCard padding="md" as="article">
              <strong>{{ item.title }}</strong>
              <p>{{ item.body }}</p>
            </AppCard>
          </template>
        </AppHorizontalRail>
      </section>

      <section>
        <div class="v-section-title">
          <h2>Partner listesi</h2>
          <button type="button" data-testid="referral-view-all" @click="router.push('/referral/partners')">Tümünü gör</button>
        </div>
        <div class="v-referral-rail" data-testid="referral-rail">
          <button
            v-for="partner in partners"
            :key="partner.id"
            class="v-referral-partner-card"
            type="button"
            data-testid="referral-partner-card"
            @click="router.push(`/referral/partner/${partner.id}`)"
          >
            <span><AppIcon name="user" :size="20" /></span>
            <strong>{{ partner.title }}</strong>
            <small>{{ partner.body }}</small>
          </button>
        </div>
      </section>
    </div>
  </AppPage>
</template>
