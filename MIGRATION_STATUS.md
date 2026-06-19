# Lipyum Partner V12-G Migration Status

Tarih: 19 Haziran 2026
Branch: `feature/v12-golden-vue-cutover`
PR: `#3` draft

## Özet

- Default runtime artık Vue: `src/app.js` normal açılışta `src/vue/main.js` başlatır.
- Legacy runtime yalnız kontrollü rollback için tutuldu: `?engine=legacy`.
- Aktif route'larda `LegacyContentBridge` yok.
- Debug `Clickable coverage` kartı kullanıcı arayüzünden kaldırıldı.
- Paketler üründen kaldırılmış durumda; eski paket URL'leri `/subscription` route'una yönlenir.
- `/jobs`, `/my-jobs`, `/calendar`, `/wallet` blank bottom route olarak korunur.
- V12-G tamamlandı değildir: Home strict visual parity `FAIL`, diff `0.053682`, hedef `<= 0.015`.

## Route Durumu

| Route | Durum | Final page/component | Tailwind/UI Kit | Legacy dependency | Test coverage | Risk |
| --- | --- | --- | --- | --- | --- | --- |
| `/home` | Dedicated Vue SFC | `HomePage.vue` | Kısmi UI Kit + Golden class parity | Yok | `v12-home`, V12-G gate Home visual | P1: visual diff `0.053682` |
| `/jobs` | Blank Vue page | `JobsPage.vue` | UI Kit | Yok | blank bottom route | Yok |
| `/my-jobs` | Blank Vue page | `MyJobsPage.vue` | UI Kit | Yok | blank bottom route | Yok |
| `/calendar` | Blank Vue page | `CalendarPage.vue` | UI Kit | Yok | blank bottom route | Yok |
| `/wallet` | Blank Vue page | `WalletPage.vue` | UI Kit | Yok | blank bottom route | Yok |
| `/profile` | Dedicated Vue SFC | `ProfilePage.vue` | UI Kit | Yok | V12-G rich routes, profile badges | Düşük |
| `/partner-card-preview` | Dedicated Vue SFC | `PartnerCardPreviewPage.vue` | UI Kit | Yok | V12-G rich routes | Düşük |
| `/photo-gallery` | Dedicated Vue SFC wrapper | `PhotoGalleryPage.vue` | UI Kit | Yok | V12-G rich routes | Orta: gallery mock |
| `/about` | Data-driven Vue page | `ContentRoutePage.vue` | UI Kit | Yok | V12-G simple routes | Düşük |
| `/services` | Data-driven Vue page | `ContentRoutePage.vue` | UI Kit | Yok | V12-G simple routes | Düşük |
| `/regions` | Data-driven Vue page | `ContentRoutePage.vue` | UI Kit | Yok | V12-G simple routes | Düşük |
| `/working-hours` | Data-driven Vue page | `ContentRoutePage.vue` | UI Kit | Yok | V12-G simple routes | Düşük |
| `/team` | Data-driven Vue page | `ContentRoutePage.vue` | UI Kit | Yok | V12-G simple routes | Düşük |
| `/capacity` | Data-driven Vue page | `ContentRoutePage.vue` | UI Kit | Yok | V12-G simple routes | Düşük |
| `/strategy` | Data-driven Vue page | `ContentRoutePage.vue` | UI Kit | Yok | V12-G simple routes | Düşük |
| `/account-settings` | Data-driven Vue page | `ContentRoutePage.vue` | UI Kit | Yok | V12-G simple routes | Düşük |
| `/notification-settings` | Data-driven Vue page | `ContentRoutePage.vue` | UI Kit | Yok | V12-G simple routes | Düşük |
| `/contact-settings` | Data-driven Vue page | `ContentRoutePage.vue` | UI Kit | Yok | V12-G simple routes | Düşük |
| `/notifications` | Dedicated Vue SFC | `NotificationsPage.vue` | UI Kit | Yok | V12-G rich routes | Düşük |
| `/support` | Dedicated Vue SFC | `SupportPage.vue` | UI Kit | Yok | V12-G rich routes | Düşük |
| `/support/new` | Dedicated Vue SFC | `CreateTicketPage.vue` | UI Kit | Yok | V12-G rich routes, support ticket | Düşük |
| `/support/live` | Dedicated Vue SFC | `LiveSupportPage.vue` | UI Kit | Yok | V12-G rich routes, 5 sn chat flow | Düşük |
| `/support/customer-service` | Dedicated Vue SFC | `CustomerServicePage.vue` | UI Kit | Yok | V12-G rich routes | Düşük |
| `/messages` | Dedicated Vue SFC wrapper | `MessagesPage.vue` | UI Kit | Yok | V12-G rich routes | Orta: mock content |
| `/satisfaction` | Dedicated Vue SFC wrapper | `SatisfactionPage.vue` | UI Kit | Yok | V12-G rich routes | Orta: mock content |
| `/reviews` | Dedicated Vue SFC | `ReviewsPage.vue` | UI Kit | Yok | V12-G rich routes | Düşük |
| `/leaderboard` | Dedicated Vue SFC | `LeaderboardPage.vue` | UI Kit | Yok | V12-G rich routes | Düşük |
| `/subscription` | Dedicated Vue SFC | `SubscriptionPage.vue` | UI Kit | Yok | V12-G rich routes, subscription retained | Düşük |
| `/referral` | Dedicated Vue SFC | `ReferralPage.vue` | UI Kit | Yok | V12-G rich routes, referral flow | Düşük |
| `/partners` | Dedicated Vue SFC | `ReferralPartnersPage.vue` | UI Kit | Yok | V12-G rich routes | Düşük |
| `/referral/tasks` | Dedicated Vue SFC wrapper | `ReferralTasksPage.vue` | UI Kit | Yok | V12-G rich routes | Orta |
| `/referral/partners` | Dedicated Vue SFC | `ReferralPartnersPage.vue` | UI Kit | Yok | V12-G rich routes | Düşük |
| `/referral/partner/:id` | Dedicated Vue SFC | `ReferralPartnerDetailPage.vue` | UI Kit | Yok | V12-G rich routes | Düşük |
| `/referral-earnings` | Dedicated Vue SFC wrapper | `ReferralEarningsPage.vue` | UI Kit | Yok | V12-G rich routes | Orta |
| `/job-referral` | Dedicated Vue SFC wrapper | `JobReferralPage.vue` | UI Kit | Yok | V12-G rich routes | Orta |
| `/bonus` | Data-driven Vue page | `ContentRoutePage.vue` | UI Kit | Yok | V12-G simple routes | Düşük |
| `/performance-score` | Data-driven Vue page | `ContentRoutePage.vue` | UI Kit | Yok | V12-G simple routes | Düşük |
| `/customers` | Data-driven Vue page | `ContentRoutePage.vue` | UI Kit | Yok | V12-G simple routes | Düşük |
| `/invoices` | Data-driven Vue page | `ContentRoutePage.vue` | UI Kit | Yok | V12-G simple routes | Düşük |
| `/income-expense` | Data-driven Vue page | `ContentRoutePage.vue` | UI Kit | Yok | V12-G simple routes | Düşük |
| `/appointment-link` | Data-driven Vue page | `ContentRoutePage.vue` | UI Kit | Yok | V12-G simple routes | Düşük |
| `/packages` | Retired redirect | `/subscription` | Yok | Yok | retired package routes | Yok |
| `/package-builder` | Retired redirect | `/subscription` | Yok | Yok | retired package routes | Yok |
| `/package-checkout` | Retired redirect | `/subscription` | Yok | Yok | retired package routes | Yok |
| `/partner/packages` | Retired redirect | `/subscription` | Yok | Yok | retired package routes | Yok |
| `/ui-kit` | Internal preview route | `UiKitPreviewPage.vue` | UI Kit | Yok | architecture | Kullanıcı nav'ında yok |

## Gate Durumu

Geçen kontroller:

- Syntax: PASS
- V12-G architecture: PASS
- Product scope blank/retired routes: PASS
- Simple content routes: PASS
- Rich route outcomes: PASS
- Build smoke: PASS

Kalan blocker:

- Home strict visual parity: FAIL
  - diff: `0.053682`
  - hedef: `<= 0.015`
  - rapor: `tests/golden-master/v12-feature-preview/V12_CORE_PIXEL_DIFF_REPORT.json`

Bu blocker kapanmadan V12-G tamamlandı sayılmaz.
