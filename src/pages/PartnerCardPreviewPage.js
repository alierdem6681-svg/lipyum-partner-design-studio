import { PageContainer } from "../components/PageContainer.js";
import { PartnerPublicBadge } from "../components/PartnerPublicBadge.js";
import { partnerProfile } from "../data/mockData.js";

export function PartnerCardPreviewPage({ icon = () => "" } = {}) {
  const previewPartner = {
    ...partnerProfile,
    tier: "Lipyum Gold Partner",
  };

  return PageContainer({
    className: "partner-card-preview-page",
    children: `
      <section class="partner-card-preview-shell" data-testid="partner-card-preview" aria-label="Partner kartı önizleme">
        <div class="partner-preview-topbar" aria-label="Önizleme aksiyonları">
          <button class="partner-preview-close" type="button" data-action="go-back" data-testid="back-button" aria-label="Önizlemeyi kapat">
            ${icon("x")}
          </button>
          <button class="partner-preview-share" type="button" data-action="open-partner-share" data-testid="partner-preview-share">
            ${icon("share")} Paylaş
          </button>
        </div>
        ${PartnerPublicBadge({ partner: previewPartner, icon, showAllBadges: true })}
        <div class="partner-preview-empty" aria-hidden="true"></div>
      </section>
    `,
  });
}
