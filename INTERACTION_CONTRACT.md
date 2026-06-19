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
- Destek grubu altında `Talep Oluştur` `/support/new` route'una gider.
- Destek grubu altında `Canlı Destek` `/support/live` route'una gider.
- Sidebar içinde `Yardım ve Destek` menü adı kalmamalıdır.
- Sticky/geniş `drawer-support-card` tekrar eklenmemelidir.
- Kazanç Ortaklığı altında `Partner Davet Programı` `/referral` route'una gider.
- Kazanç Ortaklığı altında `İş Yönlendirme Programı` `/job-referral` route'una gider.
- Kazanç Ortaklığı item'ları sidebar içinde açıklama satırı göstermez.

## Header

- Tüm route'larda `app-header` görünür olmalıdır.
- Home varyantı hamburger + status pill + notification + profile düzenini kullanır.
- Section varyantı hamburger + title/subtitle + notification/profile düzenini kullanır.
- Subpage varyantı back + title/subtitle + reserved right action alanını kullanır.
- Sol aksiyon, sağ aksiyon ve ikon touch target alanları minimum 44x44 px olmalıdır.
- Title/subtitle tek satır ellipsis ile kalır; header yüksekliği metin yüzünden büyümez.

## Home

- Performans skoru alanındaki skor artır aksiyonu `/performance-score` route'una gider.
- Bakiye yükle aksiyonu kredi yükleme sheet/akışını açar.
- Bonus/kredi dönüştürme aksiyonu ilgili sheet/akışı açar.
- Sheet close icon `sheet-close-button` içinde optik merkezde durur.
- Bottom bar ve CTA hiçbir zaman ana içerik metnini kapatmamalıdır.
- Orta CTA sis efekti ilk açılışta görünmez; 2 saniye gecikmeyle CTA içinde hareket eder ve reduced-motion modunda animasyon çalışmaz.

## Profile

- Profil rozetleri başlangıçta ilk 3 rozet + `+N` butonu olarak görünür.
- `+N` butonuna basıldığında gizli rozetler görünür ve `+N` butonu DOM'dan kalkar.
- Aynı route instance içinde rozetleri tekrar kapatma davranışı yoktur.
- Başka route'a gidip profile dönünce rozetler tekrar başlangıç durumuna döner.

## Notifications

- `notifications-filter-all` okunan bildirimleri göster/gizle davranışını yönetir.
- `notifications-mark-read` okundu yap akışını başlatır.
- `notification-card` doğru bildirim aksiyonuna veya detayına gider.
- Header sağ aksiyonu `notification-settings-button` ile `/notification-settings` route'una gider; anlamsız üç nokta aksiyonu kullanılmaz.
- Bildirim listesi bottom bar altında kalmamalı ve güvenli alt boşluk bırakmalıdır.

## Support

- Destek arama alanı yazı girişini korumalıdır; tek harfte klavye kapanmasına neden olmamalıdır.
- Destek kategori kartları ilgili yardım akışına gider.
- `Canlı Destek` aksiyonu `/support/live` route'unu açar.
- `/support/live` başlık ve kısa açıklama alanlarını gösterir; `Canlı sohbete başla` butonu `Temsilci bağlanıyor` state'ini açar.
- Açık talepler ilgili talepler ekranını veya sheet'ini açar.
- `/support/new` mock talep formunu açar.
- Talep Oluştur submit mock success gösterir ve `LP-000123` talep numarasını yazar.
- Başarı state'indeki `Yeni Talep Oluştur` butonu formu yeniden açar.
- Sidebar Destek grubunda yalnızca `Talep Oluştur` ve `Canlı Destek` route item'ları bulunur.

## Deep Links

- `?route=/wallet` gibi route parametreleri ilgili hash route'u açar.
- `?deeplink=support-new` gibi alias parametreleri ilgili route'u açar.
- `/partner/support/new` gibi external path'ler SPA shell üzerinden `/support/new` route'una çözülür.
- Bilinmeyen deep link `/home` fallback kullanır.

## Satisfaction

- `/satisfaction` 1-5 yıldız memnuniyet akışını gösterir.
- 5 yıldızda kullanıcı onayına bağlı market değerlendirme CTA'sı görünür.
- 1-4 yıldızda iyileştirme formu ve mock destek kaydı success state'i görünür.
- UI kullanıcı adına otomatik market yorumu gönderildiğini iddia etmez.

## Reviews

- `reviews-filter-chip` yorum listesini filtreler.
- `review-reply-button` yanıt yazma akışını açar.
- Yorum listesi pagination kullanmaz; lazy/load-more standardını kullanır.

## Wallet

- `wallet-topup-button` bakiye yükleme akışını açar.
- `wallet-convert-bonus-button` bonusu krediye çevirme akışını açar.
- `wallet-load-more` cüzdan hareketlerinde sonraki bölümü yükler.
- Header sağ aksiyonu `wallet-info-button` ile kredi/bonus açıklama sheet'ini açar.

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

## Public Partner Card

- Profil kartındaki `partner-share-button` partner paylaşım sheet'ini açar.
- Partner share sheet profil linki kopyalama, WhatsApp paylaşım mock'u ve embed kodu kopyalama aksiyonlarını içerir.
- `/partner-card-preview` public partner rozeti ve embed kartının önizlemesini gösterir.
- Profil rozetlerindeki `+N` butonu tek yönlüdür: gizli rozetleri açar, buton kaybolur ve kapatma/collapse davranışı sunmaz.
- Kullanıcı route değiştirip profile geri döndüğünde rozet state'i başlangıç durumuna döner.

## V12-E Scope Contract

Aktif bottom navigation:

- `bottom-tab-home` -> `/home`
- `bottom-tab-jobs` -> `/my-jobs`, label `İşler`
- `bottom-cta-job` -> `/jobs`, label `İş Al`
- `bottom-tab-calendar` -> `/calendar`, label `Randevu`
- `bottom-tab-wallet` -> `/wallet`, label `Cüzdan`

Blank bottom routes:

- `/jobs`
- `/my-jobs`
- `/calendar`
- `/wallet`

Bu route'larda page content içinde görünür action bulunmamalıdır. Header ve bottom bar interaction'ları global sözleşmeye tabidir.

Retired package routes:

- `/packages` -> `/subscription`
- `/package-builder` -> `/subscription`
- `/package-checkout` -> `/subscription`
- `/partner/packages` -> `/subscription`

## Test Kuralı

Bu sözleşmedeki global navigasyon, sidebar, bottom bar, back stack ve form/filter davranışları Playwright interaction testleri ile korunur. Yeni kritik etkileşim eklendiğinde `data-testid`, test ve bu dosya aynı commit içinde güncellenmelidir.
