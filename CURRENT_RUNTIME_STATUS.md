# Current Runtime Status

Tarih: 19 Haziran 2026
Branch: `feature/v12-golden-vue-cutover`
Kaynak commit notu: `d91d8f6` - `Restore stable product design as default runtime`

## Gecerli Politika

V12-K icin gecerli runtime gercegi:

| URL | Runtime | Marker | Durum |
| --- | --- | --- | --- |
| `/#/home` | Stable legacy product design | `data-runtime="legacy"` | Gecerli default |
| `/?engine=vue#/home` | Vue preview | `data-runtime="vue"` | Kontrollu preview |
| `/?engine=legacy#/home` | Stable legacy product design | `data-runtime="legacy"` | Default ile ayni legacy yol |

`src/app.js` icindeki gecerli secim:

- `requestedEngine === "vue"` ise Vue preview acilir.
- Diger tum normal URL ve query durumlarinda stable legacy tasarim acilir.
- Vue default cutover, gorsel regresyonlar nedeniyle `d91d8f6` ile geri alinmistir.

## Superseded Durum

V12-J raporlarinda yazan "normal URL = default Vue" kabul durumu artik gecerli degildir. Bu raporlar yalniz tarihsel kanit olarak saklanir ve `SUPERSEDED_BY_D91D8F6_DESIGN_RESTORE` notu ile okunmalidir.

## Gecerli Gate Komutlari

```bash
npm run test:quality-gate:stable-default
npm run test:quality-gate:vue-preview
npm run test:quality-gate:v12-k
```

V12-J gate komutlari tarihsel V12-J kabulunu temsil eder; V12-K icin final kabul kapisi olarak kullanilmaz.
