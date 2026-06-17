const spriteIcon = (name) => `<svg class="icon"><use href="#i-${name}"></use></svg>`;

export function renderProfileCard({
  name = "Ahmet Kaya",
  tier = "Gold Partner",
  rating = "4.8",
  reviewCount = 126,
  avatar = "",
  badges = [],
  badgesExpanded = false,
  icon = spriteIcon,
} = {}) {
  const visibleBadges = badges.slice(0, 3);
  const extraBadges = badges.slice(3);
  const moreCount = extraBadges.length;

  return `
    <section class="partner-profile-card">
      <div class="partner-profile-main">
        <button class="partner-profile-avatar-btn" type="button" aria-label="Profil fotoğrafı ekle">
          ${avatar ? `<img src="${avatar}" alt="${name} profil fotoğrafı" />` : `<span>${name.slice(0, 2).toUpperCase()}</span>`}
          <span class="partner-profile-add" aria-hidden="true">${icon("plus")}</span>
        </button>
        <div class="partner-profile-copy">
          <h3 class="partner-profile-name">${name}</h3>
          <span class="partner-profile-tier">${icon("crown")} ${tier}</span>
          <span class="partner-profile-rating">${icon("star")} ${rating} Puan <span aria-hidden="true">·</span> ${reviewCount} Değerlendirme</span>
        </div>
      </div>
      <div class="partner-profile-chips ${badgesExpanded ? "is-expanded" : ""}" aria-label="Profil rozetleri">
        ${visibleBadges.map((badge) => `<span class="partner-profile-chip">${badge.icon ? icon(badge.icon) : ""} ${badge.label}</span>`).join("")}
        ${moreCount && !badgesExpanded ? `
          <button
            class="partner-profile-chip is-more"
            type="button"
            data-action="toggle-profile-badges"
            aria-expanded="false"
            aria-label="Ek rozetleri göster"
          ><span>+${moreCount}</span></button>
        ` : ""}
        ${badgesExpanded && extraBadges.length ? `
          <span class="partner-profile-chip-break" aria-hidden="true"></span>
          ${extraBadges.map((badge) => `<span class="partner-profile-chip is-extra">${badge.icon ? icon(badge.icon) : ""} ${badge.label}</span>`).join("")}
        ` : ""}
      </div>
    </section>
  `;
}
