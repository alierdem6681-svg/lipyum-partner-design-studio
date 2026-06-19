# Lipyum Partner Quality Gate

## V12-K Current Runtime Gate

Tarih: 19 Haziran 2026

V12-K icin gecerli runtime politikasi:

- Normal URL stable legacy product design acmalidir.
- `?engine=vue` Vue preview acmalidir.
- V12-J `default Vue` kabul raporlari `SUPERSEDED_BY_D91D8F6_DESIGN_RESTORE` durumundadir.

Gecerli hafif V12-K gate komutlari:

```bash
npm run test:quality-gate:stable-default
npm run test:quality-gate:vue-preview
npm run test:quality-gate:v12-k
```

Bu komutlar normal URL'nin `data-runtime="legacy"` marker'i ile stable tasarimi korudugunu ve explicit Vue preview yolunun `data-runtime="vue"` marker'i ile acildigini dogrular.

## V12-K Final Trusted Gate

`npm run test:quality-gate:v12-k` artik hafif gate degildir. Full gate su adimlari kapsar:

- syntax
- dependency lock
- real GitHub design review
- static design contract
- guard self-protection
- no Vue inline style / random hex / raw SVG debt
- stable default runtime
- explicit Vue preview
- profile/sidebar/bottom bar parity
- stable-to-vue visual regression
- build
- `git diff --check`

Full gate, PR #3 guncel head'i `alierdem6681-svg` tarafindan approve edilmeden PASS olamaz. Bu beklenen guvenlik davranisidir.

V12-J `test:quality-gate:v12-j` ve `test:quality-gate:v12-final` sonuclari tarihsel kanittir; V12-K icin final runtime kabul kapisi olarak kullanilmaz.

Bu dosya bundan sonraki tüm Codex geliştirme görevleri için tamamlanma yasasıdır. Bir görev, ilgili kalite kapısı çalışmadan tamamlandı sayılamaz.

## Zorunlu Komutlar

Her geliştirme sonunda mümkün olan en geniş kapsamla şu komutlar çalıştırılmalıdır:

```bash
npm run check
npm run lint
npm run test
npm run test:routes
npm run test:e2e
npm run test:e2e:mobile
npm run test:accessibility
npm run test:interactions
npm run test:sidebar
npm run test:bottom-bar
npm run test:navigation-contract
npm run test:forms
npm run test:device-matrix
npm run test:performance
npm run test:visual-alignment
npm run test:deeplinks
npm run test:satisfaction
npm run test:home-flow
npm run test:packages-flow
npm run test:referral-flow
npm run test:support-ticket
npm run test:profile-badges
npm run test:clickable-inventory
npm run test:visual-regression
npm run test:visual-qa-report
npm run test:text-overflow
npm run test:touch-targets
npm run test:header-consistency
npm run test:back-stack-stress
npm run test:modal-sheet-drawer
npm run test:all-routes-interactions
npm run test:v10-quality-automation
npm run test:cta-mist
npm run test:notification-header
npm run test:profile-grid-geometry
npm run test:v11-audit
npm run test:screenshots
npm run build
git diff --check
```

Tek komutla tüm kapıyı çalıştırmak için:

```bash
npm run test:quality-gate
```

V11 sertleştirilmiş kapı için:

```bash
npm run test:quality-gate:v11
```

## Başarısızlık Kuralı

- Herhangi bir test fail olursa görev tamamlandı denmez.
- Önce hata düzeltilir.
- Sonra kalite kapısı tekrar çalıştırılır.
- Ortam kısıtı nedeniyle çalışmayan test varsa final raporunda açıkça yazılır.

## Görsel ve Etkileşim Değişiklikleri

- Görsel değişiklik yapıldıysa `npm run test:screenshots` çalıştırılmalıdır.
- Header, simulator, mobile layout veya bottom bar değiştiyse mobile/geometry testleri çalıştırılmalıdır.
- Navigation, sidebar, CTA, form, filter veya route davranışı değiştiyse interaction testleri çalıştırılmalıdır.
- Route, device coverage veya responsive davranış değiştiyse `npm run test:device-matrix` çalıştırılmalıdır.
- Bundle, legacy cleanup veya render performansı etkileniyorsa `npm run test:performance` çalıştırılmalıdır.
- Icon-only buton, sheet/modal/drawer close veya header aksiyonu değiştiyse `npm run test:visual-alignment` çalıştırılmalıdır.
- Deep link, external link veya route fallback davranışı değiştiyse `npm run test:deeplinks` çalıştırılmalıdır.
- Memnuniyet, market değerlendirme veya geri bildirim akışı değiştiyse `npm run test:satisfaction` çalıştırılmalıdır.
- Yeni kritik aksiyonlara `data-testid` eklenmelidir.

## Rapor Zorunluluğu

Her görev sonunda raporda veya final mesajında şu başlıklar yer almalıdır:

- Değişen dosyalar
- Çalıştırılan testler
- Geçen testler
- Fail olup düzeltilen testler
- Kalan risk
- Bir sonraki önerilen adım

## Yasaklar

- Test çalıştırmadan tamamlandı deme.
- Sadece `npm run check` ile yetinme.
- Kullanıcıya görünen yeni route'u legacy runtime içine ekleme.
- Dinamik Tailwind class üretme.
- Header veya bottom bar için sayfa bazlı özel ölçü hack'i ekleme.
- `legacyApp.js` içine yeni ürün geliştirmesi yapma; yalnızca compatibility veya temizleme amaçlı dokun.

## V8 Sertleştirilmiş Kapı

`npm run test:quality-gate` artık şu ek kontrolleri de içerir:

- Sidebar aç/kapat ve duplicate yardım kontrolü.
- Bottom bar route ve aktif sekme kontrolü.
- Navigation contract testleri.
- Form/filter/load-more testleri.
- 320, 360, 375, 390, 393, 412, 430 ve 768 px viewport sınıfları.
- Performans smoke: DOM node sayısı, JS/CSS resource bütçesi ve route switch süresi.

## V9 Ek Kapılar

`npm run test:quality-gate` V9 itibarıyla şu kontrolleri de çalıştırır:

- `test:visual-alignment`: icon-only button center alignment.
- `test:deeplinks`: query/path deep link fallback.
- `test:satisfaction`: 5 yıldız market CTA ve 1-4 yıldız destek feedback mock akışı.
- `test:home-flow`: ana sayfa kritik sheet/route aksiyonları.
- `test:packages-flow`: paket builder/checkout mock akışı.
- `test:referral-flow`: partner davet, rail ve partner detay akışı.
- `test:support-ticket`: sidebar Talep Oluştur form ve success akışı.

## V10 Ek Kapılar

`npm run test:quality-gate` V10 itibarıyla şu kontrolleri de çalıştırır:

- `test:profile-badges`: profil ve sidebar rozet `+N` davranışının tek yönlü açıldığını ve route-local kaldığını doğrular.
- `test:clickable-inventory`: kritik route'larda görünür tıklanabilir öğeleri sayar ve `CLICKABLE_INVENTORY_REPORT.md` raporunu günceller.
- `test:visual-regression`: core route'larda header, bottom bar, içerik ve yatay overflow smoke kontrolü yapar.
- `test:visual-qa-report`: sampled route görsel sağlık durumunu `VISUAL_QA_REPORT.md` içine yazar.
- `test:text-overflow`: kritik başlık, buton ve nav label'larında taşma/wrap smoke kontrolü yapar.
- `test:touch-targets`: global navigation, sheet ve drawer kontrollerinin mobil touch target ölçülerini doğrular.
- `test:header-consistency`: kritik route'larda header görünürlüğü, sağ aksiyon slotu ve title overflow durumunu kontrol eder.
- `test:back-stack-stress`: derin route akışlarında geri davranışını zorlar.
- `test:modal-sheet-drawer`: sheet, drawer ve partner share panel aç/kapat akışını kontrol eder.
- `test:all-routes-interactions`: kritik route'larda güvenli header interaction smoke kontrolü yapar.
- `test:v10-quality-automation`: V10 rapor dosyalarının ve partner kart önizleme route'unun varlığını doğrular.

V10 sonrası görsel değişikliklerde `VISUAL_QA_REPORT.md` ve `CLICKABLE_INVENTORY_REPORT.md` deterministik olarak yeniden üretilmelidir.

## V11 Ek Kapılar

`npm run test:quality-gate` ve `npm run test:quality-gate:v11` V11 itibarıyla şu ek kontrolleri de çalıştırır:

- `test:cta-mist`: orta CTA sis efektinin gecikmeli başladığını, CTA içinde kırpıldığını ve reduced-motion modunda hareket etmediğini doğrular.
- `test:notification-header`: Bildirimler header sağ aksiyonunun Bildirim Ayarları route'una giden anlamlı icon-only action olduğunu doğrular.
- `test:profile-grid-geometry`: profil 4x2 gridinin profil kartı ile aynı sol/sağ genişliğe oturduğunu ve label'ların 320/360/390/430 px viewportlarda wrap olmadığını doğrular.
- `test:v11-audit`: route map, route metadata ve page route eşleşmesini denetler; full Vue migration tamamlanmadıysa bunun P0 olarak dokümante edildiğini doğrular.

V11 notu: Tam Vue Router/SFC migration bitene kadar `V11_ARCHITECTURE_AUDIT.md` içinde legacy boot ve aktif legacy render borcu açıkça P0 olarak kalır; bu borç gizlenmemelidir.

## V12 Golden Master Ek Kapıları

V12 Golden Master çalışmasında production cutover’dan önce aşağıdaki komutlar zorunludur:

```bash
npm run test:v12-architecture
npm run test:v12-core
npm run test:v12-compatibility
npm run test:v12-parity
npm run test:quality-gate:v12
```

V12 parity kuralı:

- `test:v12-parity` `V12_VISUAL_PARITY_REPORT.md` ve JSON raporunu üretir.
- Core route’larda P0/P1 parity farkı varsa default Vue cutover kapalı kalmalıdır.
- Parity fail varken `src/app.js` default Vue boot’a geçirilirse V12 parity gate fail olmalıdır.
- Parity fail’in “beklenen” olması, V12’nin tamamlandığı anlamına gelmez; yalnızca güvenli şekilde cutover’ın engellendiğini kanıtlar.

V12 final cutover için ayrıca gerçek Golden Master visual regression, content parity, interaction parity ve full quality gate iki ardışık koşuda geçmelidir.

## V12-C Core Route Gate

Core route çalışmaları için ek komutlar:

```bash
npm run test:parity:core
npm run test:parity:core:strict
npm run test:quality-gate:v12-c
```

Kurallar:

- `/home`, `/jobs`, `/my-jobs`, `/calendar` için `test:parity:core` content/action contract kapısıdır.
- `test:parity:core:strict` visual parity dahil strict kapıdır ve P0/P1 görsel fark varken fail vermelidir.
- `test:quality-gate:v12-c` strict visual parity fail iken tamamlandı sayılmaz.
- Default Vue boot ve PR ready durumu bu komutlar iki kez kod değişmeden geçmeden açılamaz.

Mevcut V12-C durumu:

- `test:parity:core`: PASS.
- `test:parity:core:strict`: FAIL, visual parity nedeniyle.

## V12-E Product Scope Gate

V12-E itibarıyla Paketler ürünü aktif kapsamdan çıkarıldı. Quality Gate artık package builder/checkout flow'u beklemez.

Yeni komut:

```bash
npm run test:quality-gate:v12-e
```

Kapsam:

- syntax/check
- architecture
- package purge
- route smoke
- bottom label doğrulaması
- blank bottom routes
- retired package redirects
- subscription retained
- V12-E product scope
- build
- git diff check

Kaldırılan gate adımı:

- `test:packages-flow`

Yeni adımlar:

- `test:package-feature-removed`
- `test:product-scope:v12-e`
- `test:blank-bottom-routes`
- `test:bottom-labels`
- `test:retired-package-routes`
- `test:subscription-retained`

Not: `/home` Golden visual parity V12-E scope dışı bırakılmıştır; ayrı P0 olarak devam eder.
## V12-I Product Golden Final Gate

V12-I itibariyla Home parity icin V11 historical baseline dogrudan final engeli degildir. V11 baseline saklanir; canli urunde kabul edilen stabil Home gorunumu V12 Product Golden olarak ayrica tutulur.

Yeni final komut:

```bash
npm run test:quality-gate:v12-final
```

Bu gate su kontrolleri calistirir:

- JS/Vue syntax.
- V12 mimari kontrolleri.
- Stabil urun acilisi ve Vue preview ayrimi.
- Paket ozelliginin aktif urunden kaldirildigi kontrolu.
- Retired package route redirect kontrolu.
- Blank bottom route kontrolu.
- Zengin route outcome testleri.
- Home V12 Product Golden strict visual parity.
- Home content ve interaction contract.
- Build.
- `git diff --check`.

V12-I kabul kriteri:

- Home diff `<= 0.015`.
- `?engine=vue#/home` uzerinden Vue screenshot alinmis olmali.
- Final gate iki kez kod degismeden PASS olmali.
- Run loglari `artifacts/v12-i/final-gate-run-1.log` ve `artifacts/v12-i/final-gate-run-2.log` altinda saklanmali.

## V12-J Release Candidate Gate

V12-K notu: Bu bolum `SUPERSEDED_BY_D91D8F6_DESIGN_RESTORE` durumundadir ve yalniz tarihsel V12-J kabulunu anlatir. Guncel politika normal URL = stable legacy product design, `?engine=vue` = Vue preview seklindedir.

V12-J itibariyla normal URL default Vue runtime acmalidir. Legacy yalniz `?engine=legacy` rollback parametresiyle calisir.

Yeni release-candidate komut:

```bash
npm run test:quality-gate:v12-j
```

Final alias:

```bash
npm run test:quality-gate:v12-final
```

Bu gate sunlari zorunlu kilar:

- normal URL `data-runtime="vue"` marker'i verir.
- `?engine=vue` Vue acar.
- `?engine=legacy` `data-runtime="legacy"` marker'i verir.
- legacy default boot kabul edilmez.
- Vue Router navigation sahibidir.
- aktif route'lar default Vue'da acilir.
- blank bottom route'lar bos kalir.
- retired package route'lari `/subscription` route'una gider.
- Home Product Golden parity normal `/#/home` URL ile `<= 0.015` kalir.
- critical clickable inventory unlabeled `0` kalir.
- accessibility ve responsive smoke gecmelidir.
- build ve `git diff --check` gecmelidir.

V12-J final raporda iki ardışık `test:quality-gate:v12-j` kosusunun log hashleri verilmelidir.
