# Lipyum Partner Interaction Contract

Bu dosya uygulamadaki kritik etkileşimlerin ürün sözleşmesidir. Yeni geliştirme yapılırken bu davranışlar korunmalı, değişiklik gerekiyorsa testler ve bu sözleşme birlikte güncellenmelidir.

## Global

- `hamburger-button` sidebar menüsünü açar.
- `sidebar-close` sidebar menüsünü kapatır.
- `sidebar-overlay` boş alana tıklandığında açık sheet/sidebar alanını kapatır.
- `notification-button` `/notifications` route'una gider.
- `profile-button` `/profile` route'una gider.
- `back-button` navigation stack içindeki önceki route'a döner; stack yoksa `/home` fallback kullanır.
- `bottom-tab-home` `/home` route'una gider.
- `bottom-tab-jobs` `/my-jobs` route'una gider.
- `bottom-tab-calendar` `/calendar` route'una gider.
- `bottom-tab-wallet` `/wallet` route'una gider.
- `bottom-cta-job` `/jobs` route'una gider.

## Sidebar

- Sidebar açıldığında `sidebar-drawer` görünür olmalıdır.
- Sidebar menü item'ları route-driven çalışmalıdır.
- Menü item seçildiğinde ilgili route açılmalı ve sidebar kapanmalıdır.
- Kazanç Ortaklığı altında `Partner Davet Programı` `/referral` route'una gider.
- Kazanç Ortaklığı altında `İş Yönlendirme Programı` `/job-referral` route'una gider.

## Home

- Performans skoru alanındaki skor artır aksiyonu `/performance-score` route'una gider.
- Bakiye yükle aksiyonu kredi yükleme sheet/akışını açar.
- Bonus/kredi dönüştürme aksiyonu ilgili sheet/akışı açar.
- Bottom bar ve CTA hiçbir zaman ana içerik metnini kapatmamalıdır.

## Notifications

- `notifications-filter-all` okunan bildirimleri göster/gizle davranışını yönetir.
- `notifications-mark-read` okundu yap akışını başlatır.
- `notification-card` doğru bildirim aksiyonuna veya detayına gider.
- Bildirim listesi bottom bar altında kalmamalı ve güvenli alt boşluk bırakmalıdır.

## Support

- Destek arama alanı yazı girişini korumalıdır; tek harfte klavye kapanmasına neden olmamalıdır.
- Destek kategori kartları ilgili yardım akışına gider.
- Temsilciye yaz aksiyonu canlı destek/chat sheet açar.
- Açık talepler ilgili talepler ekranını veya sheet'ini açar.

## Reviews

- `reviews-filter-chip` yorum listesini filtreler.
- `review-reply-button` yanıt yazma akışını açar.
- Yorum listesi pagination kullanmaz; lazy/load-more standardını kullanır.

## Wallet

- `wallet-topup-button` bakiye yükleme akışını açar.
- `wallet-convert-bonus-button` bonusu krediye çevirme akışını açar.
- `wallet-load-more` cüzdan hareketlerinde sonraki bölümü yükler.

## Leaderboard

- `leaderboard-sector-select` sektör ligi filtresini uygular ve şehir filtresini sıfırlayabilir.
- `leaderboard-city-select` şehir ligi filtresini uygular ve sektör filtresini sıfırlayabilir.
- `leaderboard-load-more` sıralama listesindeki sonraki bölümü yükler.
- Başka partnerlerin iş sayısı gösterilmez; sıralama puanı gösterilir.

## Referral

- `referral-invite-button` partner davet akışını başlatır.
- `referral-rail` yatay swipe/drag ile kaydırılabilir olmalıdır.
- `referral-partner-card` partner detayını açar.
- `referral-partner-detail` seçili partnerin telefon, WhatsApp, durum ve kazanç detaylarını gösterir.

## Packages

- `package-card` paket seçimi için tıklanabilir karttır.
- `package-select-button` paketi seçer.
- `package-checkout-button` ödeme route'una gider.

## Test Kuralı

Bu sözleşmedeki global navigasyon, sidebar, bottom bar, back stack ve form/filter davranışları Playwright interaction testleri ile korunur. Yeni kritik etkileşim eklendiğinde `data-testid`, test ve bu dosya aynı commit içinde güncellenmelidir.
