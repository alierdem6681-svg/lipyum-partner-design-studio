# Lipyum Partner Refactor Raporu

Tarih: 17 Haziran 2026

## 1. Genel Durum

- Refactor tamamlanma seviyesi: yaklaşık %45.
- Proje artık tek `index.html` veya tek `app.js` merkezli değil; `index.html` app shell olarak kaldı, `src/app.js` ise sadece başlatıcı modül oldu.
- Büyük render motoru geçiş güvenliği için `src/legacyApp.js` içine taşındı. Yani merkezi legacy bağımlılığı hâlâ var.
- Canlıya alınabilirlik: görsel prototip canlı URL’de korunuyor; mimari canlıya yaklaşmaya başladı ancak `legacyApp.js` parçalanmadan production kalitesi tamamlanmış sayılmaz.

## 2. Dosya Yapısı

Oluşturulan dosyalar:

- `src/legacyApp.js`
- `src/utils/constants.js`
- `src/components/Badge.js`
- `src/components/Chip.js`
- `src/components/SectionTitle.js`
- `src/pages/PageScaffold.js`
- `src/pages/index.js`
- `src/pages/routePages.js`
- `src/pages/CustomersPage.js`
- `src/pages/IncomeExpensePage.js`
- `src/pages/InvoicesPage.js`
- `src/pages/MessagesPage.js`
- `src/pages/AppointmentLinkPage.js`
- `src/pages/BonusPage.js`
- `src/pages/PackageBuilderPage.js`
- `src/pages/PackageCheckoutPage.js`
- `src/pages/PerformanceScorePage.js`
- `src/pages/ReferralEarningsPage.js`
- `REFACTOR_REPORT.md`

Değiştirilen dosyalar:

- `src/app.js`
- `src/router.js`
- `src/state.js`
- `src/data/mockData.js`
- `src/components/BackButton.js`
- `src/components/BottomBar.js`
- `src/components/Button.js`
- `src/components/Card.js`
- `src/components/Header.js`
- `src/components/MenuList.js`
- `src/components/PageContainer.js`
- `src/components/PerformanceCard.js`
- `src/components/ProfileCard.js`
- `src/components/Sidebar.js`
- `src/components/SmartStatusCard.js`
- `src/components/StatusPill.js`
- `src/components/SupportCard.js`
- `src/components/WalletBonusCards.js`
- `src/pages/*.js`
- `src/styles/tokens.css`
- `src/styles/components.css`
- `package.json`

Silinen veya kullanılmayan dosyalar:

- Silinen production dosyası yok.
- Önceki 3 satırlık placeholder component/page içerikleri gerçek modül içerikleriyle değiştirildi.

`index.html` içinde kalanlar:

- Meta tag’ler
- Stylesheet importları
- `#app` root container
- `src/app.js` module importu

## 3. app.js Durumu

- `src/app.js`: 1 satır.
- İçinde büyük render/template fonksiyonu yok.
- Görevi: geçiş runtime’ı olan `legacyApp.js` modülünü başlatmak.

Hâlâ taşınmamış büyük fonksiyonlar `src/legacyApp.js` içinde:

- `renderHome`
- `renderWork`
- `renderJobs`
- `renderCalendar`
- `renderWallet`
- `renderProfile`
- `renderNotifications`
- `renderSupport`
- `renderReferral`
- `renderReferralList`
- `renderReferralEarnings`
- `renderLevels`
- `renderReviews`
- `renderGrowthPackages`
- `renderSubscription`
- `renderGrowthPackageBuilder`
- `renderGrowthPackageCheckout`

Neden tamamen taşınmadılar:

- Bu dosya şu anda canlı prototipin görsel davranışını taşıyor.
- Tüm render fonksiyonlarını tek seferde ayırmak yüksek regresyon riski oluşturur.
- Bu fazda güvenli sınır çizildi: `app.js` küçültüldü, route/component/data temelleri kuruldu, `legacyApp.js` açık teknik borç olarak izole edildi.

## 4. Page Dosyaları Durumu

| Dosya | Route | İçerik | Bottom bar | Back button | Not |
|---|---:|---|---|---|---|
| HomePage.js | /home | placeholder scaffold | legacy | scaffold | Canlı home legacy runtime’da |
| JobPage.js | /jobs | placeholder scaffold | legacy | scaffold | Canlı iş al legacy runtime’da |
| MyJobsPage.js | /my-jobs | placeholder scaffold | legacy | scaffold | Canlı işlerim legacy runtime’da |
| CalendarPage.js | /calendar | placeholder scaffold | legacy | scaffold | Canlı takvim legacy runtime’da |
| WalletPage.js | /wallet | placeholder scaffold | legacy | scaffold | Canlı cüzdan legacy runtime’da |
| ProfilePage.js | /profile | placeholder scaffold | legacy | scaffold | Canlı profil legacy runtime’da |
| NotificationsPage.js | /notifications | placeholder scaffold | legacy | scaffold | Canlı bildirim legacy runtime’da |
| SupportPage.js | /support | placeholder scaffold | legacy | scaffold | Canlı destek legacy runtime’da |
| ReviewsPage.js | /reviews | placeholder scaffold | legacy | scaffold | Canlı yorumlar legacy runtime’da |
| LeaderboardPage.js | /leaderboard | placeholder scaffold | legacy | scaffold | Canlı liderlik legacy runtime’da |
| PartnersPage.js | /partners | placeholder scaffold | legacy | scaffold | Canlı partner listesi legacy runtime’da |
| ReferralPage.js | /referral | placeholder scaffold | legacy | scaffold | Canlı partner kazan legacy runtime’da |
| PackagesPage.js | /packages | placeholder scaffold | legacy | scaffold | Canlı paketler legacy runtime’da |
| SubscriptionPage.js | /subscription | placeholder scaffold | legacy | scaffold | Canlı abonelik legacy runtime’da |
| AccountSettingsPage.js | /account-settings | placeholder scaffold | legacy | scaffold | Hesap güvenliği için hazır |
| NotificationSettingsPage.js | /notification-settings | placeholder scaffold | legacy | scaffold | Bildirim ayarları için hazır |
| ContactSettingsPage.js | /contact-settings | placeholder scaffold | legacy | scaffold | İletişim bilgileri için hazır |
| PhotoGalleryPage.js | /photo-gallery | placeholder scaffold | legacy | scaffold | Profil alt route hazır |
| AboutPage.js | /about | placeholder scaffold | legacy | scaffold | Profil alt route hazır |
| ServicesPage.js | /services | placeholder scaffold | legacy | scaffold | Profil alt route hazır |
| RegionsPage.js | /regions | placeholder scaffold | legacy | scaffold | Profil alt route hazır |
| WorkingHoursPage.js | /working-hours | placeholder scaffold | legacy | scaffold | Profil alt route hazır |
| TeamPage.js | /team | placeholder scaffold | legacy | scaffold | Profil alt route hazır |
| CapacityPage.js | /capacity | placeholder scaffold | legacy | scaffold | Profil alt route hazır |
| StrategyPage.js | /strategy | placeholder scaffold | legacy | scaffold | Profil alt route hazır |
| CustomersPage.js | /customers | placeholder scaffold | legacy | scaffold | Sidebar route hazır |
| IncomeExpensePage.js | /income-expense | placeholder scaffold | legacy | scaffold | Sidebar route hazır |
| InvoicesPage.js | /invoices | placeholder scaffold | legacy | scaffold | Sidebar route hazır |
| MessagesPage.js | /messages | placeholder scaffold | legacy | scaffold | Sidebar route hazır |
| PackageBuilderPage.js | /package-builder | placeholder scaffold | legacy | scaffold | Paket akışı route hazır |
| PackageCheckoutPage.js | /package-checkout | placeholder scaffold | legacy | scaffold | Paket ödeme route hazır |
| ReferralEarningsPage.js | /referral-earnings | placeholder scaffold | legacy | scaffold | Kazançlar route hazır |
| BonusPage.js | /bonus | placeholder scaffold | legacy | scaffold | Bonus route hazır |
| AppointmentLinkPage.js | /appointment-link | placeholder scaffold | legacy | scaffold | Randevu linki route hazır |
| PerformanceScorePage.js | /performance-score | placeholder scaffold | legacy | scaffold | Performans route hazır |

## 5. Component Dosyaları Durumu

| Component | Gerçekten kullanılıyor mu? | Kullanıldığı yer | Eksik |
|---|---|---|---|
| AppShell | Evet | `legacyApp.js` | Yok |
| BottomBar | Evet | `legacyApp.js` içindeki `renderBottomNav` | CTA variant ayrımı henüz tam bağlanmadı |
| BackButton | Hazır | Page scaffold | Legacy header tamamen buna taşınmadı |
| Header | Hazır | Page scaffold | Legacy header tamamen buna taşınmadı |
| PageContainer | Hazır | Page scaffold | Yok |
| Card | Hazır | Page scaffold | Yok |
| Button | Hazır | Yeni component sistemi | Legacy butonları henüz taşınmadı |
| Badge | Hazır | Yeni component sistemi | Legacy rozetleri henüz taşınmadı |
| Chip | Hazır | Yeni component sistemi | Legacy chipleri henüz taşınmadı |
| MenuList | Hazır | Sidebar component | Legacy drawer markup henüz tamamen taşınmadı |
| Sidebar | Hazır | Yeni component sistemi | Legacy drawer render edilmesi devam ediyor |
| ProfileCard | Hazır | Yeni component sistemi | Canlı profile card hâlâ legacy |
| StatusPill | Hazır | Yeni component sistemi | Canlı status pill hâlâ legacy |
| SmartStatusCard | Hazır | Yeni component sistemi | Canlı smart card hâlâ legacy |
| PerformanceCard | Hazır | Yeni component sistemi | Canlı performance card hâlâ legacy |
| WalletBonusCards | Hazır | Yeni component sistemi | Canlı wallet card hâlâ legacy |
| SupportCard | Hazır | Yeni component sistemi | Canlı support card hâlâ legacy |
| SectionTitle | Hazır | Yeni component sistemi | Legacy section header’ları henüz taşınmadı |

## 6. Router Durumu

Route listesi `src/utils/constants.js` içinde, router fonksiyonları `src/router.js` içinde.

Çalışan route’lar:

- `/home`
- `/jobs`
- `/my-jobs`
- `/calendar`
- `/wallet`
- `/profile`
- `/notifications`
- `/support`
- `/messages`
- `/reviews`
- `/leaderboard`
- `/partners`
- `/customers`
- `/referral`
- `/referral-earnings`
- `/packages`
- `/package-builder`
- `/package-checkout`
- `/subscription`
- `/account-settings`
- `/notification-settings`
- `/contact-settings`
- `/invoices`
- `/income-expense`
- `/photo-gallery`
- `/about`
- `/services`
- `/regions`
- `/working-hours`
- `/team`
- `/capacity`
- `/strategy`
- `/bonus`
- `/appointment-link`
- `/performance-score`

Placeholder route’lar:

- Yeni page dosyaları scaffold olarak hazır.
- Canlı rendering hâlâ legacy screen map üstünden yapıldığı için bu placeholder dosyalar migration hedefi olarak duruyor.

Bilinmeyen route fallback:

- `normalizeRoute()` bilinmeyen route’u `/home` olarak normalize eder.

## 7. Geri Butonu Durumu

- `goBack()` hâlâ `src/legacyApp.js` içinde tanımlı.
- `navigationStack` artık `src/state.js` içinde merkezi export.
- Browser back `popstate` ile route stack’i eşleniyor.
- Stack boşsa fallback `/home`.

Test edilen mantık:

- Syntax/import düzeyinde router ve stack temiz.
- Gerçek browser görsel akış testi bu ortamda Chromium/Playwright olmadığı için yapılamadı.

## 8. Bottom Bar / CTA Durumu

- BottomBar component dosyası: `src/components/BottomBar.js`
- `legacyApp.js` artık bottom bar HTML’ini bu component üzerinden alıyor.
- CTA markup hâlâ bottom item verisiyle tek component içinde üretiliyor.
- Home/subpage/disabled/hidden variant fonksiyonu `getCtaVariant()` olarak `router.js` içinde başladı ancak canlı runtime’a tam bağlanmadı.
- CTA artık her sayfada ayrı yazılmıyor; legacy render içinde tek `renderBottomNav()` ve component çağrısı var.

## 9. Sidebar Durumu

- Sidebar data array: `src/utils/constants.js` içindeki `DRAWER_SECTIONS`.
- `legacyApp.js` drawer menülerini artık bu merkezi data’dan alıyor.
- Menü route bilgileri eklendi, fakat canlı drawer click davranışı hâlâ `screen` alanı üzerinden çalışıyor.
- Çalışmayan bilinen sidebar linki yok; route migration için `route` alanları hazır.

## 10. Profil Sayfası Durumu

- 8’li profil grid data-driven yapıya geçiş için `PROFILE_MENU_ITEMS` eklendi.
- Canlı grid hâlâ legacy içindeki inline SVG data array ile korunuyor.
- Route karşılıkları hazır:
  - `/about`
  - `/photo-gallery`
  - `/services`
  - `/regions`
  - `/working-hours`
  - `/team`
  - `/capacity`
  - `/strategy`
- Hesabı dondur/sil ana ekranda büyük kırmızı buton olarak görünmüyor.
- Hesap ve Güvenlik içinde detaylı hesap durumu akışı henüz placeholder.

## 11. CSS / Tasarım Sistemi Durumu

- `tokens.css` var ve genişletildi.
- Renk tokenları var.
- Spacing tokenları var.
- Font tokenları var.
- Radius/shadow tokenları var.
- `components.css` ortak component sınıflarıyla genişletildi.
- Büyük legacy CSS hâlâ `pages.css` içinde.
- Inline style kalan yerler var; özellikle `legacyApp.js` içinde temizlenmesi gerekiyor.

## 12. Mock Data Durumu

- `mockData.js` genişletildi.
- Buraya taşınan veriler:
  - route listesi
  - bottom tabs
  - drawer sections
  - profile menu items
  - partner profile summary
  - wallet summary
  - notifications
  - referral partners
  - reviews
  - leaderboard
- Hâlâ inline mock data barındıran alanlar:
  - `legacyApp.js` içindeki home, referral, reviews, leaderboard, package, notification render fonksiyonları.

## 13. Test Sonucu

- `npm run check`: başarılı.
- `node --check`: tüm `src/**/*.js` dosyalarında başarılı.
- Router import testi: başarılı. `35` route ve `35` page route import edildi.
- Canlı URL asset kontrolü:
  - `/src/app.js`: HTTP 200, no-cache.
  - `/src/legacyApp.js`: HTTP 200, no-cache.
- Console error kontrolü: Bu ortamda gerçek Chromium/Playwright olmadığı için yapılamadı.
- 360/390/430 px görsel taşma testi: Bu ortamda ekran görüntüsü aracı olmadığı için yapılamadı.
- Ekran görüntüsü testi: Yapılamadı; Chromium/Playwright executable bulunamadı.

## 14. Kalan Teknik Borçlar

P0:

- `legacyApp.js` içindeki canlı render fonksiyonları gerçek page dosyalarına taşınmalı.
- Canlı runtime, `pageRoutes` üzerinden render etmeye başlamalı.
- Browser/ci görsel smoke test kurulmalı.

P1:

- Header, Sidebar, ProfileCard, PerformanceCard, WalletBonusCards canlı render içinde kullanılmalı.
- CTA variant sistemi canlı BottomBar’a bağlanmalı.
- Inline style’lar azaltılmalı.
- Mock data tamamen `mockData.js` içine alınmalı.

P2:

- Component test veya snapshot test altyapısı kurulmalı.
- CSS token kullanımı `pages.css` geneline yayılmalı.
- Legacy CSS parça parça component CSS’e taşınmalı.
- Accessibility audit yapılmalı.

## 15. Bir Sonraki Adım Önerisi

En mantıklı sonraki iş: `legacyApp.js` içinden önce profil sayfasını ayırmak.

Neden:

- Profil sayfası şu anda en çok çalışılmış, en net component sınırlarına sahip alan.
- `ProfileCard`, profil güçlendirme kartı ve 8’li grid kolayca `ProfilePage.js` içine taşınabilir.
- Bu taşımadan sonra aynı pattern notifications, support ve reviews sayfalarına uygulanabilir.
