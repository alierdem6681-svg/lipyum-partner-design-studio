# Lipyum Partner Migration Status

Tarih: 18 Haziran 2026

Bu dosya V8 itibarıyla kullanıcıya görünen route'ların migration durumunu takip eder.

| Route | Ekran | Vue page | Tailwind/UI Kit | Legacy bağımlılığı | Test coverage | Not |
| --- | --- | --- | --- | --- | --- | --- |
| `/home` | Ana Sayfa | Evet: Vue preview | Kısmi/Tailwind UI Kit | Preview'de düşük, default boot'ta V11 legacy | Route, mobile, geometry, device, interaction, V12-C contract | V12-D kapsamında atlandı; son bilinen visual P0 FAIL `0.101071` |
| `/jobs` | İş Al | Evet: Vue preview | Kısmi/Tailwind UI Kit | Preview'de düşük, default boot'ta V11 legacy | Route, mobile, bottom bar, V12-C/D contract | V12-D partial: visual P1 FAIL `0.016964`, content/action sayıları eşit |
| `/my-jobs` | İşlerim | Evet: Vue preview | Kısmi/Tailwind UI Kit | Preview'de düşük, default boot'ta V11 legacy | Route, mobile, bottom bar, V12-C/D contract | V12-D visual PASS `0.014621`; content/action PASS |
| `/calendar` | Takvim | Evet: Vue preview | Kısmi/Tailwind UI Kit | Preview'de düşük, default boot'ta V11 legacy | Route, mobile, bottom bar, V12-C/D contract | V12-D visual PASS `0.010982`; content/action PASS |
| `/wallet` | Cüzdan | Kısmi/modüler JS | Kısmi | Orta | Route, mobile, forms, lazy list | P1: Vue UI Kit'e taşınmalı |
| `/profile` | Profilim | Kısmi/modüler JS | Kısmi | Orta | Route, mobile, back | P1: Vue UI Kit'e taşınmalı |
| `/notifications` | Bildirimler | Kısmi/modüler JS | Kısmi | Orta | Route, mobile, interaction | P1: Vue UI Kit'e taşınmalı |
| `/support` | Yardım ve Destek | Kısmi/modüler JS | Kısmi | Orta | Route, mobile, accessibility | P1: Vue UI Kit'e taşınmalı |
| `/support/new` | Talep Oluştur | Kısmi/modüler JS | Kısmi | Orta | Route, support-ticket | V10 success reset ve canlı destek yönlendirmesi hazır |
| `/support/live` | Canlı Destek | Kısmi/modüler JS | Kısmi | Orta | Route, support-ticket, clickable inventory | V10 mock canlı sohbet başlangıcı hazır |
| `/satisfaction` | Memnuniyet | Kısmi/modüler JS | Kısmi | Orta | Route, satisfaction | V9 compliance-safe satisfaction flow hazır |
| `/reviews` | Müşteri Yorumları | Kısmi/modüler JS | Kısmi | Orta | Route, mobile, forms | P1: Vue UI Kit'e taşınmalı |
| `/leaderboard` | Liderlik Tablosu | Kısmi/modüler JS | Kısmi | Orta | Route, mobile, forms | P1: Vue UI Kit'e taşınmalı |
| `/referral` | Partner Davet Programı | Hayır | Kısmi | Yüksek | Route, mobile, sidebar | P0: zengin akış Vue migration gerekli |
| `/job-referral` | İş Yönlendirme Programı | Kısmi/modüler JS | Kısmi | Düşük | Route, mobile | Vue pilot alternatifi var |
| `/packages` | Paketler | Hayır | Kısmi | Yüksek | Route, mobile | P0/P1: paket akışı Vue migration gerekli |
| `/subscription` | Aboneliğim | Hayır | Kısmi | Yüksek | Route, mobile | P0/P1: abonelik akışı Vue migration gerekli |
| `/package-builder` | Paket Seçimi | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/package-checkout` | Paket Ödeme | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/bonus` | Bonus Cüzdanı | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/performance-score` | Performans Skoru | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/messages` | Mesajlar | Kısmi/modüler JS | Kısmi | Orta | Route smoke | Support route'a delege |
| `/customers` | Müşteri Defteri | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/invoices` | Faturalarım | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/income-expense` | Gelir/Gider | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/appointment-link` | Randevu Linki | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/about` | Hakkımda | Kısmi/modüler JS | Kısmi | Orta | Route smoke | P1 |
| `/photo-gallery` | Fotoğraflarım | Kısmi/modüler JS | Kısmi | Orta | Back test | P1 |
| `/services` | Hizmetlerim | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/regions` | Bölgelerim | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/working-hours` | Saatlerim | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/team` | Ekibim | Kısmi/modüler JS | Kısmi | Orta | Route smoke | P1 |
| `/capacity` | Kapasitem | Hayır | Kısmi | Yüksek | Route smoke | P1 |
| `/strategy` | Stratejim | Kısmi/modüler JS | Kısmi | Orta | Route smoke | P1 |
| `/account-settings` | Hesap Ayarları | Kısmi/modüler JS | Kısmi | Orta | Route smoke | P1 |
| `/notification-settings` | Bildirim Ayarları | Kısmi/modüler JS | Kısmi | Orta | Route smoke | P1 |
| `/contact-settings` | İletişim Bilgileri | Kısmi/modüler JS | Kısmi | Orta | Route smoke | P1 |
| `/ui-kit` | UI Kit Preview | Evet/Vue island | Evet | Düşük | Route, mobile | Vue UI Kit preview |
| `/vue-job-referral` | Vue JobReferral Pilot | Evet/Vue island | Evet | Düşük | Route, mobile | Pilot route |
| `/partner-card-preview` | Partner Kartı Önizleme | Kısmi/modüler JS | Kısmi | Orta | Route, V10 QA | Public badge/embed/share mock önizleme |

## Özet

- Tam Vue migration tamamlanmadı.
- V8 ile navigation/header/sidebar/test standardı sertleştirildi.
- V9 ile `/support/new`, `/satisfaction`, deep link resolver ve visual alignment testleri eklendi.
- V10 ile `/support/live`, `/partner-card-preview`, public partner badge/share mock'u ve clickable/visual QA rapor testleri eklendi.
- V11 hardening pass ile route metadata registry, Bildirimler/Cüzdan anlamlı header actions, CTA mist animation, profil grid geometry testi ve `V11_ARCHITECTURE_AUDIT.md` eklendi.
- Bir sonraki büyük migration sırası: `/home`, `/jobs`, `/my-jobs`, `/calendar`, `/referral`, `/packages`, `/subscription`.

## V11 Gerçek Durum

V11 full completion kriterleri henüz sağlanmadı. `src/app.js` hâlâ `legacyApp.js` ile boot ediyor ve yüksek değerli aktif route'larda legacy render fonksiyonları duruyor. Bu durum gizlenmedi; `npm run test:v11-audit` bu borcun P0 olarak dokümante edildiğini doğrular.

P0 kalan ana iş:

- Tek Vue root application + Vue Router hash history.
- `/home`, `/jobs`, `/my-jobs`, `/calendar`, `/referral`, `/packages`, `/subscription`, builder/checkout ve profil alt route'larının gerçek Vue SFC page olarak taşınması.
- Aktif route'larda büyük HTML string render sorumluluğunun kaldırılması.
- Legacy CSS'in aktif route görünüm üretme sorumluluğunun bitirilmesi.

## V12 Golden Master Safe Preview Durumu

V12 Golden çalışması default production boot’u değiştirmeden paralel Vue preview kurdu. Aşağıdaki durum yalnızca `?engine=vue` preview için geçerlidir.

| Route | Vue preview page | Tailwind/UI Kit | Legacy default boot | Visual parity | Cutover durumu |
| --- | --- | --- | --- | --- | --- |
| `/home` | Evet: `HomePage.vue` | Kısmi | V11 legacy | FAIL | Kapalı |
| `/jobs` | Evet: `JobsPage.vue` | Kısmi | V11 legacy | FAIL | Kapalı |
| `/my-jobs` | Evet: `MyJobsPage.vue` | Kısmi | V11 legacy | FAIL | Kapalı |
| `/calendar` | Evet: `CalendarPage.vue` | Kısmi | V11 legacy | FAIL | Kapalı |
| Diğer route’lar | `LegacyContentBridge.vue` | Kısmi | V11 legacy | Ölçülmedi | Kapalı |

V12 notu:

- Header ve bottom bar geometry parity’si core route’larda eşleşti.
- Pixel, content ve interaction parity henüz geçmedi.
- `src/app.js` default olarak Vue root’a geçirilmedi.
- `test:v12-parity` farkları raporlar ve fark varken default cutover yapılmadığını doğrular.

## V12-B Strict Parity ve Cutover Hazırlığı

V12-B sırasında route migration tamamlanmadı. Yeni strict parity sistemi, mevcut eksikleri artık completion gate olarak fail eder.

| Route grubu | Durum | Contract parity | Visual parity | Cutover |
| --- | --- | --- | --- | --- |
| `/home` | Vue SFC var, Golden’a kısmen yaklaştırıldı | FAIL | FAIL | Kapalı |
| `/jobs` | Vue SFC var, sade mock seviyesinde | FAIL | FAIL | Kapalı |
| `/my-jobs` | Vue SFC var, sade mock seviyesinde | FAIL | FAIL | Kapalı |
| `/calendar` | Vue SFC var, sade mock seviyesinde | FAIL | FAIL | Kapalı |
| Finans/profil/destek/yorum/liderlik/referral/paket aktif route’ları | Vue preview’de `LegacyContentBridge` placeholder | FAIL | Ölçüm/contract FAIL | Kapalı |

Yeni migration guardrail dosyaları:

- `tests/golden-master/v11-stable/ROUTE_PARITY_CONTRACT.json`
- `V12_ROUTE_CONTRACT_REPORT.md`
- `tests/golden-master/v12-feature-preview/V12_ROUTE_CONTRACT_REPORT.json`
- `scripts/generate-route-parity-contract.mjs`
- `scripts/report-route-contract.mjs`
- `scripts/assert-v12-strict-parity.mjs`

Yeni scriptler:

- `generate:route-contract`
- `report:parity`
- `test:parity:core`
- `test:parity:all`
- `test:parity:strict`
- `test:content-contract`
- `test:interaction-contract`
- `test:visual-regression:v12`

P0 kalan iş:

- `/home`, `/jobs`, `/my-jobs`, `/calendar` için pixel parity tamamlanmalı.
- `LegacyContentBridge` aktif route listesinden kaldırılmalı.
- Tüm aktif route’lar Tailwind/UI Kit Vue SFC olmalı.
- Default boot Vue’ye ancak strict parity PASS sonrası geçirilmeli.

## V12-C Core Route Golden Parity Durumu

V12-C sırasında core route content/action contract tamamlandı:

| Route | Vue preview | Content/action parity | Visual parity | Cutover |
| --- | --- | --- | --- | --- |
| `/home` | Evet | PASS | FAIL P0, diff `0.101071` | Kapalı |
| `/jobs` | Evet | PASS | FAIL P0, diff `0.089986` | Kapalı |
| `/my-jobs` | Evet | PASS | FAIL P0, diff `0.081611` | Kapalı |
| `/calendar` | Evet | PASS | FAIL P1, diff `0.053301` | Kapalı |

V12-C tamamlanmış sayılmadı. Default Vue boot kapalıdır.

## V12-D Core Pixel Parity Closure Durumu

V12-D, kullanıcının "PASS alamadığın konuları atla ve artık görevi tamamla sonuçları rapora yaz" talimatıyla strict completion yapılmadan kapatıldı.

| Route | V12-C başlangıç diff | V12-D son diff | Son durum | Cutover |
| --- | ---: | ---: | --- | --- |
| `/calendar` | `0.053301` | `0.010982` | Visual PASS | Kapalı |
| `/my-jobs` | `0.081611` | `0.014621` | Visual PASS | Kapalı |
| `/jobs` | `0.089986` | `0.016964` | Visual FAIL P1 | Kapalı |
| `/home` | `0.101071` | Ölçülmedi | Atlandı / P0 borç | Kapalı |

V12-D tam Golden visual lock değildir. Default Vue boot kapalıdır ve PR draft kalmalıdır.
