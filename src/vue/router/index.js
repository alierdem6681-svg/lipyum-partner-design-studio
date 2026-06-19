import { createRouter, createWebHashHistory } from "vue-router";
import { ROUTE_TITLES, ROUTE_TO_SCREEN } from "../../utils/constants.js";
import { activeRoutePaths } from "../data/activeRouteContent.js";
import CalendarPage from "../pages/CalendarPage.vue";
import ContentRoutePage from "../pages/ContentRoutePage.vue";
import CreateTicketPage from "../pages/CreateTicketPage.vue";
import CustomerServicePage from "../pages/CustomerServicePage.vue";
import HomePage from "../pages/HomePage.vue";
import JobReferralPage from "../pages/JobReferralPage.vue";
import LeaderboardPage from "../pages/LeaderboardPage.vue";
import LiveSupportPage from "../pages/LiveSupportPage.vue";
import MessagesPage from "../pages/MessagesPage.vue";
import JobsPage from "../pages/JobsPage.vue";
import MyJobsPage from "../pages/MyJobsPage.vue";
import NotificationsPage from "../pages/NotificationsPage.vue";
import PartnerCardPreviewPage from "../pages/PartnerCardPreviewPage.vue";
import PhotoGalleryPage from "../pages/PhotoGalleryPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import ReferralEarningsPage from "../pages/ReferralEarningsPage.vue";
import ReferralPage from "../pages/ReferralPage.vue";
import ReferralPartnerDetailPage from "../pages/ReferralPartnerDetailPage.vue";
import ReferralPartnersPage from "../pages/ReferralPartnersPage.vue";
import ReferralTasksPage from "../pages/ReferralTasksPage.vue";
import ReviewsPage from "../pages/ReviewsPage.vue";
import SatisfactionPage from "../pages/SatisfactionPage.vue";
import SubscriptionPage from "../pages/SubscriptionPage.vue";
import SupportPage from "../pages/SupportPage.vue";
import UiKitPreviewPage from "../pages/UiKitPreviewPage.vue";
import WalletPage from "../pages/WalletPage.vue";

const blankBottomRoutes = [
  { path: "/jobs", name: "jobs", component: JobsPage },
  { path: "/my-jobs", name: "my-jobs", component: MyJobsPage },
  { path: "/calendar", name: "calendar", component: CalendarPage },
  { path: "/wallet", name: "wallet", component: WalletPage },
];

const simpleContentRoutes = new Set([
  "/about",
  "/services",
  "/regions",
  "/working-hours",
  "/team",
  "/capacity",
  "/strategy",
  "/account-settings",
  "/notification-settings",
  "/contact-settings",
  "/bonus",
  "/performance-score",
  "/customers",
  "/invoices",
  "/income-expense",
  "/appointment-link",
]);

const dedicatedRouteComponents = {
  "/profile": ProfilePage,
  "/partner-card-preview": PartnerCardPreviewPage,
  "/photo-gallery": PhotoGalleryPage,
  "/notifications": NotificationsPage,
  "/support": SupportPage,
  "/support/new": CreateTicketPage,
  "/support/live": LiveSupportPage,
  "/support/customer-service": CustomerServicePage,
  "/messages": MessagesPage,
  "/satisfaction": SatisfactionPage,
  "/reviews": ReviewsPage,
  "/leaderboard": LeaderboardPage,
  "/subscription": SubscriptionPage,
  "/referral": ReferralPage,
  "/partners": ReferralPartnersPage,
  "/referral/tasks": ReferralTasksPage,
  "/referral/partners": ReferralPartnersPage,
  "/referral-earnings": ReferralEarningsPage,
  "/job-referral": JobReferralPage,
};

const simpleRoutes = activeRoutePaths
  .filter((route) => route !== "/home")
  .filter((route) => !blankBottomRoutes.some((item) => item.path === route))
  .filter((route) => simpleContentRoutes.has(route))
  .map((route) => ({
    path: route,
    name: `content-${route.replace(/\W+/g, "-")}`,
    component: ContentRoutePage,
    meta: {
      title: ROUTE_TITLES[route] || "Lipyum Partner",
    },
  }));

const dedicatedRoutes = Object.entries(dedicatedRouteComponents).map(([route, component]) => ({
  path: route,
  name: `dedicated-${route.replace(/\W+/g, "-")}`,
  component,
  meta: {
    title: ROUTE_TITLES[route] || "Lipyum Partner",
  },
}));

const routes = [
  { path: "/home", name: "home", component: HomePage },
  ...blankBottomRoutes,
  ...simpleRoutes,
  ...dedicatedRoutes,
  { path: "/packages", redirect: "/subscription" },
  { path: "/package-builder", redirect: "/subscription" },
  { path: "/package-checkout", redirect: "/subscription" },
  { path: "/partner/packages", redirect: "/subscription" },
  { path: "/ui-kit", name: "ui-kit", component: UiKitPreviewPage },
  { path: "/referral/partner/:id", name: "referral-partner-detail", component: ReferralPartnerDetailPage },
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
