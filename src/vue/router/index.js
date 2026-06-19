import { createRouter, createWebHashHistory } from "vue-router";
import { routeMeta, getRouteMeta } from "../../utils/routeMeta.js";
import { normalizeRoute } from "../../router.js";
import { useAppShellStore } from "../stores/appShell.js";
import { useNavigationStore } from "../stores/navigation.js";
import CalendarPage from "../pages/CalendarPage.vue";
import HomePage from "../pages/HomePage.vue";
import JobsPage from "../pages/JobsPage.vue";
import LegacyContentBridge from "../pages/LegacyContentBridge.vue";
import MyJobsPage from "../pages/MyJobsPage.vue";

const corePages = {
  "/home": HomePage,
  "/jobs": JobsPage,
  "/my-jobs": MyJobsPage,
  "/calendar": CalendarPage,
};

export const coreVueRoutes = Object.keys(corePages);

export const routes = Object.keys(routeMeta).map((path) => ({
  path,
  name: path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "-") || "home",
  component: corePages[path] || LegacyContentBridge,
  props: corePages[path] ? false : { routePath: path },
  meta: {
    ...getRouteMeta(path),
    legacyBridge: !corePages[path],
    coreVue: Boolean(corePages[path]),
  },
}));

routes.push({
  path: "/:pathMatch(.*)*",
  redirect: "/home",
});

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, from) => {
  const appShell = useAppShellStore();
  appShell.closeTransientOverlays();
  if (to.path !== "/profile") appShell.resetRouteLocalState("profileBadgesExpanded");
  if (to.path !== from.path) appShell.clearToast();
  return true;
});

router.afterEach((to, from) => {
  const navigation = useNavigationStore();
  const normalized = normalizeRoute(to.path);
  const meta = getRouteMeta(normalized);
  document.title = `${meta.title} · Lipyum Partner`;
  navigation.setRoute(normalized, from.path || "");
});

export function resolveRouteMeta(route) {
  return getRouteMeta(normalizeRoute(route));
}
