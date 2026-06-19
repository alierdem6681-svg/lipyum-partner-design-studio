# Design Lock

Bu repository'de tasarimin kontrolsuz sekilde degismesini onlemek icin V12-K Final trusted design governance kurallari gecerlidir.

## Zorunlu Kurallar

- Paket surumleri exact tutulur; semver range kullanilmaz.
- Dependency kurulumu `package-lock.json` ile yapilir.
- Normal URL stable legacy tasarimi acar.
- Vue preview yalniz `?engine=vue` ile acilir.
- Profil, sidebar, header ticker ve bottom bar tasarim kontrati testlerle korunur.
- Tasarim hassas dosyalar GitHub kullanicisi `alierdem6681-svg` tarafindan guncel PR head SHA uzerinden approve edilmeden trusted gate gecemez.
- Commit mesaji veya ortam degiskeni tek basina tasarim onayi sayilmaz.

## Korunan Alanlar

Korunan dosya kapsamı `scripts/design-sensitive-paths.mjs` ve `.github/CODEOWNERS` tarafindan tanimlanir.

Ana kapsam:

- `src/vue/`
- `src/styles/`
- `src/components/`
- `src/pages/`
- `src/utils/constants.js`
- `src/utils/routeMeta.js`
- `public/`
- `index.html`
- package, Vite, Tailwind, PostCSS ve Playwright config dosyalari
- workflow dosyalari
- design guard scriptleri
- golden master ve parity testleri

## Onay Mekanizmasi

`scripts/assert-design-review.mjs` su kosullari arar:

1. PR acik olmalidir.
2. PR head SHA kontrol edilen SHA ile ayni olmalidir.
3. Review state `APPROVED` olmalidir.
4. Review yapan kullanici `alierdem6681-svg` olmalidir.
5. Review `commit_id`, guncel PR head SHA ile eslesmelidir.

Onaydan sonra yeni tasarim hassas commit gelirse onay stale kabul edilir.

## Kontrol Komutlari

```bash
npm run test:dependency-lock
npm run test:design-contract
npm run test:design-review
npm run test:quality-gate:v12-k
```

## Deploy Politikasi

GitHub Pages deploy otomatik feature branch push'u ile calismaz. Deploy yalniz `workflow_dispatch` ve protected `github-pages` environment uzerinden yapilir.

## Geri Donus

Son guvenli tasarim yedegi:

```bash
git reset --hard v12-k-design-lock-checkpoint
```
