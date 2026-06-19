# Lipyum Partner Quality Gate

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
## V12-A Quality Gate

V12-A için ek scriptler:

- `npm run test:v12-shell`
- `npm run test:v12-core-routes`
- `npm run test:v12-legacy-boundary`
- `npm run test:v12-a`
- `npm run test:quality-gate:v12-a`

`test:v12-a` sırasıyla `check`, mimari boundary testleri, shell e2e, core route e2e, build ve `git diff --check` çalıştırır.

`test:quality-gate:v12-a`, V12-A kabul koşuluna yaklaşmak için `test:v12-a` komutunu iki kez arka arkaya çalıştırır. Kod değişirse bu çift çalışma yeniden başlatılmalıdır.
