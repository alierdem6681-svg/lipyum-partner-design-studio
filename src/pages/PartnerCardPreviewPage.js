import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";
import { PartnerEmbedCard, PartnerPublicBadge } from "../components/PartnerPublicBadge.js";
import { partnerProfile } from "../data/mockData.js";

export function PartnerCardPreviewPage({ icon = () => "" } = {}) {
  return PageContainer({
    className: "partner-card-preview-page",
    children: `
      ${Header({
        title: "Partner Kartı",
        subtitle: "Public rozet ve paylaşım önizlemesi",
        showBack: true,
        backIcon: icon("chevron-left"),
      })}
      <section class="partner-preview-hero" data-testid="partner-card-preview">
        <span class="partner-preview-kicker">${icon("sparkles")} Public profil rozeti</span>
        <h2>Müşterilere güven veren partner kartın</h2>
        <p>Bu alan web sitesi, sosyal medya ve müşteri mesajlarında kullanılacak rozetin mock önizlemesidir.</p>
      </section>
      ${PartnerPublicBadge({ partner: partnerProfile, icon })}
      ${PartnerEmbedCard({ partner: partnerProfile, icon })}
      <div class="partner-share-actions">
        <button class="primary-btn" type="button" data-action="copy-partner-profile-link" data-testid="partner-preview-copy">${icon("copy")} Profil linkini kopyala</button>
        <button class="secondary-btn" type="button" data-route="/profile">${icon("user")} Profile dön</button>
      </div>
    `,
  });
}
