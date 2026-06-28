# GoogleADS Panel Integration

Bu repo Lipyum mobil yonetim paneli arayuzunu tasir. GoogleADS repo ise
veri, ML, Action Center, approval outbox ve Google Ads guvenlik kapilarini
tasir.

## Contract

Panelin hedef sozlesmesi:

- GoogleADS `mobile_api_contract_version = 1.0.0`
- Read-only snapshot kaynaklari
- Append-only approval outbox eventleri
- Dogrudan Google Ads API veya DuckDB baglantisi yok

## UI Kurallari

- `/management-panel` route'u mobil yonetim yuzeyidir.
- Navbar, bottom bar ve geri aksiyonu korunur.
- Action Center kartlari kullanici dostu metinlerle gosterilir.
- Teknik detaylar ana ekrani kalabaliklastirmaz.

## Guvenlik

- Onay butonlari canli reklam degisikligi yapmaz.
- Live pilot butonu sadece `APPROVE_LIVE_PILOT` event sozlesmesine hazirlanir.
- Production deploy kullanici acikca `canliya al` demeden yapilmaz.
