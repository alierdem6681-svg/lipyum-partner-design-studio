# V12-A Visual Review

Tarih: 18 Haziran 2026

## İncelenen Alanlar

- Vue shell içinde iPhone simulator frame.
- Global header ve bottom bar görünürlüğü.
- `/home` core Vue sayfası.
- `/jobs`, `/my-jobs`, `/calendar` core Vue sayfaları.
- Compatibility bridge route smoke: `/wallet`, `/profile`, `/notifications`, `/support`, `/referral`, `/packages`.

## Bulgular

- Shell ve core route'lar Playwright e2e ile görünür ve tıklanabilir doğrulandı.
- Home içindeki "Tamamlanan" metriği sadece `18` gösterir; "18 iş" tekrarı yoktur.
- `Krediye Çevir` global sheet ile açılır ve `sheet-close-button` görünür.
- Core route kartları global header/bottom bar altında çalışır.

## Kalan Görsel Borç

- Compatibility bridge route'ları eski CSS/HTML gövde yapısını taşımaya devam eder.
- Tam pixel visual regression baseline bu fazda yenilenmedi.
- Sonraki fazda bridge route'lar SFC olduğunda screenshot baseline'ları yeniden üretilmelidir.
