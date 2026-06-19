import { activeRoutePaths } from "./activeRouteContent.js";

const globalOutcomes = [
  { testid: "header-menu", action: "open-drawer", expectedState: "drawer-open", resetBehavior: "close-drawer" },
  { testid: "header-notifications", action: "navigate", expectedRoute: "/notifications", resetBehavior: "back-stack" },
  { testid: "bottom-home", action: "navigate", expectedRoute: "/home", resetBehavior: "route-change" },
];

export const clickableOutcomes = Object.fromEntries(
  activeRoutePaths.map((route) => [
    route,
    [
      ...globalOutcomes,
      {
        testid: `route-${route.replace(/\W+/g, "-") || "home"}`,
        action: "render-route",
        expectedRoute: route,
        expectedState: "route-visible",
        resetBehavior: "route-change",
      },
    ],
  ]),
);

export function getClickableOutcomes(route) {
  return clickableOutcomes[route] || globalOutcomes;
}
