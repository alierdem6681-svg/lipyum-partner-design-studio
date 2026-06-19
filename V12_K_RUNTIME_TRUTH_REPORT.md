# V12-K Runtime Truth Report

Tarih: 19 Haziran 2026
Branch: `feature/v12-golden-vue-cutover`

## Sonuc

V12-K runtime gercegi dokumantasyon ve gate tarafinda uzlastirildi:

- Normal URL stable legacy product design acmalidir.
- `?engine=vue` Vue preview acmalidir.
- Default Vue cutover `d91d8f6` ile geri alinmistir.
- V12-J kabul raporlari tarihsel/superseded durumdadir.

## Yerel Kanit

`src/app.js` gecerli runtime secimi:

- `const useVueEngine = requestedEngine === "vue";`
- `useVueEngine` true ise `./vue/main.js` import edilir.
- Aksi durumda `markRuntime("legacy")` ve `./legacyApp.js` import edilir.

Git kaniti:

```bash
git show --stat --oneline --decorate d91d8f6
```

Sonuc commit basligi:

```text
d91d8f6 Restore stable product design as default runtime
```

## Dokuman Uzlasmasi

Guncellenen/eklenen dokumanlar:

- `CURRENT_RUNTIME_STATUS.md`
- `V12_K_RUNTIME_TRUTH_REPORT.md`
- `V12_K_COMPLETION_REPORT.md`
- `MIGRATION_STATUS.md`
- `ARCHITECTURE.md`
- `QUALITY_GATE.md`
- `REFACTOR_REPORT.md`

V12-J raporlari `SUPERSEDED_BY_D91D8F6_DESIGN_RESTORE` notu ile isaretlendi.

## Gate Uzlasmasi

Yeni hafif gate girisleri:

```bash
npm run test:quality-gate:stable-default
npm run test:quality-gate:vue-preview
npm run test:quality-gate:v12-k
```

Bu gate'ler runtime gercegini hedefler:

- stable default gate: normal URL'nin legacy/stable marker ve tasarim kontratini korudugunu dogrular.
- vue preview gate: `?engine=vue` yolunun Vue marker ve preview shell kontratini dogrular.
- V12-K gate: iki hedefli gate'i birlikte calistirir.

## Uygulama Duzeltmesi

Runtime default'u degistirilmeden Vue preview tarafinda stable design recovery yapildi:

- Profil menusu stabil label ve grid kontratina cekildi.
- Sidebar/drawer stabil `partner-menu`, `drawer-profile-card` ve `drawer-menu-card` yapisini kullanir.
- Bottom bar Vue CSS override'i stable 5 kolon merkezleme kontratina cekildi.
- Navbar ticker `nav-alert-copy` ve stable item kontratina yaklastirildi.

Bu degisiklikler normal/default runtime'i Vue yapmaz; Vue preview halen yalniz `?engine=vue` ile acilir.
