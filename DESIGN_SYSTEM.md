# Lipyum Partner Design System

Bu doküman Lipyum Partner mobil webview prototipinin ortak UI kararlarını özetler. Kaynak değerler `src/styles/tokens.css` ve `tailwind.config.cjs` içinde tutulur.

## Font Sistemi

Temel font ailesi sistem fontlarını kullanır:

```css
-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Roboto", "Inter", "Noto Sans", "Segoe UI", sans-serif
```

Sayfa veya component bazında farklı `font-family` tanımlanmamalıdır.

## Renk Skalası

- Primary: Lipyum yeşili, ana aksiyonlar ve aktif durumlar.
- Info: mavi tonları, bilgi ve nötr finansal aksiyonlar.
- Warning: amber/turuncu, bakiye düşük veya dikkat gereken durumlar.
- Danger: kırmızı, silme/dondurma/kritik hata.
- Neutral: gri tonları, metin, border, surface ve pasif durumlar.
- Premium: Gold/Pro/VIP gibi statüler için kontrollü tokenlar.

Component içinde rastgele hex kullanılmamalı; token veya Tailwind theme kullanılmalıdır.

## Spacing

Mobil page yatay boşlukları full-width hissi için düşük tutulur:

- Page padding: 10-12px
- Section gap: 10-12px
- Card gap: 10-12px
- Normal card padding: 12-14px
- Hero card padding: 14-16px

## Radius

- Chip/Pill: 999px
- Küçük buton: 10-12px
- Normal kart: 14-16px
- Hero kart: 18-20px
- Sheet/modal: 22-24px
- Bottom bar: 28-30px
- CTA: tam daire

## Shadow

Gölge düşük ve kontrollü olmalıdır. Neon hissi yalnızca ana CTA'da hafif glow olarak kullanılabilir.

## Button Sizes

- Minimum touch target: 44px
- Label tek satır olmalı.
- Genişlik yetmezse padding ve font clamp devreye girer, ikinci satıra düşmez.
- Icon-only butonlarda `aria-label` zorunludur.

## Header

- Tüm route'larda tek header familyası kullanılmalıdır.
- Title/subtitle tek satır ellipsis alır.
- Sol ve sağ aksiyon alanları minimum 44px touch target alır.
- Header yüksekliği sayfa içeriğine göre büyümemelidir.

## Bottom Bar

- Tek `BottomBar` component standardı kullanılır.
- Pasif ikonlar 24px ve nötr renktedir.
- Orta CTA `/jobs` route'una gider.
- Home CTA daha güçlü, subpage CTA daha sakin olabilir.
- Label'lar tek satır olmalıdır.

## Page Padding ve Kart Genişliği

- Kartlar mobilde `width: 100%` davranır.
- Desktop iPhone simulator içinde de aynı page padding standardı korunur.
- Yatay scroll kabul edilmez.

## Text Overflow

Kritik kısa metinlerde şu kural geçerlidir:

- `white-space: nowrap`
- `overflow: hidden`
- `text-overflow: ellipsis`
- `min-width: 0`

## Touch Target

Tüm tıklanabilir alanlar minimum 44x44px hedeflemelidir. Görsel ikon küçük olabilir, touch area daraltılmamalıdır.

## Component Kullanım Kuralı

Yeni geliştirmeler mümkün olduğunca şu ortak componentleri kullanmalıdır:

- AppHeader/Header
- AppPage/PageContainer
- AppBottomBar/BottomBar
- AppButton/Button
- AppCard/Card
- AppChip/Chip
- AppBadge/Badge
- AppListItem/MenuList
- AppIcon

Legacy runtime içine yeni ürün geliştirmesi eklenmemeli; kalan legacy ekranlar kademeli olarak component/page yapısına taşınmalıdır.
