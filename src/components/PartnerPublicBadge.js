import { escapeHtml } from "../utils/dom.js";

const fallbackIcon = (name) => `<svg class="icon"><use href="#i-${name}"></use></svg>`;

export function PartnerPublicBadge({
  partner,
  icon = fallbackIcon,
  compact = false,
  showAllBadges = false,
  partnerSeal = false,
} = {}) {
  const safeName = escapeHtml(partner?.name || "Ahmet Kaya");
  const safeTier = escapeHtml(partner?.tier || "Gold Partner");
  const rating = escapeHtml(partner?.rating || "4.8");
  const reviews = escapeHtml(String(partner?.reviewCount || 126));
  const allBadges = partner?.badges || [];
  const badges = showAllBadges ? allBadges : allBadges.slice(0, compact ? 2 : 3);

  return `
    <article class="partner-public-badge ${compact ? "is-compact" : ""} ${partnerSeal ? "is-partner-seal" : ""}" data-testid="partner-public-badge">
      <span class="partner-public-avatar" aria-hidden="true">
        ${partner?.avatar ? `<img src="${escapeHtml(partner.avatar)}" alt="" />` : safeName.slice(0, 2).toUpperCase()}
      </span>
      <span class="partner-public-copy">
        <strong>${safeName}</strong>
        <small>${icon("crown")} ${safeTier}</small>
        <em>${icon("star")} ${rating} Puan · ${reviews} Değerlendirme</em>
      </span>
      ${partnerSeal ? `
        <span class="partner-public-seal" data-testid="partner-public-seal">
          ${icon("shield")}
          <span>
            <strong>Lipyum Partneri</strong>
            <small>Güven veren profesyonel profil</small>
          </span>
        </span>
      ` : ""}
      <span class="partner-public-chips">
        ${badges.map((badge) => `<span>${badge.icon ? icon(badge.icon) : ""}${escapeHtml(badge.label)}</span>`).join("")}
      </span>
    </article>
  `;
}

export function PartnerEmbedCard({ partner, icon = fallbackIcon } = {}) {
  const embedCode = `<iframe src="https://lipyum.com/partner/ahmet-kaya/badge" width="320" height="140" loading="lazy"></iframe>`;

  return `
    <section class="partner-embed-card" data-testid="partner-embed-card">
      <div class="partner-embed-head">
        <span>${icon("copy")}</span>
        <div>
          <strong>Web sitene partner kartını ekle</strong>
          <small>Referans, güven ve hızlı iletişim için küçük rozet kodu.</small>
        </div>
      </div>
      ${PartnerPublicBadge({ partner, icon, compact: true })}
      <code>${escapeHtml(embedCode)}</code>
      <button class="secondary-btn" type="button" data-action="copy-partner-embed" data-testid="partner-copy-embed">${icon("copy")} Embed kodunu kopyala</button>
    </section>
  `;
}

export function PartnerSharePanel({ partner, icon = fallbackIcon } = {}) {
  const options = [
    {
      label: "WhatsApp'tan gönder",
      description: "Müşteriye güven kartını mesaj olarak ilet.",
      icon: "message",
      action: "share-partner-whatsapp",
      testId: "partner-share-whatsapp",
    },
    {
      label: "Web siteme ekle",
      description: "Rozet embed kodunu web siten için hazırla.",
      icon: "copy",
      action: "copy-partner-embed",
      testId: "partner-share-website",
    },
    {
      label: "Sosyal medya gönderisi",
      description: "Kare gönderi metni ve görselini hazırla.",
      icon: "share",
      action: "share-partner-social-post",
      testId: "partner-share-social-post",
    },
    {
      label: "Hikaye olarak paylaş",
      description: "Dikey hikaye formatını paylaşmaya hazırla.",
      icon: "sparkles",
      action: "share-partner-story",
      testId: "partner-share-story",
    },
  ];

  return `
    <section class="sheet partner-share-sheet" role="dialog" aria-label="Partner kartını paylaş">
      <div class="sheet-head">
        <div>
          <h3>Nasıl paylaşmak istiyorsun?</h3>
          <p>Önizlediğin partner kartı için paylaşım biçimini seç.</p>
        </div>
        <button class="icon-btn icon-only-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
      </div>
      <div class="partner-share-option-list">
        ${options.map((option) => `
          <button class="partner-share-option" type="button" data-action="${option.action}" data-testid="${option.testId}">
            <span>${icon(option.icon)}</span>
            <span>
              <strong>${escapeHtml(option.label)}</strong>
              <small>${escapeHtml(option.description)}</small>
            </span>
            ${icon("chevron-right")}
          </button>
        `).join("")}
      </div>
    </section>
  `;
}
