import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";

export function BlankRoutePage({ title, route, showBack = false } = {}) {
  return PageContainer({
    className: "blank-bottom-route-page",
    children: `
      ${Header({ title, subtitle: "", showBack, variant: showBack ? "subpage" : "section" })}
      <main class="blank-route-main" aria-label="${title}" data-testid="${route.replace(/^\//, "").replace(/\//g, "-")}-page" data-blank-route="true"></main>
    `,
  });
}
