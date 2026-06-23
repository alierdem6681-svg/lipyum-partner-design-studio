<script setup>
import AppIcon from "../ui/AppIcon.vue";
import { formatCurrency } from "../../data/walletCalculations.js";

const props = defineProps({
  transaction: { type: Object, required: true },
});

defineEmits(["open"]);

function formatDate(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function iconFor(type) {
  if (type === "top_up") return "plus";
  if (type === "job_purchase") return "briefcase";
  if (type.includes("bonus")) return "gift";
  if (type.includes("failed")) return "alert";
  return "receipt";
}

function toneFor(type, status) {
  if (status === "failed") return "danger";
  if (status === "pending") return "warning";
  if (type === "job_purchase") return "neutral";
  if (type.includes("bonus")) return "warning";
  return "success";
}
</script>

<template>
  <article
    :class="['wallet-transaction-row', `is-${toneFor(transaction.type, transaction.status)}`]"
    data-testid="wallet-transaction-row"
  >
    <button type="button" @click="$emit('open', transaction)">
      <span class="wallet-transaction-row__icon" aria-hidden="true">
        <AppIcon :name="iconFor(transaction.type)" :size="18" />
      </span>
      <span class="wallet-transaction-row__copy">
        <span class="wallet-transaction-row__head">
          <strong class="wallet-transaction-row__title">{{ transaction.title }}</strong>
          <span class="wallet-transaction-row__amount">
            <strong v-if="transaction.amount">
              {{ transaction.direction === "out" ? "-" : "+" }}{{ formatCurrency(transaction.amount) }}
            </strong>
            <strong v-else-if="transaction.bonusAmount">
              +{{ formatCurrency(transaction.bonusAmount) }} bonus
            </strong>
          </span>
        </span>
        <small>{{ transaction.description }}</small>
        <em>{{ formatDate(transaction.createdAt) }}</em>
        <small v-if="transaction.bonusAmount && transaction.amount">Bonus: {{ formatCurrency(transaction.bonusAmount) }}</small>
      </span>
      <AppIcon name="chevron-right" :size="18" aria-hidden="true" />
    </button>
  </article>
</template>
