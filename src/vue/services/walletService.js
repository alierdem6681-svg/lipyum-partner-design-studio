export async function mockDelay(result, delay = 180) {
  await new Promise((resolve) => window.setTimeout(resolve, delay));
  return result;
}

export const walletService = {
  fetchWallet(state) {
    return mockDelay(state, 120);
  },
  fetchTransactions(transactions) {
    return mockDelay(transactions, 120);
  },
  createTopUp(summary) {
    return mockDelay({ ok: true, summary }, 260);
  },
  retryTopUp(transaction) {
    return mockDelay({ ok: true, transaction }, 240);
  },
  fetchTransactionDetail(transaction) {
    return mockDelay(transaction, 120);
  },
  updateLowBalanceAlert(config) {
    return mockDelay({ ok: true, config }, 120);
  },
  updateAutoTopUp(config) {
    return mockDelay({ ok: true, config }, 120);
  },
  disableAutoTopUp() {
    return mockDelay({ ok: true }, 120);
  },
};

