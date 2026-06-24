import { getRouteForScreen, getScreenForRoute, getTitleForRoute, normalizeRoute } from "../router.js";
import { resolveDeepLinkRoute } from "./deepLinks.js";

export const isModifiedClick = (event) => event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

export function routeHash(route) {
  const normalized = String(route || "/home").startsWith("/") ? route : `/${route}`;
  return `#${normalized}`;
}

export function isInternalRoute(route) {
  return typeof route === "string" && route.startsWith("/");
}

export function createNavigationController({
  state,
  renderScreen,
  navigationStack = [],
} = {}) {
  if (!state || typeof renderScreen !== "function") {
    throw new Error("createNavigationController requires state and renderScreen.");
  }

  const getCurrentRoute = () => normalizeRoute(window.location.hash || resolveDeepLinkRoute() || getRouteForScreen(state.screen));

  function updateDocumentTitle(route = getCurrentRoute()) {
    document.title = `${getTitleForRoute(route)} · Lipyum Partner`;
  }

  function setActiveTab(route = getCurrentRoute()) {
    state.screen = getScreenForRoute(route);
  }

  function syncRouteHash(route, replace = false) {
    const normalized = normalizeRoute(route);
    const hash = routeHash(normalized);
    if (window.location.hash === hash) return;
    const method = replace ? "replaceState" : "pushState";
    window.history[method]({ route: normalized }, "", hash);
  }

  function renderRoute(route = getCurrentRoute(), options = {}) {
    const normalized = normalizeRoute(route);
    const nextScreen = getScreenForRoute(normalized);
    if (nextScreen !== state.screen) state.previousScreen = state.screen;
    if (nextScreen !== "profile") state.profileBadgesExpanded = false;
    state.drawerBadgesExpanded = false;
    if (nextScreen !== "supportNew") state.supportTicketCreated = false;
    if (nextScreen !== "supportLive") state.liveSupportStarted = false;
    if (nextScreen !== "supportCustomerService") state.customerServiceCallStarted = false;
    if (nextScreen !== "satisfaction") {
      state.satisfactionRating = 0;
      state.satisfactionSubmitted = false;
      state.satisfactionStoreOpened = false;
    }
    state.screen = nextScreen;
    updateDocumentTitle(normalized);
    renderScreen(options);
  }

  function navigateTo(route, options = {}) {
    const normalized = normalizeRoute(route);
    if (!options.fromHistory) {
      if (options.replace && navigationStack.length) {
        navigationStack[navigationStack.length - 1] = normalized;
      } else if (navigationStack[navigationStack.length - 1] !== normalized) {
        navigationStack.push(normalized);
      }
      syncRouteHash(normalized, Boolean(options.replace));
    }
    renderRoute(normalized, options);
  }

  function goBack() {
    if (navigationStack.length > 1) {
      navigationStack.pop();
      const previousRoute = navigationStack[navigationStack.length - 1] || "/home";
      syncRouteHash(previousRoute, true);
      renderRoute(previousRoute);
      return;
    }
    navigateTo("/home", { replace: true });
  }

  function initRouter() {
    const initialRoute = getCurrentRoute();
    navigationStack.length = 0;
    navigationStack.push(initialRoute);
    syncRouteHash(initialRoute, true);
    window.addEventListener("popstate", () => {
      const route = getCurrentRoute();
      const existingIndex = navigationStack.lastIndexOf(route);
      if (existingIndex > -1) {
        navigationStack.length = existingIndex + 1;
      } else if (navigationStack[navigationStack.length - 1] !== route) {
        navigationStack.push(route);
      }
      renderRoute(route, { fromHistory: true });
    });
  }

  return {
    getCurrentRoute,
    goBack,
    initRouter,
    navigateTo,
    renderRoute,
    setActiveTab,
    updateDocumentTitle,
  };
}
