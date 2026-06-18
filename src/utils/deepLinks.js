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
  packages: "/packages",
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
  "/partner/packages": "/packages",
  "/partner/satisfaction": "/satisfaction",
  "/partner/card": "/partner-card-preview",
};

export function resolveDeepLinkRoute(urlLike = window.location.href) {
  const url = new URL(urlLike, window.location.origin);
  const route = url.searchParams.get("route");
  if (route && route.startsWith("/")) return route;

  const deepLink = url.searchParams.get("deeplink");
  if (deepLink && deepLinkAliases[deepLink]) return deepLinkAliases[deepLink];

  return partnerPathRoutes[url.pathname] || "";
}

export function deepLinkMappings() {
  return {
    aliases: { ...deepLinkAliases },
    paths: { ...partnerPathRoutes },
  };
}
