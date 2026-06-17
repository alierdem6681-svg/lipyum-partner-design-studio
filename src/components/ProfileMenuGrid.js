const spriteIcon = (name) => `<svg class="icon"><use href="#i-${name}"></use></svg>`;

export function ProfileMenuGrid({ items = [], icon = spriteIcon } = {}) {
  return `
    <section class="profile-menu-section" aria-label="Müşteriye görünen profil menüleri">
      <div class="profile-menu-grid">
        ${items.map((item) => `
          <button
            type="button"
            class="profile-menu-card"
            data-route="${item.route}"
            aria-label="${item.label}"
          >
            <span class="profile-menu-icon-wrap" aria-hidden="true">${item.svg || icon(item.icon || "chevron-right")}</span>
            <span class="profile-menu-label">${item.label}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}
