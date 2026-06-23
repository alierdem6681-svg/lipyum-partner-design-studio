import { PlaceholderPage } from "../components/PlaceholderPage.js";

export function SubscriptionPage() {
  return PlaceholderPage({
    title: "Aboneliğim",
    subtitle: "Gold, Plus veya VIP planını seç; ödeme sonrası avantajların hemen aktif olur.",
    route: "/subscription",
    notes: [
      "Free mevcut durum olarak kalır.",
      "Gold, Plus ve VIP doğrudan seçilebilir.",
      "Her plan otomatik yenilenir ve istenen zaman iptal edilebilir.",
    ],
  });
}
