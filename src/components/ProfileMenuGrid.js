const spriteIcon = (name) => `<svg class="icon"><use href="#i-${name}"></use></svg>`;

const menuDetails = {
  "/about": {
    description: "Profil bilgilerinizi tamamlayın",
    status: "Tamam",
    tone: "success",
  },
  "/photo-gallery": {
    description: "Daha fazla görsel ekleyin",
    status: "+4 puan",
    tone: "success",
  },
  "/services": {
    description: "Hizmet kapsamınızı netleştirin",
    status: "Tamam",
    tone: "success",
  },
  "/regions": {
    description: "Hizmet bölgelerinizi seçin",
    status: "Eksik",
    tone: "warning",
  },
  "/working-hours": {
    description: "Müsaitlik saatlerinizi ayarlayın",
    status: "Tamam",
    tone: "success",
  },
  "/team": {
    description: "Ekibinizi ekleyin",
    status: "+2 puan",
    tone: "success",
  },
  "/capacity": {
    description: "Günlük kapasitenizi belirleyin",
    status: "Tamam",
    tone: "success",
  },
  "/strategy": {
    description: "Büyüme önerilerini inceleyin",
    status: "Yeni",
    tone: "info",
  },
};

export function ProfileMenuGrid({ items = [], icon = spriteIcon } = {}) {
  return `
    <section class="profile-menu-section" data-testid="profile-menu-section" aria-label="Müşteriye görünen profil menüleri">
      <div class="profile-menu-list" data-testid="profile-menu-list">
        ${items.map((item) => {
          const detail = menuDetails[item.route] || {};
          return `
          <button
            type="button"
            class="profile-menu-row"
            data-testid="profile-menu-card"
            data-route="${item.route}"
            aria-label="${item.label}"
          >
            <span class="profile-menu-row__icon" aria-hidden="true">${item.svg || icon(item.icon || "chevron-right")}</span>
            <span class="profile-menu-row__copy">
              <span class="profile-menu-row__title">${item.label}</span>
              <span class="profile-menu-row__description">${detail.description || ""}</span>
            </span>
            <span class="profile-menu-row__status is-${detail.tone || "success"}">${detail.status || "Tamam"}</span>
            <span class="profile-menu-row__chevron" aria-hidden="true">${icon("chevron-right")}</span>
          </button>
        `;
        }).join("")}
      </div>
      <article class="profile-menu-strength-summary" data-testid="profile-menu-strength-summary" aria-label="Profil gücü özeti">
        <span class="profile-menu-strength-summary__ring" aria-hidden="true"><strong>78%</strong></span>
        <span class="profile-menu-strength-summary__copy">
          <strong>Profil Gücünüz</strong>
          <small>Harika! Sadece 2 adım kaldı.</small>
        </span>
        <span class="profile-menu-strength-summary__points">
          <strong>+28</strong>
          <small>Puan</small>
        </span>
      </article>
    </section>
  `;
}
