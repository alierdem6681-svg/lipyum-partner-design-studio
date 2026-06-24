<script setup>
import AppPage from "../components/ui/AppPage.vue";
import WalletSummaryPanel from "../components/wallet/WalletSummaryPanel.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();

function openInfoSheet(title, body) {
  shell.openSheet({
    title,
    description: "Bilgi",
    body,
  });
}

function openConvertSheet() {
  shell.openSheet({
    type: "bonus-convert",
    title: "Krediye Çevir",
    description: "Bonusunu en avantajlı şekilde kullan.",
  });
}
</script>

<template>
  <AppPage title="Cüzdan" data-testid="wallet-page">
    <div class="v-stack v-wallet-page-stack">
      <WalletSummaryPanel
        test-id="wallet-summary-card"
        bonus-test-id="wallet-bonus-card"
        @wallet-info="openInfoSheet('Cüzdan', 'Kredilerini iş almak ve teklif vermek için kullanırsın.')"
        @bonus-info="openInfoSheet('Bonus', 'Bonuslarını kredi yüklerken kullanabilirsin.')"
        @credit="openInfoSheet('Bakiye Yükle', 'Bakiye yükleme alanı bu sayfada sade başlangıç olarak tutuluyor.')"
        @convert="openConvertSheet"
      />
    </div>
  </AppPage>
</template>
