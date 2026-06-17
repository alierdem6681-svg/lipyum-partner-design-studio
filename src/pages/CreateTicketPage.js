import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";

const ticketCategories = ["İş İtirazı", "Ödeme Sorunu", "Bonus Sorunu", "Müşteri Sorunu", "Teknik Sorun"];
const priorityOptions = ["Normal", "Öncelikli", "Acil"];

export function CreateTicketPage({ created = false, icon = () => "" } = {}) {
  return PageContainer({
    className: "support-new-page",
    children: `
      ${Header({
        title: "Talep Oluştur",
        subtitle: "Sorununu seç, hızlıca takip edelim.",
        showBack: true,
        backIcon: icon("chevron-left"),
      })}
      <section class="ticket-hero-card">
        <span class="ticket-hero-icon" aria-hidden="true">${icon(created ? "check" : "file-text")}</span>
        <span>
          <strong>${created ? "Talep takipte" : "Hızlı destek talebi"}</strong>
          <small>${created ? "Talebin oluşturuldu; ekibimiz konuya dönecek." : "Kategori, kısa konu ve öncelik seçerek destek kaydı aç."}</small>
        </span>
      </section>
      ${created ? `
        <section class="ticket-success-card" data-testid="support-ticket-success">
          <span class="ticket-success-icon">${icon("check")}</span>
          <h2>Talebin oluşturuldu</h2>
          <p>Ekibimiz konuyu takip edecek. Talep numaran:</p>
          <strong>LP-000123</strong>
          <button class="primary-btn" type="button" data-action="reset-support-ticket" data-testid="support-ticket-new">${icon("plus")} Yeni Talep Oluştur</button>
          <button class="secondary-btn" type="button" data-route="/support/live">${icon("message")} Canlı desteğe geç</button>
        </section>
      ` : `
        <form class="ticket-form-card" data-testid="support-ticket-form">
          <label>
            <span>Kategori</span>
            <select data-testid="support-ticket-category" name="category">
              ${ticketCategories.map((category) => `<option value="${category}">${category}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>Konu</span>
            <input data-testid="support-ticket-subject" name="subject" type="text" value="Bakiye kullanım kontrolü" placeholder="Kısaca konuyu yaz" />
          </label>
          <label>
            <span>Açıklama</span>
            <textarea data-testid="support-ticket-description" name="description" rows="4" placeholder="Detayı yaz">Kredi kullanım hareketimde kontrol edilmesi gereken bir konu var.</textarea>
          </label>
          <label>
            <span>Öncelik</span>
            <select data-testid="support-ticket-priority" name="priority">
              ${priorityOptions.map((priority) => `<option value="${priority}">${priority}</option>`).join("")}
            </select>
          </label>
          <button class="ticket-upload-placeholder" type="button" data-action="mock-upload" data-testid="support-ticket-upload">
            ${icon("plus")}
            <span>Dosya veya ekran görüntüsü ekle</span>
          </button>
          <button class="primary-btn" type="button" data-action="submit-support-ticket" data-testid="support-ticket-submit">Talep Oluştur</button>
        </form>
      `}
    `,
  });
}
