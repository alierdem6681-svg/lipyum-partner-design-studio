# Lipyum Partner Architecture

Tarih: 19 Haziran 2026
Branch: `feature/v12-golden-vue-cutover`

## Current Shell

V12-K icin gecerli shell politikasi stable design default, Vue preview explicit seklindedir.

`src/app.js` once deep link resolver'i calistirir, sonra `engine` query parametresini okur:

- `?engine=vue`: Vue preview runtime.
- Normal URL: stable legacy product design.
- `?engine=legacy`: stable legacy product design ile ayni legacy yol.

Runtime marker'lari:

- Stable/default: `data-runtime="legacy"`.
- Vue preview: `data-runtime="vue"`.
- Vue boot hatasi: `data-runtime="vue-error"`.

## Runtime Source Of Truth

Gecerli secim `src/app.js` icindedir:

```js
const useVueEngine = requestedEngine === "vue";
```

Bu nedenle Vue yalniz explicit preview flag ile acilir. Default Vue cutover `d91d8f6` ile geri alinmistir.

## Vue Preview Root

Vue preview root:

- `src/vue/main.js`
- `createApp(App)`
- Pinia
- Vue Router
- `createWebHashHistory()`
- `src/vue/layouts/AppShell.vue`
- `RouterView`

Shared Vue shell componentleri:

- `AppHeader`
- `AppBottomBar`
- `AppDrawer`
- `AppSheet`
- `AppModal`
- `AppToast`
- `MobileLayout`

## Stable Runtime Policy

`src/legacyApp.js` V12-K itibariyla normal URL stable product design yoludur. Bu durum yeni urun gelistirmesinin legacy icine tasinmasi anlamina gelmez; sadece default kullanici deneyiminin gorsel regresyonlara karsi korunmasi icindir.

Vue preview hatti urun onayi ve gorsel gate'ler gecmeden normal/default acilisa alinmaz.

## Quality Gate

V12-K icin gecerli gate komutlari:

```bash
npm run test:quality-gate:stable-default
npm run test:quality-gate:vue-preview
npm run test:quality-gate:v12-k
```

V12-J `default Vue` gate ve raporlari tarihsel kabul edilir; guncel mimari kabul kaynagi degildir.
