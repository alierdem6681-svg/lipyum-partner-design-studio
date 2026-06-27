import { createRouter, createWebHashHistory } from "vue-router";
import { ROUTE_TITLES, ROUTE_TO_SCREEN } from "../../utils/constants.js";
import { activeRoutePaths } from "../data/activeRouteContent.js";
import AccountTransactionsPage from "../pages/AccountTransactionsPage.vue";
import BlankBottomRoutePage from "../pages/BlankBottomRoutePage.vue";
import CalendarPage from "../pages/CalendarPage.vue";
import ContentRoutePage from "../pages/ContentRoutePage.vue";
import CreateTicketPage from "../pages/CreateTicketPage.vue";
import CustomerServicePage from "../pages/CustomerServicePage.vue";
import HomePage from "../pages/HomePage.vue";
import InvoicesPage from "../pages/InvoicesPage.vue";
import JobReferralPage from "../pages/JobReferralPage.vue";
import LeaderboardPage from "../pages/LeaderboardPage.vue";
import LiveSupportPage from "../pages/LiveSupportPage.vue";
import MessagesPage from "../pages/MessagesPage.vue";
import JobsPage from "../pages/JobsPage.vue";
import MyJobsPage from "../pages/MyJobsPage.vue";
import NotificationSettingsPage from "../pages/NotificationSettingsPage.vue";
import NotificationsPage from "../pages/NotificationsPage.vue";
import PartnerCardPreviewPage from "../pages/PartnerCardPreviewPage.vue";
import PerformanceScorePage from "../pages/PerformanceScorePage.vue";
import PhotoGalleryPage from "../pages/PhotoGalleryPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import ReferralEarningsPage from "../pages/ReferralEarningsPage.vue";
import ReferralPage from "../pages/ReferralPage.vue";
import ReferralPartnerDetailPage from "../pages/ReferralPartnerDetailPage.vue";
import ReferralPartnersPage from "../pages/ReferralPartnersPage.vue";
import ReferralTasksPage from "../pages/ReferralTasksPage.vue";
import ReviewsPage from "../pages/ReviewsPage.vue";
import SatisfactionPage from "../pages/SatisfactionPage.vue";
import PlanComparisonPage from "../pages/PlanComparisonPage.vue";
import SubscriptionCheckoutPage from "../pages/SubscriptionCheckoutPage.vue";
import SubscriptionPage from "../pages/SubscriptionPage.vue";
import SupportPage from "../pages/SupportPage.vue";
import UiKitPreviewPage from "../pages/UiKitPreviewPage.vue";
import WalletPage from "../pages/WalletPage.vue";
import WalletHistoryPage from "../pages/WalletHistoryPage.vue";
import WalletSettingsPage from "../pages/WalletSettingsPage.vue";
import WalletTopUpPage from "../pages/WalletTopUpPage.vue";
import WalletTopUpSuccessPage from "../pages/WalletTopUpSuccessPage.vue";
import WalletTransactionDetailPage from "../pages/WalletTransactionDetailPage.vue";

const blankBottomRoutes = [
  { path: "/jobs", name: "jobs", component: JobsPage },
  { path: "/my-jobs", name: "my-jobs", component: MyJobsPage },
  { path: "/calendar", name: "calendar", component: CalendarPage },
];

const emptySidebarRoutes = [
  { path: "/customer-management", title: "Müşteri Yönetimi", testId: "customer-management-page" },
  { path: "/digital-service-form", title: "Dijital Servis Formu", testId: "digital-service-form-page" },
  { path: "/create-offer", title: "Teklif Oluştur", testId: "create-offer-page" },
].map((item) => ({
  path: item.path,
  name: `empty-${item.path.replace(/\W+/g, "-")}`,
  component: BlankBottomRoutePage,
  props: {
    title: item.title,
    testId: item.testId,
  },
  meta: {
    title: item.title,
  },
}));

const simpleContentRoutes = new Set([
  "/about",
  "/verifications",
  "/services",
  "/regions",
  "/working-hours",
  "/team",
  "/capacity",
  "/strategy",
  "/account-settings",
  "/contact-settings",
  "/bonus",
  "/customers",
  "/income-expense",
  "/appointment-link",
]);

const dedicatedRouteComponents = {
  "/wallet": WalletPage,
  "/wallet/top-up": WalletTopUpPage,
  "/wallet/top-up/success": WalletTopUpSuccessPage,
  "/wallet/history": WalletHistoryPage,
  "/wallet/settings": WalletSettingsPage,
  "/profile": ProfilePage,
  "/partner-card-preview": PartnerCardPreviewPage,
  "/performance-score": PerformanceScorePage,
  "/performance-improve": PerformanceScorePage,
  "/photo-gallery": PhotoGalleryPage,
  "/notifications": NotificationsPage,
  "/notification-settings": NotificationSettingsPage,
  "/support": SupportPage,
  "/support/new": CreateTicketPage,
  "/support/live": LiveSupportPage,
  "/support/customer-service": CustomerServicePage,
  "/messages": MessagesPage,
  "/satisfaction": SatisfactionPage,
  "/reviews": ReviewsPage,
  "/leaderboard": LeaderboardPage,
  "/subscription": SubscriptionPage,
  "/subscription/compare": PlanComparisonPage,
  "/subscription/checkout": SubscriptionCheckoutPage,
  "/invoices": InvoicesPage,
  "/referral": ReferralPage,
  "/partners": ReferralPartnersPage,
  "/referral/tasks": ReferralTasksPage,
  "/referral/partners": ReferralPartnersPage,
  "/referral-earnings": ReferralEarningsPage,
  "/job-referral": JobReferralPage,
  "/account-transactions": AccountTransactionsPage,
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
  ...emptySidebarRoutes,
  ...simpleRoutes,
  ...dedicatedRoutes,
  { path: "/performance-score/task/job-result", redirect: "/performance-score" },
  { path: "/performance-score/tasks", redirect: "/performance-score" },
  { path: "/performance-score/details", redirect: "/performance-score" },
  { path: "/performance-score/success", redirect: "/performance-score" },
  { path: "/packages", redirect: "/subscription" },
  { path: "/package-builder", redirect: "/subscription" },
  { path: "/package-checkout", redirect: "/subscription" },
  { path: "/partner/packages", redirect: "/subscription" },
  { path: "/ui-kit", name: "ui-kit", component: UiKitPreviewPage },
  { path: "/referral/partner/:id", name: "referral-partner-detail", component: ReferralPartnerDetailPage },
  { path: "/wallet/transaction/:id", name: "wallet-transaction-detail", component: WalletTransactionDetailPage },
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
