import { Card } from "../components/Card.js";
import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";

const invoices = [
  { id: "LP-2026-006", title: "Haziran hizmet faturası", date: "22.06.2026", amount: "249 ₺", status: "Ödendi" },
  { id: "LP-2026-005", title: "Mayıs hizmet faturası", date: "22.05.2026", amount: "249 ₺", status: "Ödendi" },
  { id: "LP-2026-004", title: "Nisan hizmet faturası", date: "22.04.2026", amount: "199 ₺", status: "Ödendi" },
  { id: "LP-2026-003", title: "Mart hizmet faturası", date: "22.03.2026", amount: "199 ₺", status: "Ödendi" },
];

function invoiceRow(invoice) {
  return `
    <article class="profile-setting-row" data-testid="legacy-invoice-row">
      <span class="profile-setting-icon"><svg class="icon"><use href="#i-receipt"></use></svg></span>
      <span class="profile-setting-main">
        <strong>${invoice.title}</strong>
        <small>${invoice.id} · ${invoice.date} · ${invoice.status}</small>
      </span>
      <strong>${invoice.amount}</strong>
    </article>
  `;
}

function field(label, value, multiline = false) {
  return `
    <label class="form-field">
      <span>${label}</span>
      ${
        multiline
          ? `<textarea rows="3">${value}</textarea>`
          : `<span class="input-wrap"><input type="text" value="${value}" /></span>`
      }
    </label>
  `;
}

export function InvoicesPage() {
  return PageContainer({
    className: "invoices-page",
    children: `
      ${Header({
        title: "Faturalarım",
        subtitle: "Faturalarını görüntüle ve fatura bilgilerini düzenle.",
      })}

      ${Card({
        className: "section",
        ariaLabel: "Fatura özeti",
        children: `
          <div class="row" style="justify-content:flex-start;gap:10px">
            <span class="profile-setting-icon"><svg class="icon"><use href="#i-receipt"></use></svg></span>
            <div>
              <h3 style="margin:0;color:var(--ink);font-size:17px;font-weight:900">Fatura kayıtların</h3>
              <p class="body muted" style="margin:4px 0 0">Son faturalarını görüntüleyebilir ve indirebilirsin.</p>
            </div>
          </div>
        `,
      })}

      <section class="profile-settings-card section" aria-label="Fatura listesi">
        ${invoices.map(invoiceRow).join("")}
        <div class="row" style="gap:8px;padding:12px">
          <button class="secondary-btn" type="button" data-action="invoice-view">Fatura Görüntüle</button>
          <button class="secondary-btn" type="button" data-action="invoice-download">PDF İndir</button>
        </div>
      </section>

      ${Card({
        className: "section",
        ariaLabel: "Fatura bilgileri",
        children: `
          <h3 style="margin:0 0 4px;color:var(--ink);font-size:17px;font-weight:900">Fatura bilgileri</h3>
          <p class="body muted" style="margin:0 0 12px">Bireysel veya kurumsal fatura bilgilerini güncelle.</p>
          <div class="chip-row" aria-label="Fatura türü">
            <button class="chip-btn active" type="button">Bireysel</button>
            <button class="chip-btn" type="button">Kurumsal</button>
          </div>
          <div class="stack" style="margin-top:12px">
            ${field("Ad soyad", "Ahmet Kaya")}
            ${field("T.C. kimlik no", "12345678910")}
            ${field("Şirket ünvanı", "Lipyum Servis Hizmetleri Ltd. Şti.")}
            ${field("Vergi no", "1234567890")}
            ${field("Vergi dairesi", "Kayseri")}
            ${field("Fatura e-postası", "ahmet@lipyum.com")}
            ${field("Fatura adresi", "Kayseri, Melikgazi", true)}
            <button class="primary-btn" type="button" data-action="invoice-save">Fatura Bilgilerini Kaydet</button>
          </div>
        `,
      })}
    `,
  });
}
