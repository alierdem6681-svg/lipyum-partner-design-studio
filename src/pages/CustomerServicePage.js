import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";

export function CustomerServicePage({ icon = () => "" } = {}) {
  return PageContainer({
    className: "customer-service-page",
    children: `
      ${Header({
        title: "Müşteri Hizmetleri",
        subtitle: "",
        showBack: true,
        backIcon: icon("chevron-left"),
      })}
      <section class="v-empty-page-shell" data-testid="customer-service-page" aria-label="Müşteri hizmetleri içeriği"></section>
    `,
  });
}
