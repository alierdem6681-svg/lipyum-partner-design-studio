export function SupportSearchBox({ icon = () => "" } = {}) {
  return `
    <label class="support-search">
      ${icon("search")}
      <input type="search" placeholder="Sorununu yaz..." aria-label="Sorununu yaz">
    </label>
  `;
}
