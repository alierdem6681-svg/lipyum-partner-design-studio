import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";

const supportPhoneNumber = "4442368";
const supportPhoneLabel = "444 23 68";

export function CustomerServicePage({
  hasAccess = false,
  callStarted = false,
  subscriptionLabel = "",
  icon = () => "",
} = {}) {
  const planLabel = subscriptionLabel || "Pro abonelik";

  return PageContainer({
    className: "customer-service-page",
    children: `
      ${Header({
        title: "Müşteri Hizmetleri",
        subtitle: "Öncelikli telefon desteği",
        showBack: true,
        backIcon: icon("chevron-left"),
      })}
      <section class="customer-service-hero ui-card" data-testid="customer-service-page">
        <div class="customer-service-hero-copy">
          <span class="customer-service-eyebrow">${icon("sparkles")} Öncelikli destek hattı</span>
          <h2>Bekleme yok. Dağınık mesaj yok. Direkt çözüm.</h2>
          <p>Müşteri, iş ve ödeme konularında hızlı karar gerektiğinde telefon hattı ücretli aboneler için öne alınır.</p>
        </div>
        <div class="customer-service-hero-art" aria-hidden="true">
          <span>${icon("phone")}</span>
          <strong>3 dk</strong>
          <small>hedef dönüş</small>
        </div>
      </section>

      <section class="customer-service-phone-card ui-card ${hasAccess ? "has-access" : ""}" aria-label="Müşteri hizmetleri telefonu">
        <div class="customer-service-phone-copy">
          <span class="customer-service-phone-icon">${icon(hasAccess ? "phone" : "crown")}</span>
          <div>
            <small>Müşteri hizmetleri numarası</small>
            <strong data-testid="customer-service-phone-number">${supportPhoneLabel}</strong>
          </div>
        </div>
        <p>${hasAccess
          ? `${planLabel} üyeliğin aktif. Bu numaradan müşteri hizmetlerine doğrudan bağlanabilirsin.`
          : "Bu numara herkes tarafından görülebilir; telefonla ulaşım sadece ücretli abonelerde aktifleşir."}</p>
        ${hasAccess ? `
          <a class="primary-btn" href="tel:${supportPhoneNumber}" data-action="start-customer-service-call" data-testid="customer-service-call">
            ${icon("phone")} Telefonla ara
          </a>
          ${callStarted ? `
            <div class="customer-service-call-status" role="status" aria-live="polite">
              ${icon("check")} Arama başlatılıyor
            </div>
          ` : ""}
        ` : `
          <button class="primary-btn customer-service-upgrade-btn" type="button" data-route="/subscription" data-testid="customer-service-upgrade">
            ${icon("crown")} Telefon desteğini aç
          </button>
        `}
      </section>

      <section class="customer-service-proof-grid" aria-label="Abonelik avantajları">
        <article>
          <span>${icon("zap")}</span>
          <strong>Öncelik sırası</strong>
          <small>Acil işlerde destek kuyruğunda öne çık.</small>
        </article>
        <article>
          <span>${icon("shield")}</span>
          <strong>Daha net çözüm</strong>
          <small>Kredi, ilan ve müşteri konularını tek görüşmede toparla.</small>
        </article>
        <article>
          <span>${icon("trend-up")}</span>
          <strong>Daha çok iş odağı</strong>
          <small>Destek beklerken kaçan fırsatları azalt.</small>
        </article>
      </section>

      <section class="customer-service-sales-card ui-card">
        <div>
          <span class="customer-service-eyebrow">${icon("crown")} Üyelik etkisi</span>
          <h3>Telefon desteği, yoğun günde kendini amorti eder.</h3>
          <p>Bir iş kaçırmamak, yanlış paket kullanmamak veya ödeme konusunu hızlı netleştirmek çoğu zaman paketin değerini çıkarır.</p>
        </div>
        <div class="customer-service-sales-metrics" aria-label="Öne çıkan faydalar">
          <span><strong>1</strong><small>tek aramayla net aksiyon</small></span>
          <span><strong>VIP</strong><small>telefon destek hattı</small></span>
        </div>
        ${hasAccess ? `
          <button class="secondary-btn" type="button" data-route="/subscription">Paketimi görüntüle</button>
        ` : `
          <button class="primary-btn" type="button" data-route="/subscription" data-testid="customer-service-plans">
            ${icon("sparkles")} Abonelikleri incele
          </button>
        `}
      </section>
    `,
  });
}
