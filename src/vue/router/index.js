import { createRouter, createWebHashHistory } from "vue-router";
import { ROUTE_TO_SCREEN, ROUTE_TITLES } from "../../utils/constants.js";
import CalendarPage from "../pages/CalendarPage.vue";
import HomePage from "../pages/HomePage.vue";
import JobsPage from "../pages/JobsPage.vue";
import LegacyContentBridge from "../pages/LegacyContentBridge.vue";
import MyJobsPage from "../pages/MyJobsPage.vue";
import UiKitPreviewPage from "../pages/UiKitPreviewPage.vue";
import JobReferralVuePage from "../pages/JobReferralVuePage.vue";

const coreRoutes = [
  { path: "/home", name: "home", component: HomePage },
  { path: "/jobs", name: "jobs", component: JobsPage },
  { path: "/my-jobs", name: "my-jobs", component: MyJobsPage },
  { path: "/calendar", name: "calendar", component: CalendarPage },
];

const compatibilityRoutes = Object.keys(ROUTE_TO_SCREEN)
  .filter((route) => !coreRoutes.some((item) => item.path === route))
  .map((route) => ({
    path: route,
    name: `compat-${route.replace(/\W+/g, "-")}`,
    component: route === "/ui-kit"
      ? UiKitPreviewPage
      : route === "/vue-job-referral"
        ? JobReferralVuePage
        : LegacyContentBridge,
    meta: {
      compatibilityBridge: route !== "/ui-kit" && route !== "/vue-job-referral",
      title: ROUTE_TITLES[route] || "Lipyum Partner",
    },
  }));

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...coreRoutes,
    ...compatibilityRoutes,
    { path: "/", redirect: "/home" },
    { path: "/:pathMatch(.*)*", redirect: "/home" },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.afterEach((to) => {
  document.title = `${to.meta?.title || ROUTE_TITLES[to.path] || "Ana Sayfa"} · Lipyum Partner`;
});

export default router;
