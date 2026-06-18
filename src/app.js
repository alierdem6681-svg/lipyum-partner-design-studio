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
const useVueEngine = params.get("engine") === "vue";

if (useVueEngine) {
  import("./vue/main.js").then(({ mountVueApp }) => mountVueApp());
} else {
  import("./legacyApp.js");
}
