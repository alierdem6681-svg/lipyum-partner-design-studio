# Codex için tek parça uygulama promptu

Aşağıdaki görevi doğrudan uygula. Yalnızca öneri veya örnek kod verme; repository içinde üretim kalitesinde değişiklikleri yap, test et ve sonucu raporla.

---

## GÖREV

Lipyum mobil uygulamasındaki **Profilim** ekranına, `Profil Gücünüz` kartı ile mevcut alt `Önizleme Yap` CTA'sı arasına yeni bir **profil paylaşım tanıtım kartı** ekle. Tasarımın görsel kaynağı aşağıdaki dosyalardır ve bunlar source of truth kabul edilmelidir:

- `01_original_target_screen.png` — mevcut ekran ve yerleştirilecek boş alan
- `02_full_visual_reference.png` — hedef tam ekran görünümü
- `03_promo_card_reference_crop.png` — uygulanacak kartın yakın referansı
- `DESIGN_SPEC.md` — detaylı ölçü, renk, tipografi, davranış ve kabul kriterleri
- `design_tokens.json` — önerilen tasarım tokenları

## ÖNCE REPOSITORY'Yİ İNCELE

1. Projenin framework'ünü ve mimarisini tespit et: Flutter, React Native, SwiftUI, Jetpack Compose veya başka bir yapı olabilir.
2. Şu metinlerle hedef ekranı ara: `Profilim`, `Profil Gücünüz`, `Çalışma Durumu`, `Önizleme Yap`.
3. Mevcut design system/theme, spacing/radius/color tokenları, icon paketi, localization yaklaşımı, profil modeli/avatar alanı, navigation ve preview/share akışını bul.
4. Mevcut yaklaşımı koru. Yeni bir UI framework, state-management sistemi veya ağır bağımlılık ekleme.
5. Repository içinde aynı işi yapan reusable bileşenler varsa onları kullan.

## UYGULAMA KAPSAMI

Yeni bileşenin önerilen adı:

```text
ProfileSharePromoCard
```

Bileşen sıralaması kesin olarak şöyle olmalı:

```text
ProfileCard
WorkStatusCard
ProfileStrengthCard
ProfileSharePromoCard   // yeni
Preview CTA             // mevcut, korunacak
```

Sadece yeni kartı ve gerekli entegrasyonu yap. Header, profil kartı, çalışma durumu, profil gücü veya alt CTA'nın mevcut görünümünü gereksiz yere değiştirme.

## ÇOK ÖNEMLİ GÖRSEL KURAL

- Referans ekran görüntüsünü tek parça bitmap olarak UI içine koyma.
- Kartı gerçek/native layout, text, icon, border, shadow ve shape bileşenleriyle oluştur.
- Görsel karşılaştırmada `03_promo_card_reference_crop.png` esas alınmalı.
- 390 dp genişlikte hedefe mümkün olduğunca pixel-close yaklaş; ana ölçülerde tolerans yaklaşık ±4 dp.

## KART İÇERİĞİ

Kesin Türkçe metinler:

```text
ÜCRETSİZ

Profilini Paylaş,
Daha Fazla İş Al

Profil linkini Instagram, web siten veya sosyal medyada paylaş. Müşteriler sana ulaşsın, randevu alsın, mesaj göndersin veya teklif istesin.

Randevu Al
Mesaj Gönder
Teklif İste

1. Ön izleme yap
2. Paylaş
3. Müşteri kazan
```

Metinleri projenin localization/string kaynaklarına ekle. Türkçe karakterleri ve satır kırılımlarını koru. Açıklamayı ellipsis ile kesme.

## HEDEF LAYOUT

390 dp ekran referansında:

- Kart yatay dış margin: yaklaşık 16 dp
- Kart genişliği: ekran genişliği eksi 32 dp
- Kart `minHeight`: yaklaşık 284 dp; font scaling nedeniyle içerik gerekiyorsa doğal olarak büyüyebilsin
- Kart padding: 16 dp
- Kart radius: 18 dp
- Kart border: 1 dp, açık yeşil
- Arka plan: beyaz / çok hafif yeşil tint
- Çok hafif shadow/elevation

Kartın üst bölümünde iki kolon oluştur:

1. Sol kolon: rozet, iki satırlı başlık, açıklama
2. Sağ kolon: paylaşım ağını anlatan küçük native illüstrasyon

Başlık:

- `Profilini Paylaş,` koyu lacivert/siyaha yakın
- `Daha Fazla İş Al` yeşil
- Yaklaşık 24 sp, extra-bold

Rozet:

- Yeşil pill
- Beyaz `ÜCRETSİZ`
- Yaklaşık 22 dp yükseklik

Açıklama:

- Yaklaşık 13 sp
- Orta koyulukta gri/lacivert
- 390 dp ekranda yaklaşık 4 satır

## SAĞ İLLÜSTRASYON

İllüstrasyonu native View/Canvas/SVG yaklaşımıyla oluştur; bitmap kullanma. Mevcut icon kütüphanesini tercih et.

İçerik:

- İnce yeşil stroke'lu küçük profil kartı
- Profil kartında aktif partnerin gerçek avatarı; yoksa mevcut placeholder
- Avatar altında 2–3 açık gri satır
- Profil kartının sağ üstüne bindirilmiş yeşil yuvarlatılmış kare içinde link/chain ikonu
- Noktalı çizgilerle bağlı küçük sosyal/web balonları:
  - Instagram benzeri renkli sosyal balon
  - mavi globe/web balonu
  - yeşil mesajlaşma/WhatsApp benzeri balon
- Alt sağda açık yeşil daire içinde users/customer ikonu
- Sol tarafta birkaç kısa vurgu çizgisi

İllüstrasyon dekoratif olmalı; screen reader için gizle veya tek açıklayıcı label altında grupla.

## ÜÇ FAYDA KUTUSU

Üst bölümün altında tek satırda üç eşit kutu:

1. calendar-check ikonu + `Randevu Al`
2. message-circle ikonu + `Mesaj Gönder`
3. file-text ikonu + `Teklif İste`

Stil:

- Eşit genişlik
- 8 dp gap
- 38–40 dp yükseklik
- 10–12 dp radius
- Beyaz arka plan
- Açık yeşil border
- Hafif shadow
- Yeşil 18–20 dp ikon
- Koyu, semibold/bold tek satır metin

Bunlar yalnızca bilgi öğeleriyse button semantics verme.

## ÜÇ ADIMLI AKIŞ

Alt bölümde yatay üç adım:

1. eye ikonu — `1. Ön izleme yap`
2. share-2 ikonu — `2. Paylaş`
3. users ikonu — `3. Müşteri kazan`

- İkonlar 46–50 dp çaplı daireler içinde olmalı.
- Orta adım görsel olarak biraz daha vurgulu olmalı.
- Dairelerin arasına açık yeşil noktalı/dashed connector çizgileri koy.
- Etiketleri dairelerin altında ortala.
- 360 dp genişlikte etiketler çakışmamalı veya kesilmemeli.

## RENKLER

Önce mevcut tema tokenlarını eşleştir. Uygun token yoksa şu değerleri kullan:

```text
primaryGreen        #10A35A
primaryGreenDark    #079552
primaryGreenSoft    #EAF8F0
primaryGreenFaint   #F7FDF9
cardBackground      #FFFFFF
cardTint            #F8FDF9
cardBorder          #CDEFD9
textPrimary         #101828
textSecondary       #52627A
textTertiary        #718096
dottedConnector     #9DDEB8
shadow              rgba(16, 24, 40, 0.07)
```

## DAVRANIŞ VE ENTEGRASYON

- Mevcut alt `Önizleme Yap` CTA'sını koru ve mevcut preview ekranına yönlendirmeye devam etmesini sağla.
- Preview ekranındaki paylaş butonu ve native share sheet akışı zaten varsa yeniden tasarlama; regresyon olmadığını doğrula.
- Paylaş akışı eksikse, mevcut mimariye uygun native share sheet ile partnerin public profil URL'sini paylaşacak en küçük güvenli implementasyonu yap.
- Kartın kendisi zorunlu olarak tıklanabilir değildir. Görsel referansta ayrı bir kart içi CTA yoktur.
- Alt CTA sticky/fixed ise scroll içeriğine CTA yüksekliği + safe-area kadar bottom padding ekle; kart CTA altında kalmasın.
- Public profil URL'sini hard-code etme; mevcut partner/profile modelinden al.
- Mevcut analytics altyapısı varsa yeni SDK eklemeden şu eventleri uygun noktalarda kullan veya mevcut karşılıklarına bağla:
  - `profile_share_promo_impression`
  - `profile_preview_cta_tap`
  - `profile_share_completed`
  Analytics altyapısı yoksa bu maddeyi atla.

## RESPONSIVE VE ERİŞİLEBİLİRLİK

Şu genişliklerde kontrol et:

- 360 dp
- 390 dp
- 430 dp

Şartlar:

- Yatay overflow yok
- Metin/ikon çakışması yok
- Açıklama kesilmiyor
- İllüstrasyon metnin üzerine gelmiyor
- Font scaling yaklaşık 1.0–1.15 aralığında bozulmuyor
- Dokunulabilir mevcut CTA minimum 44×44 dp hedefi koruyor
- Dekoratif ikonlar accessibility ağacında gereksiz gürültü oluşturmuyor
- Kart için uygun özet label: `Profilini paylaşarak müşterilerin randevu almasını, mesaj göndermesini ve teklif istemesini sağla. Ücretsiz.`

## KOD KALİTESİ

- Projenin mevcut naming, folder, state, theme ve localization düzenine uy.
- Type-safe ve reusable küçük bileşenler oluştur.
- Magic number'ları tek bir styles/tokens alanında topla.
- Gereksiz refactor yapma.
- Yeni bağımlılık ancak mevcut araçlarla teknik olarak mümkün değilse eklenebilir; eklenirse gerekçesini raporla.
- Mevcut lint/format/type-check kurallarını uygula.
- Uygun test altyapısı varsa en azından render/snapshot/widget testi ekle veya güncelle.
- Test ID/semantics identifier gerekiyorsa `profile-share-promo-card` benzeri stabil bir değer kullan.

## DOĞRULAMA

Uygulamadan sonra:

1. İlgili formatter'ı çalıştır.
2. Lint/type-check çalıştır.
3. İlgili unit/widget/component testlerini çalıştır.
4. Projenin ortamı izin veriyorsa 390 dp genişlikte ekran görüntüsü al ve `03_promo_card_reference_crop.png` ile görsel olarak karşılaştır.
5. Özellikle kartın alt CTA tarafından örtülmediğini doğrula.
6. Preview ve share akışında regresyon olmadığını doğrula.

## KABUL KRİTERLERİ

- Kart doğru konuma eklenmiştir.
- Referans tasarıma çok yakın görünür.
- Tüm Türkçe metinler eksiksizdir.
- Partner avatarı dinamiktir.
- UI bitmap değildir; native bileşenlerden oluşur.
- 360–430 dp aralığında overflow yoktur.
- Mevcut `Önizleme Yap` ve paylaş akışı çalışır.
- Lint/type-check/testler geçer veya repository kaynaklı önceden var olan engeller açıkça belirtilir.

## SON RAPOR FORMATI

İş bitince yalnızca şu başlıklarla kısa ve somut rapor ver:

```text
Uygulananlar
Değiştirilen dosyalar
Çalıştırılan kontroller
Varsayımlar / kalan riskler
```

Analizde kalma; değişiklikleri doğrudan uygula.
