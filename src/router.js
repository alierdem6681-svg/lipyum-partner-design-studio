import { RETIRED_ROUTE_REDIRECTS, ROUTE_TITLES, ROUTE_TO_SCREEN } from "./utils/constants.js";
export { pageRoutes } from "./pages/routePages.js";
export { getRouteMeta, routeMeta } from "./utils/routeMeta.js";

export const routeToScreen = ROUTE_TO_SCREEN;

export const screenToRoute = Object.entries(routeToScreen).reduce((routes, [route, screen]) => {
  if (!routes[screen]) routes[screen] = route;
  return routes;
}, {});

export const routeTitles = ROUTE_TITLES;

export function normalizeRoute(route) {
  const raw = String(route || "/home").replace(/^#/, "");
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  if (RETIRED_ROUTE_REDIRECTS[withSlash]) return RETIRED_ROUTE_REDIRECTS[withSlash];
  return routeToScreen[withSlash] ? withSlash : "/home";
}

export function getScreenForRoute(route) {
  return routeToScreen[normalizeRoute(route)] || "home";
}

export function getRouteForScreen(screen) {
  return screenToRoute[screen] || "/home";
}

export function getTitleForRoute(route) {
  return routeTitles[normalizeRoute(route)] || routeTitles["/home"];
}

export function getCtaVariant(route) {
  const normalized = normalizeRoute(route);
  if (normalized === "/home") return "home";
  return "subpage";
}
