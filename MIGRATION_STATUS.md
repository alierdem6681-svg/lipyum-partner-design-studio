# Lipyum Partner Migration Status

Tarih: 19 Haziran 2026
Branch: `feature/v12-golden-vue-cutover`

## V12-K Guncel Runtime Durumu

Gecerli politika `d91d8f6` sonrasi durumdur:

- Normal URL stable legacy product design acilir.
- `?engine=vue` yalniz Vue preview acilisidir.
- Vue default cutover gorsel regresyonlar nedeniyle geri alinmistir.
- V12-J kabul raporlari tarihsel/superseded kabul edilir.

| URL | Gecerli runtime | Marker | Not |
| --- | --- | --- | --- |
| `/#/home` | Stable legacy product design | `data-runtime="legacy"` | Normal kullanici acilisi |
| `/#/profile` | Stable legacy product design | `data-runtime="legacy"` | Stable tasarim korunur |
| `/?engine=vue#/home` | Vue preview | `data-runtime="vue"` | Kontrollu preview |
| `/?engine=vue#/profile` | Vue preview | `data-runtime="vue"` | Preview shell/parity kontrolu |
| `/?engine=legacy#/home` | Stable legacy product design | `data-runtime="legacy"` | Default ile ayni legacy yol |

## Migration Yorumu

Vue route/component migration calismalari preview hattinda degerlendirilir. Normal URL'nin Vue olmasi artik kabul kriteri degildir; normal URL stable product design'i korumalidir.

## V12-J Superseded Notu

Asagidaki V12-J iddialari artik gecerli degildir:

- Normal URL default Vue runtime aciyor.
- Legacy yalniz explicit rollback runtime'dir.
- V12-J release-candidate gate gecerli final kabul kapisidir.

Bu iddialar `SUPERSEDED_BY_D91D8F6_DESIGN_RESTORE` olarak okunmalidir.

## Gecerli Gate

```bash
npm run test:quality-gate:stable-default
npm run test:quality-gate:vue-preview
npm run test:quality-gate:v12-k
```

## Kalan Risk

- Vue preview hatti urun gorsel onayi almadan normal/default kullanici acilisina alinmaz.
- V12-J raporlarindaki PASS sonuclari tarihsel kanittir; V12-K default runtime kabulunu temsil etmez.
- Mevcut calisma agacinda V12-K kapsam disi implementasyon degisiklikleri vardir; bu gorevde onlara dokunulmadi.
