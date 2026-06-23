import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";

const supportPhoneNumber = "4442368";
const supportPhoneLabel = "444 23 68";

export function CustomerServicePage({ icon = () => "" } = {}) {
  return PageContainer({
    className: "customer-service-page",
    children: `
      ${Header({
        title: "Müşteri Hizmetleri",
        subtitle: "Telefon ve destek kanalları",
        showBack: true,
        backIcon: icon("chevron-left"),
      })}
      <section class="customer-service-hero ui-card" data-testid="customer-service-page">
        <div class="customer-service-hero-copy">
          <span class="customer-service-eyebrow">${icon("headphones")} Destek hattı</span>
          <h2>İş, müşteri ve ödeme konularında destek al.</h2>
          <p>Ekibimizle telefon, yazılı talep veya canlı destek üzerinden iletişime geçebilirsin.</p>
        </div>
        <div class="customer-service-hero-art" aria-hidden="true">
          <span>${icon("phone")}</span>
          <strong>444</strong>
          <small>destek hattı</small>
        </div>
      </section>

      <section class="customer-service-phone-card ui-card has-access" aria-label="Müşteri hizmetleri telefonu">
        <div class="customer-service-phone-copy">
          <span class="customer-service-phone-icon">${icon("phone")}</span>
          <div>
            <small>Müşteri hizmetleri numarası</small>
            <strong data-testid="customer-service-phone-number">${supportPhoneLabel}</strong>
          </div>
        </div>
        <p>Bu numaradan müşteri hizmetlerine doğrudan ulaşabilirsin.</p>
        <a class="primary-btn" href="tel:${supportPhoneNumber}" data-action="start-customer-service-call" data-testid="customer-service-call">
          ${icon("phone")} Telefonla ara
        </a>
      </section>
    `,
  });
}
