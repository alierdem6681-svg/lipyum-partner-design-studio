import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";

export function LiveSupportPage({ started = false, icon = () => "" } = {}) {
  return PageContainer({
    className: "support-live-page",
    children: `
      ${Header({
        title: "Canlı Destek",
        subtitle: "Temsilciyle hızlıca görüş",
        showBack: true,
        backIcon: icon("chevron-left"),
      })}
      <section class="live-support-card" data-testid="live-support-page">
        <span class="live-support-icon" aria-hidden="true">${icon(started ? "headphones" : "message")}</span>
        ${started ? `
          <h2>Temsilci bağlanıyor</h2>
          <p>Talebin canlı destek kuyruğuna alındı. Bir temsilci kısa süre içinde sohbete katılacak.</p>
          <div class="live-support-queue" role="status" aria-live="polite">
            <span></span><span></span><span></span>
          </div>
          <button class="secondary-btn" type="button" data-route="/support/new">Talep oluşturmayı tercih et</button>
        ` : `
          <h2>Canlı sohbeti başlat</h2>
          <p>Kısa bir başlık ve not bırak, doğru temsilciye hızlıca yönlendirelim.</p>
          <label>
            <span>Konu başlığı</span>
            <input data-testid="live-support-title" type="text" value="Kredi kullanımı hakkında destek" />
          </label>
          <label>
            <span>Kısa açıklama</span>
            <textarea data-testid="live-support-description" rows="3">Kredi ve bonus kullanımıyla ilgili canlı destek almak istiyorum.</textarea>
          </label>
          <button class="primary-btn" type="button" data-action="start-live-support" data-testid="live-support-start">${icon("message")} Canlı sohbete başla</button>
        `}
      </section>
    `,
  });
}
