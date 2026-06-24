import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";

export function CreateTicketPage({ icon = () => "" } = {}) {
  return PageContainer({
    className: "support-new-page",
    children: `
      ${Header({
        title: "Talep Oluştur",
        subtitle: "",
        showBack: true,
        backIcon: icon("chevron-left"),
      })}
      <section class="v-empty-page-shell" data-testid="support-ticket-page" aria-label="Talep oluştur içeriği"></section>
    `,
  });
}
