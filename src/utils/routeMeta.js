import { BOTTOM_TABS, ROUTE_TITLES, ROUTE_TO_SCREEN } from "./constants.js";

const titleOverrides = {
  "/jobs": {
    title: "İş Al",
    compactTitle: "İş Al",
    subtitle: "",
  },
  "/my-jobs": {
    title: "İşler",
    compactTitle: "İşler",
    subtitle: "",
  },
  "/calendar": {
    title: "Randevu",
    compactTitle: "Randevu",
    subtitle: "",
  },
  "/referral": {
    title: "Partner Davet Programı",
    compactTitle: "Partner Davet",
    subtitle: "Davetlerinden %3 bonus kazan",
  },
  "/referral/tasks": {
    title: "Referral Görevleri",
    compactTitle: "Görevler",
    subtitle: "Davet görevlerini takip et",
    parentRoute: "/referral",
  },
  "/referral/partners": {
    title: "Davet Ettiğin Partnerler",
    compactTitle: "Partnerler",
    subtitle: "Referral altındaki partner listesi",
    parentRoute: "/referral",
  },
  "/notifications": {
    title: "Bildirimler",
    subtitle: "Önemli gelişmeleri takip et",
    trailingActions: ["notification-settings"],
  },
  "/wallet": {
    title: "Cüzdan",
    compactTitle: "Cüzdan",
    subtitle: "",
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
        showBottomBar: true,
        activeBottomTab: bottomTabByRoute.get(route) || null,
        ctaVariant: isHome ? "home" : "subpage",
        parentRoute: override.parentRoute || (route === "/home" ? null : "/home"),
        showProfile: isHome || isBottomRoute,
        showNotification: isHome || isBottomRoute,
        showInfo: !(isHome || isBottomRoute),
      },
    ];
  }),
);

export function getRouteMeta(route = "/home") {
  if (route.startsWith("/referral/partner/")) {
    return {
      ...routeMeta["/referral/partners"],
      route,
      title: "Partner Detayı",
      compactTitle: "Partner Detayı",
      subtitle: "Davet edilen partner özeti",
      parentRoute: "/referral/partners",
    };
  }
  return routeMeta[route] || routeMeta["/home"];
}
