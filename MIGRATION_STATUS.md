# Lipyum Partner Migration Status

Tarih: 19 Haziran 2026
Branch: `feature/v12-golden-vue-cutover`
PR: `#3` draft

## V12-I Durumu

- Canli kullanici acilisi stabil urun tasarimini korur.
- Vue runtime kontrollu olarak `?engine=vue` ile dogrulanir.
- Legacy fallback yalniz stabil urun gorunumunu ve rollback ihtiyacini korumak icindir.
- V11 historical Golden baseline degistirilmedi.
- V12 Product Golden baseline olusturuldu:
  - `tests/golden-master/v12-product-final/home.png`
  - `tests/golden-master/v12-product-final/GOLDEN_MANIFEST.json`
- Home Vue strict product parity: PASS.
  - hedef: `<= 0.015`
  - sonuc: `0.011193`
- Final gate iki kez kod degismeden PASS.
- Paketler aktif urunde yok.
- `/jobs`, `/my-jobs`, `/calendar`, `/wallet` blank bottom route olarak korunur.
- `TAMAMLANMAMIS_ARAYUZ_GOREVLERI.md` dosyasina dokunulmadi.

## Route Durumu

| Route | Sinif | Final page/component | Legacy dependency | Test coverage | Durum |
| --- | --- | --- | --- | --- | --- |
| `/home` | Dedicated Vue SFC | `HomePage.vue` | Stabil fallback var | V12-I product visual, content, interaction | PASS |
| `/jobs` | Blank Vue page | `JobsPage.vue` | Yok | blank bottom route | PASS |
| `/my-jobs` | Blank Vue page | `MyJobsPage.vue` | Yok | blank bottom route | PASS |
| `/calendar` | Blank Vue page | `CalendarPage.vue` | Yok | blank bottom route | PASS |
| `/wallet` | Blank Vue page | `WalletPage.vue` | Yok | blank bottom route | PASS |
| `/profile` | Dedicated Vue SFC | `ProfilePage.vue` | Yok | V12-G/V12-I rich routes | PASS |
| `/partner-card-preview` | Dedicated Vue SFC | `PartnerCardPreviewPage.vue` | Yok | V12-G/V12-I rich routes | PASS |
| `/photo-gallery` | Dedicated Vue wrapper | `PhotoGalleryPage.vue` | Yok | V12-G/V12-I rich routes | PASS |
| `/notifications` | Dedicated Vue SFC | `NotificationsPage.vue` | Yok | V12-G/V12-I rich routes | PASS |
| `/support` | Dedicated Vue SFC | `SupportPage.vue` | Yok | V12-G/V12-I rich routes | PASS |
| `/support/new` | Dedicated Vue SFC | `CreateTicketPage.vue` | Yok | ticket flow | PASS |
| `/support/live` | Dedicated Vue SFC | `LiveSupportPage.vue` | Yok | 5 sn chat flow | PASS |
| `/support/customer-service` | Dedicated Vue SFC | `CustomerServicePage.vue` | Yok | subscription access | PASS |
| `/messages` | Dedicated Vue wrapper | `MessagesPage.vue` | Yok | V12-G/V12-I rich routes | PASS |
| `/satisfaction` | Dedicated Vue wrapper | `SatisfactionPage.vue` | Yok | satisfaction flow | PASS |
| `/reviews` | Dedicated Vue SFC | `ReviewsPage.vue` | Yok | reviews flow | PASS |
| `/leaderboard` | Dedicated Vue SFC | `LeaderboardPage.vue` | Yok | leaderboard flow | PASS |
| `/subscription` | Dedicated Vue SFC | `SubscriptionPage.vue` | Yok | subscription retained | PASS |
| `/referral` | Dedicated Vue SFC | `ReferralPage.vue` | Yok | referral flow | PASS |
| `/partners` | Dedicated Vue SFC | `ReferralPartnersPage.vue` | Yok | referral partners | PASS |
| `/referral/tasks` | Dedicated Vue wrapper | `ReferralTasksPage.vue` | Yok | referral flow | PASS |
| `/referral/partners` | Dedicated Vue SFC | `ReferralPartnersPage.vue` | Yok | referral flow | PASS |
| `/referral/partner/:id` | Dedicated Vue SFC | `ReferralPartnerDetailPage.vue` | Yok | detail/back flow | PASS |
| `/referral-earnings` | Dedicated Vue wrapper | `ReferralEarningsPage.vue` | Yok | earnings flow | PASS |
| `/job-referral` | Dedicated Vue wrapper | `JobReferralPage.vue` | Yok | job referral flow | PASS |
| `/about` | Data-driven Vue page | `ContentRoutePage.vue` | Yok | simple content route | PASS |
| `/services` | Data-driven Vue page | `ContentRoutePage.vue` | Yok | simple content route | PASS |
| `/regions` | Data-driven Vue page | `ContentRoutePage.vue` | Yok | simple content route | PASS |
| `/working-hours` | Data-driven Vue page | `ContentRoutePage.vue` | Yok | simple content route | PASS |
| `/team` | Data-driven Vue page | `ContentRoutePage.vue` | Yok | simple content route | PASS |
| `/capacity` | Data-driven Vue page | `ContentRoutePage.vue` | Yok | simple content route | PASS |
| `/strategy` | Data-driven Vue page | `ContentRoutePage.vue` | Yok | simple content route | PASS |
| `/account-settings` | Data-driven Vue page | `ContentRoutePage.vue` | Yok | simple content route | PASS |
| `/notification-settings` | Data-driven Vue page | `ContentRoutePage.vue` | Yok | simple content route | PASS |
| `/contact-settings` | Data-driven Vue page | `ContentRoutePage.vue` | Yok | simple content route | PASS |
| `/bonus` | Data-driven Vue page | `ContentRoutePage.vue` | Yok | simple content route | PASS |
| `/performance-score` | Data-driven Vue page | `ContentRoutePage.vue` | Yok | simple content route | PASS |
| `/customers` | Data-driven Vue page | `ContentRoutePage.vue` | Yok | simple content route | PASS |
| `/invoices` | Data-driven Vue page | `ContentRoutePage.vue` | Yok | simple content route | PASS |
| `/income-expense` | Data-driven Vue page | `ContentRoutePage.vue` | Yok | simple content route | PASS |
| `/appointment-link` | Data-driven Vue page | `ContentRoutePage.vue` | Yok | simple content route | PASS |
| `/packages` | Retired redirect | `/subscription` | Yok | retired package route | PASS |
| `/package-builder` | Retired redirect | `/subscription` | Yok | retired package route | PASS |
| `/package-checkout` | Retired redirect | `/subscription` | Yok | retired package route | PASS |
| `/partner/packages` | Retired redirect | `/subscription` | Yok | retired package route | PASS |
| `/ui-kit` | Internal route | `UiKitPreviewPage.vue` | Yok | architecture smoke | PASS |

## V12-I Final Gate

Komut:

```bash
npm run test:quality-gate:v12-final
```

Sonuc:

- Run 1: PASS
- Run 2: PASS
- Run 1 SHA256: `2E692EF9115F794AF60694031B78B3D745704189CCC42569ECAB00FEE7989AE6`
- Run 2 SHA256: `4E775C992BB4D4D86013E57CDF1E8FB3BDBB5FC5D3A8CFB1D8FD3D4A7A698401`

## Kalan Risk

- Default acilista stabil urun gorunumu korunur; Vue dogrulamasi `?engine=vue` ile yapilir. Bu karar, canli tasarimin tekrar bozulmamasi icin bilerek korunmustur.
- PR #3 draft kalir; main merge ve production deploy kullanici onayi olmadan yapilmaz.
