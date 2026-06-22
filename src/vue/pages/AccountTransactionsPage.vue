<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const batchSize = 14;
const visibleCount = ref(batchSize);
const sentinelRef = ref(null);
let observer;

const transactionSeed = [
  ["İş Gönderimi", "22.06.2026 14:42", -850, 3650, "send"],
  ["Bakiye Yükleme", "22.06.2026 12:18", 2500, 4500, "wallet"],
  ["Nakde Çevrilen Bonus", "21.06.2026 18:05", -600, 2000, "gift"],
  ["İş İptali", "21.06.2026 10:31", 300, 2600, "x"],
  ["İş Gönderimi", "20.06.2026 16:22", -720, 2300, "send"],
  ["Bakiye Yükleme", "20.06.2026 09:14", 1500, 3020, "wallet"],
  ["İş Gönderimi", "19.06.2026 17:48", -640, 1520, "send"],
  ["Nakde Çevrilen Bonus", "19.06.2026 11:07", -250, 2160, "gift"],
  ["İş Gönderimi", "18.06.2026 15:35", -780, 2410, "send"],
  ["İş İptali", "18.06.2026 13:12", 180, 3190, "x"],
  ["Bakiye Yükleme", "17.06.2026 10:02", 1000, 3010, "wallet"],
  ["İş Gönderimi", "16.06.2026 19:28", -420, 2010, "send"],
  ["İş Gönderimi", "16.06.2026 13:54", -560, 2430, "send"],
  ["Nakde Çevrilen Bonus", "15.06.2026 20:10", -300, 2990, "gift"],
  ["Bakiye Yükleme", "15.06.2026 09:35", 3000, 3290, "wallet"],
  ["İş Gönderimi", "14.06.2026 18:16", -900, 290, "send"],
  ["İş İptali", "14.06.2026 12:44", 450, 1190, "x"],
  ["İş Gönderimi", "13.06.2026 16:08", -520, 740, "send"],
  ["Bakiye Yükleme", "13.06.2026 08:51", 1250, 1260, "wallet"],
  ["İş Gönderimi", "12.06.2026 17:22", -640, 10, "send"],
  ["Nakde Çevrilen Bonus", "12.06.2026 11:36", -180, 650, "gift"],
  ["İş Gönderimi", "11.06.2026 15:01", -700, 830, "send"],
  ["İş İptali", "11.06.2026 10:19", 220, 1530, "x"],
  ["Bakiye Yükleme", "10.06.2026 09:00", 2000, 1310, "wallet"],
  ["İş Gönderimi", "09.06.2026 17:40", -540, -690, "send"],
  ["Bakiye Yükleme", "09.06.2026 08:28", 1500, -150, "wallet"],
  ["İş Gönderimi", "08.06.2026 14:15", -620, -1650, "send"],
  ["Nakde Çevrilen Bonus", "08.06.2026 10:06", -400, -1030, "gift"],
  ["İş İptali", "07.06.2026 16:55", 260, -630, "x"],
  ["İş Gönderimi", "07.06.2026 12:37", -480, -890, "send"],
  ["Bakiye Yükleme", "06.06.2026 09:21", 1000, -410, "wallet"],
  ["İş Gönderimi", "05.06.2026 18:04", -530, -1410, "send"],
  ["Nakde Çevrilen Bonus", "05.06.2026 11:46", -210, -880, "gift"],
  ["İş Gönderimi", "04.06.2026 15:17", -760, -670, "send"],
  ["Bakiye Yükleme", "04.06.2026 09:09", 2500, 90, "wallet"],
  ["İş Gönderimi", "03.06.2026 17:58", -650, -2410, "send"],
  ["İş İptali", "03.06.2026 13:20", 300, -1760, "x"],
  ["İş Gönderimi", "02.06.2026 16:38", -430, -2060, "send"],
  ["Bakiye Yükleme", "02.06.2026 08:55", 1200, -1630, "wallet"],
  ["İş Gönderimi", "01.06.2026 18:31", -510, -2830, "send"],
];

const transactions = transactionSeed.map(([type, dateTime, amount, balance, icon], index) => ({
  id: `tx-${index + 1}`,
  type,
  dateTime,
  amount,
  balance,
  icon,
  tone: amount >= 0 ? "positive" : "negative",
}));

const visibleTransactions = computed(() => transactions.slice(0, visibleCount.value));
const hasMore = computed(() => visibleCount.value < transactions.length);

function formatMoney(value) {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
}

function loadMore() {
  if (!hasMore.value) return;
  visibleCount.value = Math.min(visibleCount.value + batchSize, transactions.length);
}

function setupObserver() {
  observer?.disconnect();
  if (!sentinelRef.value || typeof IntersectionObserver === "undefined") return;
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) loadMore();
    },
    { root: document.querySelector("#appRoot"), rootMargin: "120px" },
  );
  observer.observe(sentinelRef.value);
}

onMounted(() => nextTick(setupObserver));
onBeforeUnmount(() => observer?.disconnect());
watch(visibleCount, () => nextTick(setupObserver));
</script>

<template>
  <AppPage title="Hesap Hareketleri" data-testid="account-transactions-page">
    <section class="account-transactions-page">
      <div class="account-transactions-summary" aria-label="Hesap hareketleri özeti">
        <span>
          <small>Güncel kalan</small>
          <strong><em>₺</em> 3.650</strong>
        </span>
        <span>
          <small>Bu ay işlem</small>
          <strong>{{ transactions.length }}</strong>
        </span>
      </div>

      <div class="account-ledger-card">
        <div class="account-ledger-head" role="row">
          <span>İşlem tipi</span>
          <span>Tutar</span>
          <span>Kalan</span>
        </div>

        <div class="account-ledger-list" role="table" aria-label="Hesap hareketleri">
          <article
            v-for="transaction in visibleTransactions"
            :key="transaction.id"
            class="account-ledger-row"
            role="row"
            data-testid="account-transaction-row"
          >
            <span class="account-ledger-type" role="cell">
              <i :class="['account-ledger-icon', `is-${transaction.icon}`]">
                <AppIcon :name="transaction.icon" :size="16" />
              </i>
              <span>
                <strong>{{ transaction.type }}</strong>
                <small>{{ transaction.dateTime }}</small>
              </span>
            </span>
            <span :class="['account-ledger-money', transaction.tone]" role="cell">
              <em>{{ transaction.amount >= 0 ? '+' : '-' }}₺</em>{{ formatMoney(transaction.amount) }}
            </span>
            <span class="account-ledger-money balance" role="cell">
              <em>₺</em>{{ formatMoney(transaction.balance) }}
            </span>
          </article>
        </div>

        <div ref="sentinelRef" class="account-ledger-sentinel" aria-hidden="true"></div>
        <p class="account-ledger-load-note" aria-live="polite">
          {{ hasMore ? "Aşağı indikçe daha fazla hareket yüklenir." : "Tüm hesap hareketleri yüklendi." }}
        </p>
      </div>
    </section>
  </AppPage>
</template>
