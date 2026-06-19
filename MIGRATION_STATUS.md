# Lipyum Partner Migration Status

Tarih: 18 Haziran 2026

Bu dosya V8 itibarıyla kullanıcıya görünen route'ların migration durumunu takip eder.

| Route | Ekran | Vue page | Tailwind/UI Kit | Legacy bağımlılığı | Test coverage | Not |
| --- | --- | --- | --- | --- | --- | --- |
| `/home` | Ana Sayfa | Hayır | Kısmi | Yüksek | Route, mobile, geometry, device, interaction | P0: Home Vue migration gerekli |
| `/jobs` | İş Al | Hayır | Kısmi | Yüksek | Route, mobile, bottom bar | P0: Jobs Vue migration gerekli |
| `/my-jobs` | İşlerim | Hayır | Kısmi | Yüksek | Route, mobile, bottom bar | P0: MyJobs Vue migration gerekli |
| `/calendar` | Takvim | Hayır | Kısmi | Yüksek | Route, mobile, bottom bar | P0: Calendar Vue migration gerekli |
| `/wallet` | Cüzdan | Kısmi/modüler JS | Kısmi | Orta | Route, mobile, forms, lazy list | P1: Vue UI Kit'e taşınmalı |
| `/profile` | Profilim | Kısmi/modüler JS | Kısmi | Orta | Route, mobile, back | P1: Vue UI Kit'e taşınmalı |
| `/notifications` | Bildirimler | Kısmi/modüler JS | Kısmi | Orta | Route, mobile, interaction | P1: Vue UI Kit'e taşınmalı |
| `/support` | Yardım ve Destek | Kısmi/modüler JS | Kısmi | Orta | Route, mobile, accessibility | P1: Vue UI Kit'e taşınmalı |
| `/support/new` | Talep Oluştur | Kısmi/modüler JS | Kısmi | Orta | Route, support-ticket | V10 success reset ve canlı destek yönlendirmesi hazır |
| `/support/live` | Canlı Destek | Kısmi/modüler JS | Kısmi | Orta | Route, support-ticket, clickable inventory | V10 mock canlı sohbet başlangıcı hazır |
| `/satisfaction` | Memnuniyet | Kısmi/modüler JS | Kısmi | Orta | Route, satisfaction | V9 compliance-safe satisfaction flow hazır |
| `/reviews` | Müşteri Yorumları | Kısmi/modüler JS | Kısmi | Orta | Route, mobile, forms | P1: Vue UI Kit'e taşınmalı |
| `/leaderboard` | Liderlik Tablosu | Kısmi/modüler JS | Kısmi | Orta | Route, mobile, forms | P1: Vue UI Kit'e taşınmalı |
| `/referral` | Partner Davet Programı | Hayır | Kısmi | Yüksek | Route, mobile, sidebar | P0: zengin akış Vue migration gerekli |
| `/job-referral` | İş Yönlendirme Programı | Kısmi/modüler JS | Kısmi | Düşük | Route, mobile | Vue pilot alternatifi var |
| `/packages` | Paketler | Hayır | Kısmi | Yüksek | Route, mobile | P0/P1: paket akışı Vue migration gerekli |
| `/subscription` | Aboneliğim | Hayır | Kısmi | Yüksek | Route, mobile | P0/P1: abonelik akışı Vue migration gerekli |
| `/package-builder` | Paket Seçimi | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/package-checkout` | Paket Ödeme | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/bonus` | Bonus Cüzdanı | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/performance-score` | Performans Skoru | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/messages` | Mesajlar | Kısmi/modüler JS | Kısmi | Orta | Route smoke | Support route'a delege |
| `/customers` | Müşteri Defteri | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/invoices` | Faturalarım | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/income-expense` | Gelir/Gider | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/appointment-link` | Randevu Linki | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/about` | Hakkımda | Kısmi/modüler JS | Kısmi | Orta | Route smoke | P1 |
| `/photo-gallery` | Fotoğraflarım | Kısmi/modüler JS | Kısmi | Orta | Back test | P1 |
| `/services` | Hizmetlerim | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/regions` | Bölgelerim | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/working-hours` | Saatlerim | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/team` | Ekibim | Kısmi/modüler JS | Kısmi | Orta | Route smoke | P1 |
| `/capacity` | Kapasitem | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/strategy` | Stratejim | Kısmi/modüler JS | Kısmi | Orta | Route smoke | P1 |
| `/account-settings` | Hesap Ayarları | Kısmi/modüler JS | Kısmi | Orta | Route smoke | P1 |
| `/notification-settings` | Bildirim Ayarları | Kısmi/modüler JS | Kısmi | Orta | Route smoke | P1 |
| `/contact-settings` | İletişim Bilgileri | Kısmi/modüler JS | Kısmi | Orta | Route smoke | P1 |
| `/ui-kit` | UI Kit Preview | Evet/Vue island | Evet | Düşük | Route, mobile | Vue UI Kit preview |
| `/vue-job-referral` | Vue JobReferral Pilot | Evet/Vue island | Evet | Düşük | Route, mobile | Pilot route |
| `/partner-card-preview` | Partner Kartı Önizleme | Kısmi/modüler JS | Kısmi | Orta | Route, V10 QA | Public badge/embed/share mock önizleme |

## Özet

- Tam Vue migration tamamlanmadı.
- V8 ile navigation/header/sidebar/test standardı sertleştirildi.
- V9 ile `/support/new`, `/satisfaction`, deep link resolver ve visual alignment testleri eklendi.
- V10 ile `/support/live`, `/partner-card-preview`, public partner badge/share mock'u ve clickable/visual QA rapor testleri eklendi.
- V11 hardening pass ile route metadata registry, Bildirimler/Cüzdan anlamlı header actions, CTA mist animation, profil grid geometry testi ve `V11_ARCHITECTURE_AUDIT.md` eklendi.
- Bir sonraki büyük migration sırası: `/home`, `/jobs`, `/my-jobs`, `/calendar`, `/referral`, `/packages`, `/subscription`.

## V11 Gerçek Durum

V11 full completion kriterleri henüz sağlanmadı. `src/app.js` hâlâ `legacyApp.js` ile boot ediyor ve yüksek değerli aktif route'larda legacy render fonksiyonları duruyor. Bu durum gizlenmedi; `npm run test:v11-audit` bu borcun P0 olarak dokümante edildiğini doğrular.

P0 kalan ana iş:

- Tek Vue root application + Vue Router hash history.
- `/home`, `/jobs`, `/my-jobs`, `/calendar`, `/referral`, `/packages`, `/subscription`, builder/checkout ve profil alt route'larının gerçek Vue SFC page olarak taşınması.
- Aktif route'larda büyük HTML string render sorumluluğunun kaldırılması.
- Legacy CSS'in aktif route görünüm üretme sorumluluğunun bitirilmesi.
## V12-A Migration Update

Tarih: 18 Haziran 2026

| Route | Durum | Not |
| --- | --- | --- |
| `/home` | Vue SFC | `HomePage.vue`; global AppHeader/AppBottomBar altında çalışır. |
| `/jobs` | Vue SFC | `JobsPage.vue`; filtre ve job detail sheet çalışır. |
| `/my-jobs` | Vue SFC | `MyJobsPage.vue`; filtre ve job detail sheet çalışır. |
| `/calendar` | Vue SFC | `CalendarPage.vue`; gün seçimi ve appointment detail sheet çalışır. |
| Diğer route'lar | Compatibility bridge | `LegacyContentBridge.vue` eski page render çıktılarını global Vue shell içinde gösterir. |

V12-A sonrası kullanıcıya görünen uygulama tek Vue root tarafından mount edilir. Tam ürün migration için `/wallet`, `/profile`, `/notifications`, `/support`, `/referral`, `/packages`, `/subscription` ve alt akışlar sonraki fazlarda SFC'ye taşınmalıdır.
