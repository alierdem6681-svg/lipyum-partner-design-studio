import { PlaceholderPage } from "./PageScaffold.js";

export function HomePage() {
  return PlaceholderPage({ title: "Ana Sayfa", subtitle: "İş, performans ve cüzdan özetin.", route: "/home", notes: ["Canlı görünüm geçiş döneminde legacy runtime tarafından render ediliyor."] });
}
