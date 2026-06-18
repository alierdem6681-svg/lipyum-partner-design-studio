# Lipyum Partner WebView Readiness

Tarih: 17 Haziran 2026

Bu proje backend'siz, tıklanabilir mobil arayüz prototipidir. Bu dosya WebView/PWA benzeri kabukta çalışmaya hazırlık kriterlerini izler.

## Hazır Olanlar

- Viewport zoom kapalı: `maximum-scale=1`, `user-scalable=no`.
- Hash route reload sonrası ilgili route korunuyor.
- Bottom bar safe-area alanı için sabit alt boşluk standardı var.
- Header ve bottom bar görünürlüğü Playwright mobile/device matrix ile kontrol ediliyor.
- Loading, error, empty ve skeleton için Vue UI Kit componentleri oluşturuldu.
- Back stack davranışı test ediliyor.
- Offline/health statik dosyası mevcut: `/health.txt`.

## V8 Kontrolleri

- Safe-area ve iPhone simulator smoke testleri: Playwright geometry/mobile/device matrix.
- Native back benzeri davranış: browser/hash back ve `back-button` testleri.
- Deep link placeholder: hash route map.
- V9 deep link resolver: `?route=`, `?deeplink=` ve `/partner/...` path mapping.
- Native association placeholder dosyaları: `public/.well-known/apple-app-site-association.placeholder.json` ve `public/.well-known/assetlinks.placeholder.json`.
- Satisfaction route: native in-app review entegrasyonuna hazır compliance-safe mock UI.
- Canlı destek route'u: `/support/live` mock temsilci bağlantı state'iyle hazır.
- Public partner kart önizleme route'u: `/partner-card-preview` share/embed mock UI ile hazır.
- V10 visual/clickable QA raporları: `VISUAL_QA_REPORT.md`, `CLICKABLE_INVENTORY_REPORT.md`, `V10_QUALITY_AUTOMATION.md`.
- V11 CTA mist animasyonu reduced-motion desteğiyle korunuyor; düşük performanslı WebView'lerde hareket kapatılabilir.
- V11 Bildirimler header aksiyonu doğrudan `/notification-settings` route'una gider; üç nokta menüsüne bağımlılık yoktur.
- V11 Cüzdan header bilgi aksiyonu sheet ile çalışır ve minimum 44px icon-only target standardını korur.
- V11 architecture audit: `V11_ARCHITECTURE_AUDIT.md` release-candidate öncesi kalan legacy boot borcunu açıkça izler.
- Push notification placeholder: `/notifications`.
- Keyboard/focus riski: destek arama ve input alanları P1 test kapsamına alınmalı.
- Error state: `AppErrorState`.
- Empty state: `AppEmptyState`.
- Loading state: `AppLoadingState`.

## Kalan P0/P1 İşler

P0:

- Kullanıcıya görünen ana route'ların Vue page/component yapısına tam taşınması.
- Legacy render motorunun WebView özel edge-case üretmeyecek seviyeye indirilmesi.

P1:

- Offline fallback ekranı.
- Form focus/keyboard open smoke testleri.
- WebView user-agent özel smoke.
- Native bridge placeholder API taslağı.
- Route transition loading state standardı.
- Gerçek Apple Team ID, bundle ID, Android package name ve SHA-256 fingerprint değerleriyle association dosyalarının doldurulması.

P2:

- Lighthouse benzeri performans raporu CI içine eklenebilir.
- Visual diff screenshot eşiği eklenebilir.
