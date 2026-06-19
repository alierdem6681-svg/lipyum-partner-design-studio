# V12-A Cutover Report

Tarih: 18 Haziran 2026

## Özet

V12-A kapsamında Lipyum Partner uygulaması tek Vue root app ile boot etmeye başladı. `legacyApp.js` artık app giriş yolunda değildir. Vue Router hash history route sahipliğini aldı, Pinia shell state eklendi ve dört core route tam Vue SFC olarak taşındı.

## Taşınan Core Route'lar

- `/home` → `src/vue/pages/HomePage.vue`
- `/jobs` → `src/vue/pages/JobsPage.vue`
- `/my-jobs` → `src/vue/pages/MyJobsPage.vue`
- `/calendar` → `src/vue/pages/CalendarPage.vue`

## Yeni Shell Bileşenleri

- Global `AppHeader`
- Global `AppBottomBar`
- Global `AppDrawer`
- Global `AppSheet`
- Global `AppModal`
- Global `AppToast`
- `RouterView` tabanlı içerik alanı

## Compatibility Boundary

Henüz SFC'ye taşınmayan route'lar `src/vue/pages/LegacyContentBridge.vue` üzerinden çalışır. Bu bridge eski renderer çıktısını header'sız body içeriği olarak alır ve temel `data-*` etkileşimlerini Vue shell state/router ile bağlar.

## Test Kanıtı

- `npm run check` geçti.
- `npm run build` geçti.
- V12 architecture tests geçti.
- `npm run test:v12-shell` geçti.
- `npm run test:v12-core-routes` geçti.
- `npm run test:v12-legacy-boundary` geçti.
- `npm run test:v12-a` geçti.

## Bilinen Sınır

Tam V12 release completion değildir. Final kabul için tüm bridge route'lar SFC'ye taşınmalı ve `npm run test:quality-gate:v12-a` kod değişmeden iki kez temiz geçmelidir.
