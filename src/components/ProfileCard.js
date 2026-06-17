export function renderProfileCard({ name = "Ahmet Kaya", tier = "Gold Partner", rating = "4.8", reviewCount = 126, avatar = "", chips = [] } = {}) {
  return `
    <section class="partner-profile-card">
      <div class="partner-profile-main">
        <button class="partner-profile-avatar-btn" type="button" aria-label="Profil fotoğrafı ekle">
          ${avatar ? `<img src="${avatar}" alt="${name} profil fotoğrafı" />` : `<span>${name.slice(0, 2).toUpperCase()}</span>`}
          <span class="partner-profile-add" aria-hidden="true">+</span>
        </button>
        <div class="partner-profile-copy">
          <h3 class="partner-profile-name">${name}</h3>
          <span class="partner-profile-tier">${tier}</span>
          <span class="partner-profile-rating">${rating} Puan · ${reviewCount} Değerlendirme</span>
        </div>
      </div>
      <div class="partner-profile-chips">
        ${chips.map((chip) => `<span class="partner-profile-chip">${chip}</span>`).join("")}
      </div>
    </section>
  `;
}
