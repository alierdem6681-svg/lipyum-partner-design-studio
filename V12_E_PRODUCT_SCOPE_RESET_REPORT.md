# V12-E Product Scope Reset Report

Tarih: 18 Haziran 2026

## Genel Durum

V12-E ile ürün kapsamı sadeleştirildi. Paketler ürünü aktif navigasyon, route registry, state ve test kapsamından çıkarıldı. `/jobs`, `/my-jobs`, `/calendar` ve `/wallet` route'ları yeni ürün kararına göre boş shell ekranlara dönüştürüldü.

Default Vue boot açılmadı, main merge/deploy yapılmadı ve PR #3 draft kalmalıdır.

## Başlangıç Commit

- `9f6d5c9038e40c4b107fc5860895a7a026a5c2d7`

## Kaldırılan Route'lar

- `/packages`
- `/package-builder`
- `/package-checkout`

Eski URL'ler `/subscription` route'una retired redirect olarak bağlandı.

## Silinen Dosyalar

- `src/pages/PackagesPage.js`
- `src/pages/PackageBuilderPage.js`
- `src/pages/PackageCheckoutPage.js`
- `tests/e2e/packages-flow.spec.js`

## Temizlenen State ve UI Alanları

- `packageTab`
- `growthPackageTab`
- `growthPackageStep`
- `paidPackage`
- Paket sidebar item'ı
- Paket route metadata ve legacy page exportları
- Paket flow quality gate adımı

Abonelik tarafı korunarak metinler "ücretli abonelik" kavramına çekildi.

## Yeni Bottom Labels

- `/my-jobs`: İşler
- `/calendar`: Randevu
- `/jobs`: İş Al
- `/wallet`: Cüzdan

`AppBottomBar.vue` artık `BOTTOM_TABS` listesini tek kaynak olarak kullanır.

## Boş Route Sonuçları

Yeni blank shell route'ları:

- `/jobs`
- `/my-jobs`
- `/calendar`
- `/wallet`

Legacy ve Vue preview motorlarında aynı kapsam uygulanır: header, boş main marker ve bottom bar dışında görünür içerik yoktur.

## Subscription Durumu

- `/subscription` korunur.
- Sidebar'da Aboneliğim görünür.
- Paketler sidebar'dan kaldırılmıştır.

## Superseded Parity

V11 Golden Master parity beklentileri şu route'lar için V12-E product scope tarafından supersede edildi:

- `/jobs`
- `/my-jobs`
- `/calendar`
- `/wallet`
- `/packages`
- `/package-builder`
- `/package-checkout`

Home parity hâlâ ayrı P0 borç olarak aktiftir.

## Test Sonuçları

- `node_modules/node/bin/node --check src/app.js ...`: PASS
- `node_modules/node/bin/node --test tests/architecture/package-feature-removed.test.js`: PASS
- `node_modules/node/bin/node tests/routes.smoke.js`: PASS, 39 route
- V12-E Playwright targeted set: PASS, 21/21
- `npm run test:quality-gate:v12-e`: PASS, iki kez değişikliksiz koşuldu.
- `tests/e2e/forms-and-filters.spec.js`: PASS, wallet testi V12-E blank scope'a güncellendi.
- `npm run test:quality-gate`: İlk koşu obsolete wallet load-more beklentisinde FAIL verdi; test V12-E scope'a göre düzeltildi. Yeniden koşuda yakalanan tüm adımlar PASS ilerledi ve final `npm run build && git diff --check` bağımsız PASS alındı; tool stdout kapanışı nedeniyle genel gate'in son satırı yakalanamadı.
- `npm run build`: PASS.
- `git diff --check`: PASS.

## Kalan Borç

P0:

- `/home` Golden visual parity V12-E kapsamı dışında bırakıldı ve aktif blocker olarak kaldı.

P1:

- Genel full Quality Gate stdout kapanışı daha güvenilir log dosyasına yönlendirilerek tekrar arşivlenebilir.

## Sonuç

Paket ürünü aktif kapsamdan çıkarıldı; bottom route'lar ürün kararına göre boş shell'e döndü. Bu çalışma production cutover değildir.
