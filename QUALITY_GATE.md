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
npm run test:screenshots
npm run build
git diff --check
```

Tek komutla tüm kapıyı çalıştırmak için:

```bash
npm run test:quality-gate
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
