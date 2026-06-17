# Lipyum Partner Migration Status

Tarih: 17 Haziran 2026

Bu dosya V8 itibarıyla kullanıcıya görünen route'ların migration durumunu takip eder.

| Route | Ekran | Vue page | Tailwind/UI Kit | Legacy bağımlılığı | Test coverage | Not |
| --- | --- | --- | --- | --- | --- | --- |
| `/home` | Ana Sayfa | Hayır | Kısmi | Yüksek | Route, mobile, geometry, device, interaction | P0: Home Vue migration gerekli |
| `/jobs` | İş Al | Hayır | Kısmi | Yüksek | Route, mobile, bottom bar | P0: Jobs Vue migration gerekli |
| `/my-jobs` | İşlerim | Hayır | Kısmi | Yüksek | Route, mobile, bottom bar | P0: MyJobs Vue migration gerekli |
| `/calendar` | Takvim | Hayır | Kısmi | Yüksek | Route, mobile, bottom bar | P0: Calendar Vue migration gerekli |
| `/wallet` | Cüzdan | Kısmi/modüler JS | Kısmi | Orta | Route, mobile, forms, lazy list | P1: Vue UI Kit'e taşınmalı |
| `/profile` | Profilim | Kısmi/modüler JS | Kısmi | Orta | Route, mobile, back | P1: Vue UI Kit'e taşınmalı |
| `/notifications` | Bildirimler | Kısmi/modüler JS | Kısmi | Orta | Route, mobile, interaction | P1: Vue UI Kit'e taşınmalı |
| `/support` | Yardım ve Destek | Kısmi/modüler JS | Kısmi | Orta | Route, mobile, accessibility | P1: Vue UI Kit'e taşınmalı |
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

## Özet

- Tam Vue migration tamamlanmadı.
- V8 ile navigation/header/sidebar/test standardı sertleştirildi.
- Bir sonraki büyük migration sırası: `/home`, `/jobs`, `/my-jobs`, `/calendar`, `/referral`, `/packages`, `/subscription`.
