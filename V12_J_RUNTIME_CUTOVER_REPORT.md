# V12-J Runtime Cutover Report

Tarih: 19 Haziran 2026
Branch: `feature/v12-golden-vue-cutover`

## Sonuc

Default runtime Vue release candidate olarak acildi.

## Davranis

| URL | Beklenen runtime | Marker | Durum |
| --- | --- | --- | --- |
| `/#/home` | Vue | `data-runtime="vue"` | PASS |
| `/?engine=vue#/home` | Vue | `data-runtime="vue"` | PASS |
| `/?engine=legacy#/home` | Legacy rollback | `data-runtime="legacy"` | PASS |

## Degisen Kod

- `src/app.js` normal acilista Vue root baslatir.
- Legacy runtime yalniz `?engine=legacy` ile import edilir.
- Vue boot hatasi sessiz legacy fallback yapmaz.
- Runtime marker `html`, `body` ve `#app` uzerine yazilir.

## Architecture Tests

- `default-vue-runtime.test.js`: PASS
- `explicit-legacy-rollback.test.js`: PASS
- `no-legacy-default-boot.test.js`: PASS
- `vue-router-owns-navigation.test.js`: PASS
- `no-active-legacy-content-bridge.test.js`: PASS

## Rollback

Rollback URL:

```text
/?engine=legacy#/home
```
