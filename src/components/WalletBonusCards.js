export function renderWalletBonusCards({ credit = 675, bonus = 240 } = {}) {
  return `
    <section class="wallet-bonus-grid">
      <article class="wallet-mini-card">
        <h3>Cüzdan</h3>
        <p><strong>${credit}</strong> kredi</p>
        <button class="secondary-btn" type="button" data-action="buy-credit">Bakiye Yükle</button>
      </article>
      <article class="wallet-mini-card">
        <h3>Bonus</h3>
        <p><strong>${bonus}</strong> bonus</p>
        <button class="secondary-btn" type="button" data-action="convert-bonus">Krediye Çevir</button>
      </article>
    </section>
  `;
}
