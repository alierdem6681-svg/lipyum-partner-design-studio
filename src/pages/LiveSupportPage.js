import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";

export function LiveSupportPage({ icon = () => "" } = {}) {
  return PageContainer({
    className: "support-live-page",
    children: `
      ${Header({
        title: "Canlı Destek",
        subtitle: "",
        showBack: true,
        backIcon: icon("chevron-left"),
      })}
      <section class="v-empty-page-shell" data-testid="live-support-page" aria-label="Canlı destek içeriği"></section>
    `,
  });
}
