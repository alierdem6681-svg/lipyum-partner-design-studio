import JobReferralVuePage from "../pages/JobReferralVuePage.vue";
import UiKitPreviewPage from "../pages/UiKitPreviewPage.vue";

export const vueRoutes = [
  { path: "/ui-kit", title: "Vue UI Kit", component: UiKitPreviewPage },
  { path: "/vue-job-referral", title: "İş Yönlendirme Vue Pilot", component: JobReferralVuePage },
];

export function resolveVuePage(name) {
  if (name === "job-referral-vue") return JobReferralVuePage;
  return UiKitPreviewPage;
}
