import { escapeHtml } from "../utils/dom.js";

const fallbackIcon = (name) => `<svg class="icon"><use href="#i-${name}"></use></svg>`;

export function PartnerPublicBadge({
  partner,
  icon = fallbackIcon,
  compact = false,
} = {}) {
  const safeName = escapeHtml(partner?.name || "Ahmet Kaya");
  const safeTier = escapeHtml(partner?.tier || "Gold Partner");
  const rating = escapeHtml(partner?.rating || "4.8");
  const reviews = escapeHtml(String(partner?.reviewCount || 126));
  const badges = (partner?.badges || []).slice(0, compact ? 2 : 3);

  return `
    <article class="partner-public-badge ${compact ? "is-compact" : ""}" data-testid="partner-public-badge">
      <span class="partner-public-avatar" aria-hidden="true">
        ${partner?.avatar ? `<img src="${escapeHtml(partner.avatar)}" alt="" />` : safeName.slice(0, 2).toUpperCase()}
      </span>
      <span class="partner-public-copy">
        <strong>${safeName}</strong>
        <small>${icon("crown")} ${safeTier}</small>
        <em>${icon("star")} ${rating} Puan · ${reviews} Değerlendirme</em>
      </span>
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
  return `
    <section class="sheet partner-share-sheet" role="dialog" aria-label="Partner kartını paylaş">
      <div class="sheet-head">
        <div>
          <h3>Partner kartını paylaş</h3>
          <p>Müşterilere ve web sitene güven veren rozetini ekle.</p>
        </div>
        <button class="icon-btn icon-only-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
      </div>
      ${PartnerPublicBadge({ partner, icon })}
      <div class="partner-share-actions">
        <button class="primary-btn" type="button" data-action="copy-partner-profile-link" data-testid="partner-copy-link">${icon("copy")} Profil linkini kopyala</button>
        <button class="secondary-btn" type="button" data-route="/partner-card-preview" data-testid="partner-preview-link">${icon("eye")} Önizle</button>
        <button class="secondary-btn" type="button" data-action="share-partner-whatsapp" data-testid="partner-share-whatsapp">${icon("message")} WhatsApp paylaş</button>
      </div>
      ${PartnerEmbedCard({ partner, icon })}
    </section>
  `;
}
