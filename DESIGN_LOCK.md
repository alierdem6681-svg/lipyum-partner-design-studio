# Design Lock

Bu repository'de tasarımın bilinçsiz şekilde değişmesini önlemek için V12-K sonrası kilit aktiftir.

## Zorunlu Kurallar

- Paket sürümleri exact tutulur; `^`, `~` veya range kullanılmaz.
- Dependency kurulumu `package-lock.json` ile yapılır.
- Normal URL stable legacy tasarımı açar.
- Vue preview yalnız `?engine=vue` ile açılır.
- Profil, sidebar, bottom bar ve navbar ticker tasarım kontratı `STABLE_DESIGN_CONTRACT.json` ve V12-K testleriyle korunur.
- Tasarım hassas dosyaları kullanıcı onayı olmadan değiştirilemez.

## Onay Mekanizması

Tasarım hassas dosya değişikliği gerekiyorsa commit mesajında şu token bulunmalıdır:

```text
DESIGN-APPROVED-BY-DENIZKAN
```

Bu token yoksa CI `design-approval` adımında fail olur.

## Kontrol Komutları

```bash
npm run test:dependency-lock
npm run test:design-contract
npm run test:quality-gate:v12-k
```

## Geri Dönüş

Son güvenli tasarım yedeği:

```bash
git reset --hard backup/20260619-175808-design-risk-lock
```
