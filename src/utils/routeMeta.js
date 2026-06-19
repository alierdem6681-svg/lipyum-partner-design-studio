import { BOTTOM_TABS, ROUTE_TITLES, ROUTE_TO_SCREEN } from "./constants.js";

const titleOverrides = {
  "/referral": {
    title: "Partner Davet Programı",
    compactTitle: "Partner Davet",
    subtitle: "Davetlerinden %3 bonus kazan",
  },
  "/notifications": {
    title: "Bildirimler",
    subtitle: "Önemli gelişmeleri takip et",
    trailingActions: ["notification-settings"],
  },
  "/wallet": {
    title: "Cüzdan",
    subtitle: "Kredi, bonus ve hareketlerin",
    trailingActions: ["wallet-info"],
  },
};

const bottomTabByRoute = new Map(BOTTOM_TABS.map((item) => [item.route, item.id]));

export const routeMeta = Object.fromEntries(
  Object.keys(ROUTE_TO_SCREEN).map((route) => {
    const isHome = route === "/home";
    const isBottomRoute = bottomTabByRoute.has(route);
    const defaultTitle = ROUTE_TITLES[route] || "Lipyum Partner";
    const override = titleOverrides[route] || {};

    return [
      route,
      {
        route,
        screen: ROUTE_TO_SCREEN[route],
        title: override.title || defaultTitle,
        compactTitle: override.compactTitle || defaultTitle,
        subtitle: override.subtitle || "",
        headerVariant: isHome ? "home" : isBottomRoute ? "section" : "subpage",
        leadingAction: isHome || isBottomRoute ? "hamburger" : "back",
        trailingActions: override.trailingActions || (isHome || isBottomRoute ? ["notifications", "profile"] : ["info"]),
        showBottomBar: route !== "/partner-card-preview",
        activeBottomTab: bottomTabByRoute.get(route) || null,
        ctaVariant: isHome ? "home" : ["/package-checkout", "/partner-card-preview"].includes(route) ? "hidden" : "subpage",
        parentRoute: route === "/home" ? null : "/home",
        showProfile: isHome || isBottomRoute,
        showNotification: isHome || isBottomRoute,
        showInfo: !(isHome || isBottomRoute),
      },
    ];
  }),
);

export function getRouteMeta(route = "/home") {
  return routeMeta[route] || routeMeta["/home"];
}
