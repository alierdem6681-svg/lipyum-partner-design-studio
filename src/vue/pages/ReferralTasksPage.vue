<script setup>
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const router = useRouter();

const tasks = [
  {
    id: "register",
    icon: "users",
    title: "Partneri kayıt ettir",
    body: "Aynı cep numarasıyla kayıt olmasını sağla.",
    reward: "100 TL Bonus",
    action: "Davet gönder",
  },
  {
    id: "first-job",
    icon: "briefcase",
    title: "İlk işini aldır",
    body: "Profilini tamamlasın ve ilk iş fırsatını değerlendirsin.",
    reward: "500 TL Bonus",
    action: "Takip et",
  },
  {
    id: "topup",
    icon: "wallet",
    title: "Bakiye yüklet",
    body: "Aktif kaldıkça her bakiye yüklemesinden bonus kazan.",
    reward: "%3 Pasif Bonus",
    action: "Partnerleri gör",
  },
];
</script>

<template>
  <AppPage title="Referral Görevleri" data-testid="referral-tasks-page">
    <div class="referral-tasks-page">
      <section class="referral-tasks-hero">
        <span><AppIcon name="check" :size="22" /></span>
        <strong>Yapman gereken işler</strong>
        <small>Bu ekran yalnız partner davet görevlerini gösterir. Davet edilen partnerler ayrı listede tutulur.</small>
      </section>

      <div class="referral-task-list" role="list">
        <AppCard v-for="task in tasks" :key="task.id" padding="md" class="referral-task-row" role="listitem">
          <span class="referral-task-row__icon"><AppIcon :name="task.icon" :size="20" /></span>
          <span class="referral-task-row__copy">
            <strong>{{ task.title }}</strong>
            <small>{{ task.body }}</small>
          </span>
          <span class="referral-task-row__reward">{{ task.reward }}</span>
          <AppButton size="sm" variant="secondary" @click="router.push(task.id === 'register' ? '/referral' : '/referral/partners')">
            {{ task.action }}
          </AppButton>
        </AppCard>
      </div>

      <AppButton variant="ghost" icon="users" full-width data-testid="referral-tasks-partner-list" @click="router.push('/referral/partners')">
        Davet edilen partnerleri gör
      </AppButton>
    </div>
  </AppPage>
</template>
