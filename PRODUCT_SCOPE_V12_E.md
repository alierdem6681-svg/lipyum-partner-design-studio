# V12-E Product Scope Reset

Tarih: 18 Haziran 2026

V12-E ile ürün kapsamı bilinçli olarak sadeleştirildi. Bu karar, ilgili route'lar için eski V11 Golden Master beklentilerini supersede eder.

## Aktif Bottom Navigation

| Label | Route |
| --- | --- |
| Ana Sayfa | `/home` |
| İşler | `/my-jobs` |
| İş Al | `/jobs` |
| Randevu | `/calendar` |
| Cüzdan | `/wallet` |

## Aktif Büyüme Sidebar Menüsü

- Liderlik Tablosu
- Müşteri Yorumları
- Aboneliğim

## Kaldırılan Ürün

- Paketler
- Paket seçimi
- Paket builder
- Paket checkout
- Paket ödeme akışı

Kaldırılan aktif route'lar:

- `/packages`
- `/package-builder`
- `/package-checkout`

Eski dış linkler kırılmaması için `/subscription` route'una yönlendirilir.

## Korunan Ürün

- `/subscription`
- Aboneliğim

Paketler ile Aboneliğim aynı ürün değildir. Paketler kaldırılmıştır; abonelik ekranı korunmuştur.

## Boş Ekranlar

Aşağıdaki ekranlarda yalnızca global AppHeader, boş ana içerik alanı ve global AppBottomBar bulunur:

- `/jobs`
- `/my-jobs`
- `/calendar`
- `/wallet`

Bu ekranlarda kart, açıklama, "yakında", empty state, buton, filtre, hero veya bilgi metni gösterilmez.

## Golden Master Notu

V11 Golden Master aşağıdaki route'lar için tarihsel referans olarak korunur ancak aktif ürün kararını artık temsil etmez:

- `/jobs`
- `/my-jobs`
- `/calendar`
- `/wallet`
- `/packages`
- `/package-builder`
- `/package-checkout`

Bu route'larda V12-E product scope contract geçerlidir.
