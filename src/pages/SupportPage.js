import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";
import { SupportActionList } from "../components/SupportActionList.js";
import { SupportSearchBox } from "../components/SupportSearchBox.js";
import { supportInfoActions, supportQuickActions } from "../data/mockData.js";

export function SupportPage({ icon = () => "" } = {}) {
  return PageContainer({
    className: "support-page",
    children: `
      ${Header({
        title: "Yardım ve Destek",
        subtitle: "Sorununu seç, hızlıca çözelim.",
      })}
      <section class="support-hero-card" aria-label="Yardım ve destek">
        <span class="support-hero-copy">
          <strong>Sorununu seç,<br>hızlıca çözelim.</strong>
          <small>Size nasıl yardımcı olabiliriz?</small>
        </span>
        <span class="support-hero-art" aria-hidden="true">
          <span class="support-bubble question">?</span>
          <span class="support-bubble main">${icon("message")}</span>
          <span class="support-bubble spark">${icon("sparkles")}</span>
        </span>
      </section>
      ${SupportSearchBox({ icon })}
      ${SupportActionList({ title: "Hızlı İşlemler", items: supportQuickActions, icon })}
      ${SupportActionList({ title: "Bilgi Merkezi", items: supportInfoActions, icon })}
    `,
  });
}
