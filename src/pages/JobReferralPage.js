import { Button } from "../components/Button.js";
import { Card } from "../components/Card.js";
import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";
import { jobReferralProgram } from "../data/mockData.js";

export function JobReferralPage({ icon = () => "" } = {}) {
  const steps = jobReferralProgram.steps.map((step, index) => `
    <li class="job-referral-step">
      <span class="job-referral-step-index">${index + 1}</span>
      <span>
        <strong>${step.title}</strong>
        <small>${step.description}</small>
      </span>
    </li>
  `).join("");

  const earnings = jobReferralProgram.earnings.map((item) => `
    <article class="job-referral-earning-card">
      <span class="job-referral-earning-icon">${icon(item.icon)}</span>
      <strong>${item.title}</strong>
      <small>${item.description}</small>
    </article>
  `).join("");

  return PageContainer({
    className: "job-referral-page",
    children: `
      ${Header({
        title: "İş Yönlendirme Programı",
        subtitle: "Servis talebi gönder, iş gerçekleşirse kazanç elde et.",
      })}
      ${Card({
        className: "job-referral-hero",
        ariaLabel: "İş yönlendirme programı özeti",
        children: `
          <div class="job-referral-hero-copy">
            <span class="ui-badge ui-badge--success">Kazanç Ortaklığı</span>
            <h3>İşi yönlendir, gerçekleşince kazan</h3>
            <p>Tanıdığın müşterinin servis talebini Lipyum'a ilet. İş doğrulanıp tamamlandığında bonus, nakit veya komisyon kazancı oluşur.</p>
            ${Button({ label: "İş Gönder", variant: "primary", action: "create-job-referral", icon: icon("plus") })}
          </div>
          <div class="job-referral-hero-art" aria-hidden="true">
            <span>${icon("briefcase")}</span>
          </div>
        `,
      })}
      ${Card({
        className: "job-referral-steps-card",
        ariaLabel: "İş yönlendirme adımları",
        children: `
          <h3>Nasıl çalışır?</h3>
          <ol class="job-referral-steps">${steps}</ol>
        `,
      })}
      <section class="job-referral-earnings" aria-label="Kazanç türleri">
        ${earnings}
      </section>
      ${Card({
        className: "job-referral-note-card",
        children: `
          <strong>Kontrol sende</strong>
          <p>Bu ekran şimdilik güvenli mock veriyle çalışır. Gerçek yönlendirme, ödeme veya canlı müşteri verisi bağlantısı yapılmadı.</p>
        `,
      })}
    `,
  });
}
