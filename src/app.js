import { resolveDeepLinkRoute } from "./utils/deepLinks.js";

const resolvedDeepLinkRoute = resolveDeepLinkRoute();

if (resolvedDeepLinkRoute && !window.location.hash) {
  window.history.replaceState(
    {},
    "",
    `${window.location.pathname}${window.location.search}#${resolvedDeepLinkRoute}`,
  );
}

const params = new URLSearchParams(window.location.search);
const requestedEngine = params.get("engine");
const useVueEngine = requestedEngine === "vue";

function markRuntime(runtime) {
  const root = document.getElementById("app");
  document.documentElement.dataset.runtime = runtime;
  document.body.dataset.runtime = runtime;
  if (root) root.dataset.runtime = runtime;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderVueBootError(error) {
  const root = document.getElementById("app");
  const message = error instanceof Error ? error.message : "Vue runtime boot failed";
  console.error("[lipyum] Vue runtime boot failed", error);
  markRuntime("vue-error");
  if (root) {
    root.innerHTML = `
      <main role="alert" style="font-family: system-ui, sans-serif; padding: 24px; color: #111827;">
        <h1 style="font-size: 18px; margin: 0 0 8px;">Uygulama baslatilamadi</h1>
        <p style="margin: 0;">Vue runtime acilirken hata olustu: ${escapeHtml(message)}</p>
      </main>
    `;
  }
}

if (useVueEngine) {
  markRuntime("vue");
  import("./vue/main.js")
    .then(({ mountVueApp }) => mountVueApp())
    .catch(renderVueBootError);
} else {
  markRuntime("legacy");
  import("./legacyApp.js");
}
