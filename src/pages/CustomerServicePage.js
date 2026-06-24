import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";

export function CustomerServicePage({
  icon = () => "",
} = {}) {
  return PageContainer({
    className: "customer-service-page",
    children: `
      ${Header({
        title: "Müşteri Hizmetleri",
        subtitle: "Plus, Gold ve VIP üyelerine özel",
        showBack: true,
        backIcon: icon("chevron-left"),
        rightAction: `
          <span class="premium-header-icon page-header-action" data-testid="premium-member-icon" aria-hidden="true">
            ${icon("crown")}
          </span>
        `,
      })}
      <section class="customer-service-hero" data-testid="customer-service-page" aria-labelledby="customer-service-title">
        <span class="customer-service-kicker">
          ${icon("star")}
          ÜYE AYRICALIĞI
        </span>
        <p class="customer-service-tier" aria-label="Plus, Gold ve VIP üyelerine özel">
          <span>PLUS</span>
          <span aria-hidden="true">•</span>
          <span>GOLD</span>
          <span aria-hidden="true">•</span>
          <strong>VIP</strong>
        </p>
        <div class="customer-service-divider" aria-hidden="true">
          <span></span>
          ${icon("crown")}
          <span></span>
        </div>
        <div class="customer-service-copy">
          <h2 id="customer-service-title">Üyeliğinin ayrıcalığı burada.</h2>
          <p>Lipyum Plus, Gold ve VIP üyeleri müşteri hizmetlerine tek dokunuşla ulaşabilir.</p>
        </div>
        <div class="customer-service-contact">
          <span class="customer-service-contact-icon" aria-hidden="true">${icon("headphones")}</span>
          <p>Lipyum Müşteri Hizmetleri</p>
          <strong data-testid="customer-service-phone-number">444 23 68</strong>
        </div>
        <a class="customer-service-call" data-testid="customer-service-call" href="tel:4442368" aria-label="444 23 68 numarasını ara">
          ${icon("phone")}
          <span>444 23 68’i Ara</span>
        </a>
        <p class="customer-service-note">
          ${icon("shield")}
          Arama telefon uygulamanda başlatılır.
        </p>
      </section>
    `,
  });
}
