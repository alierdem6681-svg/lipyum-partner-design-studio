import { createRouter, createWebHashHistory } from "vue-router";
import { ROUTE_TITLES, ROUTE_TO_SCREEN } from "../../utils/constants.js";
import { activeRoutePaths } from "../data/activeRouteContent.js";
import CalendarPage from "../pages/CalendarPage.vue";
import ContentRoutePage from "../pages/ContentRoutePage.vue";
import HomePage from "../pages/HomePage.vue";
import JobsPage from "../pages/JobsPage.vue";
import MyJobsPage from "../pages/MyJobsPage.vue";
import UiKitPreviewPage from "../pages/UiKitPreviewPage.vue";
import WalletPage from "../pages/WalletPage.vue";

const blankBottomRoutes = [
  { path: "/jobs", name: "jobs", component: JobsPage },
  { path: "/my-jobs", name: "my-jobs", component: MyJobsPage },
  { path: "/calendar", name: "calendar", component: CalendarPage },
  { path: "/wallet", name: "wallet", component: WalletPage },
];

const migratedRoutes = activeRoutePaths
  .filter((route) => route !== "/home")
  .filter((route) => !blankBottomRoutes.some((item) => item.path === route))
  .map((route) => ({
    path: route,
    name: `active-${route.replace(/\W+/g, "-")}`,
    component: ContentRoutePage,
    meta: {
      title: ROUTE_TITLES[route] || "Lipyum Partner",
    },
  }));

const routes = [
  { path: "/home", name: "home", component: HomePage },
  ...blankBottomRoutes,
  ...migratedRoutes,
  { path: "/ui-kit", name: "ui-kit", component: UiKitPreviewPage },
  { path: "/packages", redirect: "/subscription" },
  { path: "/package-builder", redirect: "/subscription" },
  { path: "/package-checkout", redirect: "/subscription" },
  { path: "/referral/partner/:id", name: "referral-partner-detail", component: ContentRoutePage },
  { path: "/", redirect: "/home" },
  { path: "/:pathMatch(.*)*", redirect: "/home" },
];

const missingRoutes = Object.keys(ROUTE_TO_SCREEN).filter(
  (route) => !routes.some((item) => item.path === route || item.redirect === route),
);

if (missingRoutes.length) {
  throw new Error(`Missing Vue route registrations: ${missingRoutes.join(", ")}`);
}

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.afterEach((to) => {
  document.title = `${to.meta?.title || ROUTE_TITLES[to.path] || "Ana Sayfa"} · Lipyum Partner`;
});

export default router;
