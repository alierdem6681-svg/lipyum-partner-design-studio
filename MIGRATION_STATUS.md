# Lipyum Partner Migration Status

Tarih: 19 Haziran 2026
Branch: `feature/v12-golden-vue-cutover`
PR: `#3`

## V12-J Durumu

- Normal URL artik Vue runtime aciyor.
- `?engine=vue` geriye donuk olarak Vue acar.
- `?engine=legacy` yalniz explicit rollback runtime acar.
- Legacy runtime statik veya default boot degildir.
- Vue runtime marker: `data-runtime="vue"`.
- Legacy rollback marker: `data-runtime="legacy"`.
- V12 Product Golden baseline degismedi:
  - `tests/golden-master/v12-product-final/home.png`
  - `tests/golden-master/v12-product-final/GOLDEN_MANIFEST.json`
- Home default URL Product Golden parity: PASS.
  - URL: `/#/home`
  - hedef: `<= 0.015`
  - sonuc: `0.011193`
- V12-J release-candidate gate: PASS.
- Paketler aktif urunde yok.
- `/jobs`, `/my-jobs`, `/calendar`, `/wallet` blank bottom route olarak korunur.
- `TAMAMLANMAMIS_ARAYUZ_GOREVLERI.md` dosyasina dokunulmadi.

## Route Durumu

| Route | Sinif | Final page/component | Runtime | Test coverage | Durum |
| --- | --- | --- | --- | --- | --- |
| `/home` | Dedicated Vue SFC | `HomePage.vue` | Default Vue | V12-J Product Golden visual/content/interaction | PASS |
| `/jobs` | Blank Vue page | `JobsPage.vue` | Default Vue | blank bottom route | PASS |
| `/my-jobs` | Blank Vue page | `MyJobsPage.vue` | Default Vue | blank bottom route | PASS |
| `/calendar` | Blank Vue page | `CalendarPage.vue` | Default Vue | blank bottom route | PASS |
| `/wallet` | Blank Vue page | `WalletPage.vue` | Default Vue | blank bottom route | PASS |
| `/profile` | Dedicated Vue SFC | `ProfilePage.vue` | Default Vue | rich route + badges | PASS |
| `/partner-card-preview` | Dedicated Vue SFC | `PartnerCardPreviewPage.vue` | Default Vue | rich route | PASS |
| `/photo-gallery` | Dedicated Vue wrapper | `PhotoGalleryPage.vue` | Default Vue | rich route | PASS |
| `/notifications` | Dedicated Vue SFC | `NotificationsPage.vue` | Default Vue | rich route | PASS |
| `/support` | Dedicated Vue SFC | `SupportPage.vue` | Default Vue | rich route | PASS |
| `/support/new` | Dedicated Vue SFC | `CreateTicketPage.vue` | Default Vue | ticket flow | PASS |
| `/support/live` | Dedicated Vue SFC | `LiveSupportPage.vue` | Default Vue | 5 sn chat flow | PASS |
| `/support/customer-service` | Dedicated Vue SFC | `CustomerServicePage.vue` | Default Vue | subscription access | PASS |
| `/messages` | Dedicated Vue wrapper | `MessagesPage.vue` | Default Vue | rich route | PASS |
| `/satisfaction` | Dedicated Vue wrapper | `SatisfactionPage.vue` | Default Vue | satisfaction flow | PASS |
| `/reviews` | Dedicated Vue SFC | `ReviewsPage.vue` | Default Vue | reviews flow | PASS |
| `/leaderboard` | Dedicated Vue SFC | `LeaderboardPage.vue` | Default Vue | leaderboard flow | PASS |
| `/subscription` | Dedicated Vue SFC | `SubscriptionPage.vue` | Default Vue | subscription retained | PASS |
| `/referral` | Dedicated Vue SFC | `ReferralPage.vue` | Default Vue | referral flow | PASS |
| `/partners` | Dedicated Vue SFC | `ReferralPartnersPage.vue` | Default Vue | partner list | PASS |
| `/referral/tasks` | Dedicated Vue wrapper | `ReferralTasksPage.vue` | Default Vue | referral flow | PASS |
| `/referral/partners` | Dedicated Vue SFC | `ReferralPartnersPage.vue` | Default Vue | referral flow | PASS |
| `/referral/partner/:id` | Dedicated Vue SFC | `ReferralPartnerDetailPage.vue` | Default Vue | detail/back flow | PASS |
| `/referral-earnings` | Dedicated Vue wrapper | `ReferralEarningsPage.vue` | Default Vue | earnings flow | PASS |
| `/job-referral` | Dedicated Vue wrapper | `JobReferralPage.vue` | Default Vue | job referral flow | PASS |
| `/about`, `/services`, `/regions`, `/working-hours`, `/team`, `/capacity`, `/strategy` | Data-driven Vue page | `ContentRoutePage.vue` | Default Vue | route acceptance | PASS |
| `/account-settings`, `/notification-settings`, `/contact-settings` | Data-driven Vue page | `ContentRoutePage.vue` | Default Vue | route acceptance | PASS |
| `/bonus`, `/performance-score`, `/customers`, `/invoices`, `/income-expense`, `/appointment-link` | Data-driven Vue page | `ContentRoutePage.vue` | Default Vue | route acceptance | PASS |
| `/packages` | Retired redirect | `/subscription` | Default Vue | retired route | PASS |
| `/package-builder` | Retired redirect | `/subscription` | Default Vue | retired route | PASS |
| `/package-checkout` | Retired redirect | `/subscription` | Default Vue | retired route | PASS |
| `/partner/packages` | Retired redirect | `/subscription` | Default Vue | retired route | PASS |
| `/ui-kit` | Internal route | `UiKitPreviewPage.vue` | Default Vue | architecture smoke | PASS |

## V12-J Gate

Komut:

```bash
npm run test:quality-gate:v12-j
```

Kapsam:

- syntax
- lint/syntax
- architecture
- default Vue runtime
- explicit legacy rollback
- no legacy default boot
- Vue Router ownership
- route acceptance
- blank bottom routes
- retired redirects
- rich route outcomes
- Home default Product Golden parity
- Home content/interaction contract
- accessibility
- clickable outcome coverage
- performance smoke
- build
- `git diff --check`

## Kalan Risk

- Legacy runtime rollback icin korunur, yeni urun gelistirmesi almaz.
- Main merge ve production Vercel deploy kullanici gorsel onayi olmadan yapilmaz.
