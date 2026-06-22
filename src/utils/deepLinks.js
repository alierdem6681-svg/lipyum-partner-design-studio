import { RETIRED_ROUTE_REDIRECTS } from "./constants.js";

const deepLinkAliases = {
  home: "/home",
  wallet: "/wallet",
  reviews: "/reviews",
  support: "/support",
  "support-new": "/support/new",
  "support-live": "/support/live",
  "support-customer-service": "/support/customer-service",
  referral: "/referral",
  "job-referral": "/job-referral",
  satisfaction: "/satisfaction",
  "partner-card": "/partner-card-preview",
};

const partnerPathRoutes = {
  "/partner/home": "/home",
  "/partner/wallet": "/wallet",
  "/partner/reviews": "/reviews",
  "/partner/support": "/support",
  "/partner/support/new": "/support/new",
  "/partner/support/live": "/support/live",
  "/partner/support/customer-service": "/support/customer-service",
  "/partner/referral": "/referral",
  "/partner/job-referral": "/job-referral",
  "/partner/satisfaction": "/satisfaction",
  "/partner/card": "/partner-card-preview",
  "/partner/packages": "/subscription",
};

function normalizeHostedPathname(pathname) {
  const baseUrl = import.meta.env?.BASE_URL || "/";
  if (baseUrl === "/" || !pathname.startsWith(baseUrl)) return pathname;

  const normalizedPath = pathname.slice(baseUrl.length - 1);
  return normalizedPath || "/";
}

export function resolveDeepLinkRoute(urlLike = window.location.href) {
  const url = new URL(urlLike, window.location.origin);
  const route = url.searchParams.get("route");
  if (route && route.startsWith("/")) return RETIRED_ROUTE_REDIRECTS[route] || route;

  const deepLink = url.searchParams.get("deeplink");
  if (deepLink && deepLinkAliases[deepLink]) return deepLinkAliases[deepLink];
  if (deepLink === "packages") return "/subscription";

  const pathname = normalizeHostedPathname(url.pathname).replace(/\/+$/, "") || "/";
  if (RETIRED_ROUTE_REDIRECTS[pathname]) return RETIRED_ROUTE_REDIRECTS[pathname];
  return partnerPathRoutes[pathname] || "";
}

export function deepLinkMappings() {
  return {
    aliases: { ...deepLinkAliases },
    paths: { ...partnerPathRoutes },
    retired: { ...RETIRED_ROUTE_REDIRECTS },
  };
}
