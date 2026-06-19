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
const useLegacyEngine = params.get("engine") === "legacy";

if (useLegacyEngine) {
  import("./legacyApp.js");
} else {
  import("./vue/main.js").then(({ mountVueApp }) => mountVueApp());
}
