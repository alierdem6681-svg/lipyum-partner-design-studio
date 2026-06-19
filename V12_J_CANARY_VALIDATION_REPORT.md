# V12-J Canary Validation Report

> Status: `SUPERSEDED_BY_D91D8F6_DESIGN_RESTORE`.
> This report is historical only. Current V12-K policy is normal URL = stable legacy product design and `?engine=vue` = Vue preview.

Tarih: 19 Haziran 2026

## Local Canary

| URL | Beklenen | Durum |
| --- | --- | --- |
| `http://127.0.0.1:5173/#/home` | Vue marker | PASS |
| `http://127.0.0.1:5173/?engine=legacy#/home` | Legacy marker | PASS |

## GitHub Pages Canary

Feature branch push sonrasi GitHub Pages workflow dogrulandi.

Canary URL: `https://alierdem6681-svg.github.io/lipyum-partner-design-studio/#/home`
Rollback URL: `https://alierdem6681-svg.github.io/lipyum-partner-design-studio/?engine=legacy#/home`
Workflow run: `27825343900`
Workflow sonucu: `SUCCESS`
Kod commit'i: `b2764eb88c5f724d700813863a7c630234765b43`

| Kontrol | Durum |
| --- | --- |
| GitHub Pages workflow | PASS |
| Normal canary URL Vue marker | PASS |
| Rollback URL legacy marker | PASS |

## Route Canary Kontrolleri

| Route | Runtime | Durum |
| --- | --- | --- |
| `/#/home` | Vue | PASS |
| `/#/profile` | Vue | PASS |
| `/#/support/live` | Vue | PASS |
| `/#/referral` | Vue | PASS |
| `/#/subscription` | Vue | PASS |
| `/?engine=legacy#/home` | Legacy | PASS |

## Tarayici Bulgulari

- Normal canary acilisinda `data-runtime="vue"` goruldu.
- Rollback URL acilisinda `data-runtime="legacy"` goruldu.
- Kritik canary route'larda horizontal overflow gorulmedi.
- Kritik canary route'larda console/page error gorulmedi.

## Not

Production Vercel deploy yapilmaz. Main merge yapilmaz.
