<script setup>
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();

const verifiedPhone = {
  icon: "phone",
  title: "Cep telefonu numarası",
  value: "05••• ••• 67",
  description: "Cep telefonu numaran varsayılan olarak doğrulanmış görünür.",
  status: "Doğrulanmış",
};

const verificationActions = [
  {
    id: "email",
    icon: "message",
    title: "Mail adresimi doğrula",
    description: "Mail adresine güvenli doğrulama bağlantısı gönder.",
    actionLabel: "Doğrula",
    toast: "Mail doğrulama bağlantısı gönderildi.",
  },
  {
    id: "identity",
    icon: "shield",
    title: "TC kimlik numaramı doğrula",
    description: "Kimlik bilgilerini güvenli şekilde kontrol et.",
    actionLabel: "Doğrula",
    toast: "TC kimlik doğrulama adımı açıldı.",
  },
  {
    id: "tax",
    icon: "receipt",
    title: "Vergi levhamı doğrula",
    description: "Vergi levhası belgeni kontrol için ilet.",
    actionLabel: "Doğrula",
    toast: "Vergi levhası doğrulama adımı açıldı.",
  },
];

function startVerification(item) {
  shell.showToast(item.toast);
}
</script>

<template>
  <AppPage title="Doğrulamalar" class="verifications-page" data-testid="verifications-page">
    <AppCard class="verifications-summary-card" variant="elevated" padding="md">
      <div class="verifications-summary-card__icon" aria-hidden="true">
        <AppIcon name="shield" :size="24" />
      </div>
      <div class="verifications-summary-card__copy">
        <p>Güven bilgileri</p>
        <h2>Hesabını daha güçlü göster</h2>
        <span>Doğrulanmış bilgiler profil güvenini artırır.</span>
      </div>
    </AppCard>

    <AppCard class="verifications-card" variant="default" padding="sm">
      <div class="verification-row is-verified" data-testid="verified-phone-row">
        <span class="verification-row__icon" aria-hidden="true">
          <AppIcon :name="verifiedPhone.icon" :size="20" />
        </span>
        <span class="verification-row__content">
          <strong>{{ verifiedPhone.title }}</strong>
          <small>{{ verifiedPhone.description }}</small>
          <em>{{ verifiedPhone.value }}</em>
        </span>
        <span class="verification-row__status">
          <AppIcon name="check" :size="14" />
          {{ verifiedPhone.status }}
        </span>
      </div>
    </AppCard>

    <section class="verification-actions" aria-label="Doğrulama seçenekleri">
      <h2>Doğrulama seçenekleri</h2>
      <AppCard class="verification-actions__list" variant="default" padding="sm">
        <div
          v-for="item in verificationActions"
          :key="item.id"
          class="verification-action-row"
          :data-testid="`verification-action-${item.id}`"
        >
          <span class="verification-action-row__icon" aria-hidden="true">
            <AppIcon :name="item.icon" :size="20" />
          </span>
          <span class="verification-action-row__content">
            <strong>{{ item.title }}</strong>
            <small>{{ item.description }}</small>
          </span>
          <AppButton
            class="verification-action-row__button"
            variant="subtle"
            size="sm"
            :data-testid="`verification-action-${item.id}-button`"
            @click="startVerification(item)"
          >
            {{ item.actionLabel }}
          </AppButton>
        </div>
      </AppCard>
    </section>
  </AppPage>
</template>

<style scoped>
.verifications-page {
  display: grid;
  gap: 12px;
}

.verifications-summary-card {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  border-color: color-mix(in srgb, var(--color-primary) 24%, var(--color-border));
  background:
    radial-gradient(circle at 92% 10%, color-mix(in srgb, var(--color-primary-soft) 86%, transparent), transparent 32%),
    linear-gradient(180deg, color-mix(in srgb, var(--color-primary-soft) 42%, var(--color-surface)), var(--color-surface));
}

.verifications-summary-card__icon,
.verification-row__icon,
.verification-action-row__icon {
  display: grid;
  place-items: center;
  color: var(--color-primary-dark);
  background: var(--color-primary-soft);
  border: 1px solid var(--color-primary-border);
}

.verifications-summary-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-card-compact);
}

.verifications-summary-card__copy {
  min-width: 0;
  display: grid;
  gap: 3px;
}

.verifications-summary-card__copy p,
.verifications-summary-card__copy h2,
.verifications-summary-card__copy span,
.verification-actions h2,
.verification-row__content strong,
.verification-row__content small,
.verification-row__content em,
.verification-action-row__content strong,
.verification-action-row__content small {
  margin: 0;
}

.verifications-summary-card__copy p,
.verification-actions h2 {
  color: var(--color-primary-dark);
  font-size: 12px;
  font-weight: 900;
}

.verifications-summary-card__copy h2 {
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 950;
  line-height: 1.1;
}

.verifications-summary-card__copy span,
.verification-row__content small,
.verification-action-row__content small {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.28;
}

.verifications-card,
.verification-actions__list {
  display: grid;
  gap: 8px;
}

.verification-row,
.verification-action-row {
  min-width: 0;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  min-height: 74px;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card-compact);
  background: var(--color-surface);
}

.verification-row.is-verified {
  border-color: color-mix(in srgb, var(--color-primary) 34%, var(--color-border));
  background: color-mix(in srgb, var(--color-primary-soft) 50%, var(--color-surface));
}

.verification-row__icon,
.verification-action-row__icon {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-card-compact);
}

.verification-row__content,
.verification-action-row__content {
  min-width: 0;
  display: grid;
  gap: 3px;
}

.verification-row__content strong,
.verification-action-row__content strong {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 930;
  line-height: 1.15;
}

.verification-row__content em {
  color: var(--text-secondary);
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
}

.verification-row__status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 28px;
  padding: 0 9px;
  border: 1px solid var(--color-primary-border);
  border-radius: var(--radius-pill);
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  font-size: 11px;
  font-weight: 900;
  white-space: nowrap;
}

.verification-action-row__button {
  min-width: 84px;
}

@media (max-width: 360px) {
  .verification-row,
  .verification-action-row {
    grid-template-columns: 38px minmax(0, 1fr);
  }

  .verification-row__status,
  .verification-action-row__button {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
