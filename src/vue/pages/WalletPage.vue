<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { formatCurrency } from "../data/walletCalculations.js";
import { walletRules } from "../data/walletRules.js";
import { useAppShellStore } from "../stores/appShellStore.js";
import { useWalletStore } from "../stores/walletStore.js";

const router = useRouter();
const shell = useAppShellStore();
const wallet = useWalletStore();

const topUpPackages = computed(() => walletRules.defaultTopUpAmounts.map((amount) => ({
  amount,
  label: amount === 250 ? "Başlangıç" : amount === 500 ? "Popüler" : "Profesyonel",
  icon: amount === 250 ? "zap" : amount === 500 ? "star" : "crown",
  recommended: amount === walletRules.defaultTopUpAmount,
})));

const opportunityLabel = computed(() => {
  const count = wallet.estimatedJobCount;
  if (count <= 0) return "≈ fırsat için bakiye yükle";
  if (count === 1) return "≈ 1 fırsata erişebilirsin";
  return `≈ ${count}-${count + 1} fırsata erişebilirsin`;
});

const recentRows = computed(() => wallet.recentTransactions.map((transaction) => ({
  ...transaction,
  amountLabel: transaction.amount
    ? `${transaction.direction === "out" ? "-" : "+"}${formatCurrency(transaction.amount)}`
    : `+${formatCurrency(transaction.bonusAmount)} bonus`,
  tone: transaction.status === "failed"
    ? "danger"
    : transaction.type === "job_purchase"
      ? "neutral"
      : transaction.type.includes("bonus")
        ? "gold"
        : "success",
  icon: transaction.type === "top_up"
    ? "plus"
    : transaction.type === "job_purchase"
      ? "eye"
      : transaction.type.includes("bonus")
        ? "gift"
        : "receipt",
})));

function goTo(route) {
  router.push(route);
}

function selectTopUp(amount) {
  wallet.selectTopUpAmount(amount);
  goTo("/wallet/top-up");
}

function openWalletInfo() {
  shell.openSheet({
    title: "Cüzdan nasıl çalışır?",
    description: "Bakiye ve bonus ayrı takip edilir.",
    body: "Cüzdan bakiyen, platformdaki fırsatlara erişmek için kullanılır. Bonus bakiyen doğrudan nakit değildir; bakiye yüklerken avantaj sağlar.",
    scoreItems: [
      { label: "Cüzdan", value: "Bakiye", description: "Fırsatlara erişim için kullanılır.", tone: "positive", icon: "wallet" },
      { label: "Bonus", value: "Avantaj", description: "Yükleme sırasında indirim etkisi sağlar.", tone: "positive", icon: "gift" },
      { label: "Şeffaflık", value: "Ayrı", description: "Cüzdan, bonus ve haklar karıştırılmaz.", tone: "neutral", icon: "shield" },
    ],
  });
}

function openBonusConvert() {
  window.dispatchEvent(new CustomEvent("lipyum:bonus-convert"));
}
</script>

<template>
  <AppPage title="Cüzdanım" class="lw-wallet-page" data-testid="wallet-page">
    <section class="lw-wallet-grid" aria-label="Cüzdan ve bonus özeti">
      <article class="lw-wallet-balance-card" data-testid="wallet-balance-card">
        <div class="lw-wallet-card-head">
          <h2>Cüzdan</h2>
          <button type="button" aria-label="Cüzdan hesap hareketleri" @click="goTo('/wallet/history')">
            <AppIcon name="receipt" :size="24" />
          </button>
        </div>
        <p class="lw-wallet-amount">
          <strong>{{ formatCurrency(wallet.workBalance) }}</strong>
          <span>bakiye</span>
        </p>
        <p class="lw-wallet-helper">
          <span class="lw-wallet-dot" aria-hidden="true"></span>
          {{ opportunityLabel }}
        </p>
        <button class="lw-wallet-primary" type="button" data-testid="wallet-top-up-button" @click="goTo('/wallet/top-up')">
          <AppIcon name="plus" :size="19" />
          <span>Bakiye Yükle</span>
        </button>
      </article>

      <article class="lw-wallet-balance-card" data-testid="wallet-bonus-card">
        <div class="lw-wallet-card-head">
          <h2>Bonus</h2>
          <button type="button" aria-label="Bonus hareketleri" @click="goTo('/wallet/history')">
            <AppIcon name="receipt" :size="24" />
          </button>
        </div>
        <p class="lw-wallet-amount">
          <strong>{{ formatCurrency(wallet.bonusBalance) }}</strong>
          <span>bonus</span>
        </p>
        <p class="lw-wallet-helper">
          <span class="lw-wallet-dot is-blue" aria-hidden="true"></span>
          Kredi yüklerken kullanılır.
        </p>
        <button class="lw-wallet-secondary" type="button" data-testid="wallet-bonus-convert-button" @click="openBonusConvert">
          <AppIcon name="refresh" :size="18" />
          <span>Krediye Çevir</span>
        </button>
      </article>
    </section>

    <button class="lw-wallet-info-card" type="button" data-testid="wallet-usage-info" @click="openWalletInfo">
      <span class="lw-wallet-bubble" aria-hidden="true">
        <AppIcon name="sparkles" :size="28" />
      </span>
      <span class="lw-wallet-info-copy">
        <strong>Bakiyenle neler yapabilirsin?</strong>
        <small>Bakiyen, platformdaki fırsatlara erişim sağlar. Ortalama 2-3 hizmet fırsatına ulaşabilirsin.</small>
        <em>Son kullanım: Kombi Servisi · Yenişehir</em>
      </span>
      <AppIcon name="chevron-right" :size="22" />
    </button>

    <section class="lw-wallet-card lw-wallet-topup" data-testid="wallet-quick-topup">
      <div class="lw-wallet-section-head">
        <h2>Hızlı Yükle</h2>
        <button type="button" @click="goTo('/wallet/top-up')">
          <span>Tümü</span>
          <AppIcon name="chevron-right" :size="16" />
        </button>
      </div>
      <div class="lw-wallet-topup-grid">
        <button
          v-for="item in topUpPackages"
          :key="item.amount"
          :class="['lw-wallet-topup-option', { 'is-recommended': item.recommended }]"
          type="button"
          :aria-label="`${formatCurrency(item.amount)} bakiye yükle`"
          @click="selectTopUp(item.amount)"
        >
          <span v-if="item.recommended" class="lw-wallet-badge">Önerilen</span>
          <strong>{{ formatCurrency(item.amount) }}</strong>
          <small>{{ item.label }}</small>
          <em><AppIcon :name="item.icon" :size="17" /></em>
        </button>
      </div>
    </section>

    <section class="lw-wallet-card lw-wallet-transactions" data-testid="wallet-recent-transactions">
      <div class="lw-wallet-section-head">
        <h2>Son Hareketler</h2>
        <button type="button" @click="goTo('/wallet/history')">
          <span>Tümü</span>
          <AppIcon name="chevron-right" :size="16" />
        </button>
      </div>
      <button
        v-for="transaction in recentRows"
        :key="transaction.id"
        :class="['lw-wallet-row', `is-${transaction.tone}`]"
        type="button"
        @click="goTo(`/wallet/transaction/${transaction.id}`)"
      >
        <span class="lw-wallet-row-icon" aria-hidden="true">
          <AppIcon :name="transaction.icon" :size="20" />
        </span>
        <span class="lw-wallet-row-copy">
          <strong>{{ transaction.title }}</strong>
          <small>{{ transaction.description }}</small>
        </span>
        <span class="lw-wallet-row-amount">{{ transaction.amountLabel }}</span>
        <AppIcon name="chevron-right" :size="17" />
      </button>
    </section>

    <section class="lw-wallet-card lw-wallet-package" data-testid="wallet-package-rights">
      <div class="lw-wallet-package-main">
        <span class="lw-wallet-crown" aria-hidden="true"><AppIcon name="crown" :size="30" /></span>
        <span>
          <strong>Gold Paket Aktif</strong>
          <small>30 Haziran 2026 tarihine kadar geçerli</small>
        </span>
        <button type="button" @click="goTo('/subscription')">Paket Detayı</button>
      </div>
      <div class="lw-wallet-pill-row" aria-label="Paket hakları">
        <span><AppIcon name="zap" :size="15" /> Öncelik aktif</span>
        <span><AppIcon name="file-text" :size="15" /> 8 hak kaldı</span>
        <span><AppIcon name="headphones" :size="15" /> Destek öncelikli</span>
      </div>
    </section>

    <section class="lw-wallet-card lw-wallet-link-list" aria-label="Cüzdan bağlantıları">
      <button type="button" @click="goTo('/invoices')">
        <AppIcon name="file-text" :size="24" />
        <span>Faturalarım</span>
        <AppIcon name="chevron-right" :size="18" />
      </button>
      <button type="button" @click="goTo('/wallet/settings')">
        <AppIcon name="credit-card" :size="24" />
        <span>Ödeme Yöntemlerim</span>
        <AppIcon name="chevron-right" :size="18" />
      </button>
      <button type="button" @click="goTo('/support/customer-service')">
        <AppIcon name="help-circle" :size="24" />
        <span>Yardım</span>
        <AppIcon name="chevron-right" :size="18" />
      </button>
    </section>
  </AppPage>
</template>
