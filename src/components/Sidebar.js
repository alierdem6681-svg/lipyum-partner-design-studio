import { MenuList } from "./MenuList.js";

export function renderSidebar({ sections = [], icon = (name) => name, support = "" } = {}) {
  return `
    <aside class="drawer-menu" aria-label="Partner menüsü">
      ${sections.map((section) => MenuList({ title: section.title, items: section.items, icon })).join("")}
      ${support}
    </aside>
  `;
}
