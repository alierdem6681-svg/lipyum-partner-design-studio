# Lipyum Partner Architecture

Tarih: 19 Haziran 2026

## Current Shell

V12-J ile normal uygulama acilisi Vue runtime'dir. `src/app.js` deep link resolver'i calistirir, runtime marker yazar ve normal durumda `src/vue/main.js` uzerinden `createApp(App)` baslatir.

Runtime secimi:

- normal URL: Vue
- `?engine=vue`: Vue
- `?engine=legacy`: legacy rollback

Legacy runtime statik import edilmez ve normal kullanici acilisinda calismaz. Vue boot hatasi sessizce legacy'ye dusmez; gorunur hata paneli ve console error uretir.

## Vue Root

Vue root:

- `src/vue/main.js`
- `createApp(App)`
- Pinia
- Vue Router
- `createWebHashHistory()`
- `src/vue/layouts/AppShell.vue`
- `RouterView`

Shared shell componentleri:

- `AppHeader`
- `AppBottomBar`
- `AppDrawer`
- `AppSheet`
- `AppModal`
- `AppToast`
- `MobileLayout`

## Route Model

Aktif route'lar Vue Router tarafindan yonetilir. Route metadata tek kaynak olarak `src/utils/routeMeta.js` ve bottom bar tek kaynak olarak `BOTTOM_TABS` kullanir.

Route siniflari:

- Dedicated Vue SFC: Home, Profile, Notifications, Support, Reviews, Leaderboard, Subscription, Referral, Job Referral, Partner Card Preview.
- Data-driven Vue page: basit bilgi, ayar ve finans route'lari.
- Blank Vue page: `/jobs`, `/my-jobs`, `/calendar`, `/wallet`.
- Retired redirect: eski package route'lari `/subscription` route'una gider.

## Legacy Policy

`src/legacyApp.js` yalniz rollback icin tutulur. Yeni urun gelistirmesi legacy runtime'a eklenmez. V13 temizliginde rollback ihtiyaci yeniden degerlendirilerek legacy dosyalari kaldirilabilir.

## Quality Gate

Release-candidate gate:

```bash
npm run test:quality-gate:v12-j
```

Final alias:

```bash
npm run test:quality-gate:v12-final
```

Bu gate normal URL'leri test eder; `?engine=vue` zorunlu degildir ve legacy default boot'u kabul etmez.
