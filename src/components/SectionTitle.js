export function SectionTitle({ title, action = "" } = {}) {
  return `
    <div class="section-title">
      <h2>${title}</h2>
      ${action}
    </div>
  `;
}
