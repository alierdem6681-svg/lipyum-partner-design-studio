export function renderPerformanceCard({ score = 81, level = "İyi", target = 85, icon = "", actionLabel = "Yükselt" } = {}) {
  return `
    <section class="performance-card">
      <div class="performance-card-head">
        <h3>Performans Skoru</h3>
      </div>
      <div class="performance-card-main">
        ${icon ? `<span class="performance-icon">${icon}</span>` : ""}
        <strong>${score}</strong>
        <span class="score-level">${level}</span>
        <button class="primary-btn" type="button" data-screen="performanceScore">${actionLabel}</button>
      </div>
      <p>${target} puana ulaşmana çok az kaldı.</p>
    </section>
  `;
}
