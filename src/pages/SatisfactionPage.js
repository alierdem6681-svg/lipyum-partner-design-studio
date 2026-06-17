import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";

function stars(selected = 0) {
  return Array.from({ length: 5 }, (_, index) => {
    const rating = index + 1;
    return `
      <button
        class="satisfaction-star ${rating <= selected ? "is-selected" : ""}"
        type="button"
        data-action="set-satisfaction-rating"
        data-rating="${rating}"
        aria-label="${rating} yıldız"
      >★</button>
    `;
  }).join("");
}

export function SatisfactionPage({ rating = 0, submitted = false, storeOpened = false, icon = () => "" } = {}) {
  const isPromoter = Number(rating) === 5;
  const hasRating = Number(rating) > 0;

  return PageContainer({
    className: "satisfaction-page",
    children: `
      ${Header({
        title: "Memnuniyet",
        subtitle: "Lipyum deneyimini değerlendir",
        showBack: true,
        backIcon: icon("chevron-left"),
      })}
      <section class="satisfaction-card" data-testid="satisfaction-page">
        <span class="satisfaction-icon">${icon("star")}</span>
        <h2>Lipyum deneyimini nasıl değerlendirirsin?</h2>
        <p>Geri bildirimin arayüz ve hizmet akışını iyileştirmek için kullanılır.</p>
        <div class="satisfaction-stars" data-testid="satisfaction-stars">
          ${stars(Number(rating))}
        </div>
        ${!hasRating ? `<small class="satisfaction-note">Devam etmek için yıldız seç.</small>` : ""}

        ${hasRating && !submitted ? isPromoter ? `
          <section class="satisfaction-panel" data-testid="store-review-panel">
            <strong>Harika, bunu mağazada paylaşmak ister misin?</strong>
            <p>Yorum yalnızca sen onaylarsan mağaza sayfasında başlatılır. Bu prototipte native review aksiyonu mock olarak gösterilir.</p>
            <button class="primary-btn" type="button" data-action="open-store-review" data-testid="store-review-cta">${icon("star")} Mağazada Değerlendir</button>
          </section>
        ` : `
          <section class="satisfaction-panel" data-testid="satisfaction-improvement-form">
            <strong>Neyi geliştirebiliriz?</strong>
            <select data-testid="satisfaction-reason">
              <option>İş fırsatları</option>
              <option>Destek süreci</option>
              <option>Cüzdan / kredi</option>
              <option>Uygulama kullanımı</option>
            </select>
            <textarea rows="3" data-testid="satisfaction-comment" placeholder="Kısaca anlat">Deneyimin daha iyi olması için dönüş bekliyorum.</textarea>
            <button class="primary-btn" type="button" data-action="submit-satisfaction" data-testid="satisfaction-submit">Geri Bildirim Gönder</button>
          </section>
        ` : ""}

        ${submitted ? `
          <section class="satisfaction-success" data-testid="satisfaction-success">
            ${icon("check")}
            <strong>Geri bildirimin destek ekibine iletildi.</strong>
            <small>Mock kayıt no: LP-SAT-0007</small>
          </section>
        ` : ""}

        ${storeOpened ? `
          <section class="satisfaction-success" data-testid="store-review-success">
            ${icon("check")}
            <strong>Mağaza değerlendirme akışı hazırlandı.</strong>
            <small>Bu prototipte harici market sayfası açılmaz.</small>
          </section>
        ` : ""}
      </section>
    `,
  });
}
