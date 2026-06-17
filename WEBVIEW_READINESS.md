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

P2:

- Lighthouse benzeri performans raporu CI içine eklenebilir.
- Visual diff screenshot eşiği eklenebilir.
