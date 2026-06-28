import { resolveDeepLinkRoute } from "./utils/deepLinks.js";

const resolvedDeepLinkRoute = resolveDeepLinkRoute();
const currentHash = window.location.hash;
const removedHashRoutePrefixes = ["/management-panel"];

function normalizeHashRoute(hash) {
  const raw = String(hash || "").replace(/^#/, "") || "/";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function isRemovedHashRoute(hash) {
  const route = normalizeHashRoute(hash);
  return removedHashRoutePrefixes.some((prefix) => route === prefix || route.startsWith(`${prefix}/`));
}

function renderRemovedHashRoute() {
  const root = document.getElementById("app");
  document.title = "Baglanti kaldirildi";
  document.documentElement.dataset.runtime = "removed-route";
  document.body.dataset.runtime = "removed-route";
  if (!root) return;
  root.dataset.runtime = "removed-route";
  root.innerHTML = `
    <main data-testid="removed-route" style="min-height: 100vh; display: grid; place-items: center; padding: 24px; font-family: system-ui, -apple-system, Segoe UI, sans-serif; color: #111827; background: #f8fafc;">
      <section role="status" aria-live="polite" style="width: min(420px, 100%); border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; padding: 20px; box-shadow: 0 12px 32px rgba(15, 23, 42, .08);">
        <h1 style="margin: 0 0 8px; font-size: 18px;">Bu baglanti kaldirildi</h1>
        <p style="margin: 0; font-size: 14px; line-height: 1.5;">Bu adres Lipyum uygulamasinda calismaz.</p>
      </section>
    </main>
  `;
}

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

async function bootVue() {
  try {
    const { mountVueApp } = await import("./vue/main.js");
    mountVueApp();
  } catch (error) {
    renderVueBootError(error);
  }
}

if (isRemovedHashRoute(currentHash)) {
  renderRemovedHashRoute();
} else {
  if (!currentHash && !resolvedDeepLinkRoute) {
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}${window.location.search}#/home`,
    );
  }

  if (resolvedDeepLinkRoute && (!currentHash || currentHash === "#/home")) {
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}${window.location.search}#${resolvedDeepLinkRoute}`,
    );
  }

  markRuntime("vue");
  bootVue();
}
