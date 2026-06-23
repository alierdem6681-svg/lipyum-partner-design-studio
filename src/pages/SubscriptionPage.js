import { PlaceholderPage } from "./PageScaffold.js";

export function SubscriptionPage() {
  return PlaceholderPage({
    title: "Abonelik",
    subtitle: "Plus, Gold veya VIP planını seç; ödeme sonrası avantajların hemen aktif olur.",
    route: "/subscription",
    notes: [
      "Free mevcut durum olarak kalır.",
      "Plus, Gold ve VIP doğrudan seçilebilir.",
      "Her plan otomatik yenilenir ve istenen zaman iptal edilebilir.",
    ],
  });
}