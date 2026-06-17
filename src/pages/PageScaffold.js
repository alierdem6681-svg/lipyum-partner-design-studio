import { Card } from "../components/Card.js";
import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";

export function PlaceholderPage({
  title,
  subtitle = "Bu alan modüler sayfa yapısına taşındı.",
  route,
  notes = [],
} = {}) {
  return PageContainer({
    children: `
      ${Header({ title, subtitle })}
      ${Card({
        ariaLabel: `${title} içerik kartı`,
        children: `
          <h3>${title}</h3>
          <p>${subtitle}</p>
          ${route ? `<small>Route: ${route}</small>` : ""}
          ${notes.length ? `<ul>${notes.map((note) => `<li>${note}</li>`).join("")}</ul>` : ""}
        `,
      })}
    `,
  });
}
