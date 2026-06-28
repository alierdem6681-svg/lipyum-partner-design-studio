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
- Runtime base URL: `VITE_GOOGLEADS_MOBILE_API_BASE_URL`
- Runtime API key: `VITE_GOOGLEADS_MOBILE_API_KEY`
- Env yoksa panel mock mode ile calisir.
- Contract mismatch varsa panel sade uyari gosterir.
- V1.9 gateway `getHealth`, `getSummary`, `getSystem` ve append-only outbox akisini destekler.
- Snapshot freshness `health` veya `system` payloadindan izlenir.

## UI Kurallari

- `/management-panel` route'u mobil yonetim yuzeyidir.
- Navbar, bottom bar ve geri aksiyonu korunur.
- Action Center kartlari kullanici dostu metinlerle gosterilir.
- Teknik detaylar ana ekrani kalabaliklastirmaz.

## Guvenlik

- Onay butonlari canli reklam degisikligi yapmaz.
- Onay butonlari sadece `POST /api/mobile/outbox` event gonderir.
- Live pilot butonu sadece `APPROVE_LIVE_PILOT` event sozlesmesine hazirlanir.
- Production deploy kullanici acikca `canliya al` demeden yapilmaz.

## V1.9 Smoke Test

`tests/unit/googleAdsMobileApiE2E.test.js` sahte fetch ile su akisi dogrular:

- Gateway health okunur.
- Summary snapshot ve freshness okunur.
- Approval outbox event'i `lipyum_mobile_panel` kaynagiyla gonderilir.
- `X-API-Key` ve `X-Lipyum-Panel-Version` headerlari korunur.
- Panel Google Ads API veya DuckDB'ye dogrudan baglanmaz.
