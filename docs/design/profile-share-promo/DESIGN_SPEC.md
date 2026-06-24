# Lipyum — Profil Paylaşım Tanıtım Alanı

## 1. Kapsam

Bu çalışma, **Profilim** ekranında `Profil Gücünüz` kartının hemen altında ve mevcut sabit `Önizleme Yap` butonunun hemen üstünde bulunan boş alana eklenecek tanıtım kartıdır.

- Yalnızca bu yeni tanıtım alanını üret.
- Ekranın mevcut üst bölümlerini, navigasyonunu ve alt `Önizleme Yap` butonunu değiştirme.
- Tasarımı ekran görüntüsü olarak yerleştirme; native UI bileşenleriyle yeniden oluştur.
- Kartın amacı: partnerin profil bağlantısını Instagram, web sitesi, WhatsApp veya başka kanallarda paylaşmasını teşvik etmek.

Referans dosyaları:

1. `01_original_target_screen.png`: kartın yerleştirileceği mevcut ekran.
2. `02_full_visual_reference.png`: hedef görünümün tamamı.
3. `03_promo_card_reference_crop.png`: yalnızca uygulanacak tanıtım kartı.

## 2. Ekrandaki konum

Bileşen sıralaması:

```text
Profil kartı
Çalışma Durumu
Profil Gücünüz
ProfileSharePromoCard   ← yeni bileşen
Önizleme Yap            ← mevcut sabit/sticky CTA
```

Sayfa kaydırılabiliyorsa yeni kart scroll içeriğine dahil olmalı. Alt CTA sabitse, son içeriğin CTA altında kalmaması için CTA yüksekliği + safe-area kadar bottom padding bırakılmalı.

## 3. Tasarım ölçüleri

Referans temel ekran genişliği: **390 dp**.

Yeni kartın hedef ölçüsü:

- Dış genişlik: `screenWidth - 32` → 390 dp ekranda yaklaşık **358–364 dp**
- Yatay dış boşluk: **16 dp**
- Hedef yükseklik: yaklaşık **284–300 dp**; metin ölçeklendirmesinde içerik taşmaması için sabit yükseklik yerine `minHeight` kullan.
- İç padding: **16 dp**
- Dış radius: **18 dp**
- Border: **1 dp**
- Hafif gölge/elevation: yalnızca zeminden ayıracak kadar.

Kart içi yerleşim, 364 × 284 dp referansına göre:

| Bölüm | Yaklaşık konum / ölçü |
|---|---|
| ÜCRETSİZ rozeti | x 16, y 14; 66 × 22 |
| Başlık | x 16, y 45; sol kolon yaklaşık 205 dp |
| Açıklama | x 16, y 103; genişlik yaklaşık 205 dp |
| Sağ illüstrasyon | sağdan 12–16 dp; y 28; yaklaşık 136 × 132 dp |
| Fayda kutuları | y yaklaşık 166; 3 eşit kolon; 38–40 dp yükseklik |
| Adım akışı | y yaklaşık 216; ikon çapı 46–50 dp |
| Adım etiketleri | ikonların 8–10 dp altında |

## 4. Renk tokenları

Mevcut uygulama temasında karşılığı varsa mutlaka mevcut tokenları kullan. Yoksa aşağıdaki değerleri başlangıç kabul et:

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

Kart arka planı düz beyaz veya çok hafif, soldan sağa / yukarıdan aşağıya beyazdan `#F7FDF9` tonuna geçen bir gradient olabilir. Gradient için yeni ağır bağımlılık ekleme.

## 5. Tipografi

Uygulamanın mevcut font ailesini kullan. Font tanımlı değilse sistem fontu kullan; yalnızca bu kart için yeni font yükleme.

| Metin | Boyut | Ağırlık | Satır yüksekliği | Renk |
|---|---:|---:|---:|---|
| Rozet | 11–12 | 700 | 15–16 | Beyaz |
| Başlık 1. satır | 23–24 | 800 | 27–29 | `textPrimary` |
| Başlık 2. satır | 23–24 | 800 | 27–29 | `primaryGreen` |
| Açıklama | 12.5–13.5 | 500 | 17–19 | `textSecondary` |
| Fayda metni | 11.5–12.5 | 700 | 15–17 | `textPrimary` |
| Adım etiketi | 10.5–11.5 | 700 | 14–15 | `textPrimary` |

Türkçe karakterler doğru görünmeli. Metinler localization/string kaynaklarına taşınmalı; UI dosyasına dağınık biçimde hard-code edilmemeli.

## 6. Kesin metinler

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

Satır kırılımı hedefi:

```text
Profilini Paylaş,
Daha Fazla İş Al
```

Açıklama 390 dp ekranda yaklaşık 4 satır görünmeli. Daha küçük ekranlarda doğal biçimde 5 satıra çıkabilir; kesilmemeli ve üç nokta kullanılmamalı.

## 7. Bileşen yapısı

Önerilen bileşen ağacı:

```text
ProfileSharePromoCard
├── TopContentRow
│   ├── CopyColumn
│   │   ├── FreeBadge
│   │   ├── Headline
│   │   └── Description
│   └── ShareNetworkIllustration
├── BenefitsRow
│   ├── BenefitItem(calendar-check, "Randevu Al")
│   ├── BenefitItem(message-circle, "Mesaj Gönder")
│   └── BenefitItem(file-text, "Teklif İste")
└── StepsFlow
    ├── StepItem(eye, "1. Ön izleme yap")
    ├── DottedConnector
    ├── StepItem(share-2, "2. Paylaş", emphasized)
    ├── DottedConnector
    └── StepItem(users, "3. Müşteri kazan")
```

## 8. Sağ illüstrasyon

İllüstrasyonu native View/Canvas/SVG bileşenleriyle oluştur. Tek parça bitmap kullanma.

Görsel öğeler:

- İnce yeşil çerçeveli küçük profil kartı.
- Profil kartında aktif partnerin gerçek avatarı; avatar yoksa uygulamanın mevcut placeholder'ı.
- Avatarın altında 2–3 açık gri profil satırı.
- Profil kartının sağ üstünde yeşil, yuvarlatılmış kare içinde zincir/link ikonu.
- Sağ tarafta noktalı bağlantılarla bağlı 2–3 küçük kanal balonu:
  - Instagram benzeri renkli sosyal ikon,
  - mavi web/globe ikonu,
  - yeşil mesajlaşma/WhatsApp benzeri ikon.
- Alt kısımda açık yeşil daire içinde müşteri grubu ikonu.
- Sol tarafta 2–3 kısa vurgu çizgisi.

Bu illüstrasyon dekoratiftir; erişilebilirlik ağacında tek bir açıklama ile temsil edilmeli veya gizlenmelidir.

## 9. Fayda kutuları

- 3 eşit genişlikte yatay kutu.
- Aralık: 8 dp.
- Yükseklik: 38–40 dp.
- Radius: 10–12 dp.
- Arka plan: beyaz.
- Border: 1 dp `cardBorder`.
- Hafif gölge.
- İkon: 18–20 dp, yeşil.
- Metin: tek satır, taşma olmamalı.
- Bunlar bilgi öğeleridir; gerçek aksiyon değilse buton semantiği verme.

## 10. Üç adımlı akış

- Üç ikon eşit aralıkla dağıtılmalı.
- Daire çapı: 46–50 dp.
- İlk ve üçüncü daire: çok açık yeşil zemin, yeşil stroke.
- Orta daire: daha belirgin yeşil zemin/ikon; ana adım olarak vurgulanmalı.
- Daireler arasında yaklaşık 2 dp kalınlıkta, 4–6 dp dash/gap değerli noktalı çizgi.
- Etiketler ikonların altında ortalı.
- Etiketler 2 satıra düşmemeli; 360 dp'de gerekirse fontu yalnızca 0.5–1 dp azalt veya kolon genişliğini optimize et.

## 11. Davranış

- Kartın kendisi zorunlu olarak tıklanabilir değil.
- Mevcut `Önizleme Yap` CTA'sının davranışını koru.
- CTA, mevcut profil önizleme ekranını açmalı.
- Önizleme ekranındaki mevcut paylaş butonuna dokunulduğunda kullanıcı sistem paylaşım seçeneklerinden yöntem seçebilmelidir.
- Bu akış projede zaten varsa yeniden yazma; yalnızca regresyon yaratmadığını doğrula.
- Paylaş akışı yoksa, mevcut mimariye uygun native share sheet kullan ve profilin public URL'sini paylaş.

## 12. Dinamik veriler

Kart metinleri sabit/localized olabilir. İllüstrasyondaki profil görseli dinamik olmalı:

```text
avatarUrl / avatarAsset
```

Public profil URL'si bu kartta görünmek zorunda değildir; gerçek paylaş akışında mevcut partner profil URL'si kullanılmalı.

## 13. Responsive davranış

Kontrol genişlikleri:

- 360 dp
- 375/390 dp
- 414/430 dp

Kurallar:

- Yatay taşma yok.
- Metin kesilmez.
- Sağ illüstrasyon metinle çakışmaz.
- Dynamic Type / font scaling 1.0–1.15 aralığında kırılmadan çalışır.
- 360 dp altında gerekirse illüstrasyon 120 dp'ye kadar küçültülebilir.
- Tablet genişliğinde kartı sınırsız büyütme; mevcut ekran content max-width davranışını kullan.

## 14. Erişilebilirlik

- Metin kontrastı WCAG AA seviyesine yakın/uygun olmalı.
- Dekoratif ikonlar screen reader'dan gizlenmeli.
- Kart için özet accessibility label kullanılabilir:
  `Profilini paylaşarak müşterilerin randevu almasını, mesaj göndermesini ve teklif istemesini sağla. Ücretsiz.`
- Tıklanabilir olmayan fayda öğeleri buton gibi duyurulmamalı.

## 15. Kod kalitesi

- Mevcut framework, design system, state yönetimi ve icon kütüphanesini kullan.
- Yeni bir UI framework ekleme.
- Tekrarlanan öğeleri küçük reusable bileşenlere ayır.
- Magic number'ları token/constants içine al.
- Lint/type-check/test hatası bırakma.
- Değişiklikleri yalnızca gerekli dosyalarla sınırla.

## 16. Kabul kriterleri

1. Yeni kart doğru konuma eklenmiş olmalı.
2. `03_promo_card_reference_crop.png` ile 390 dp genişlikte görsel olarak çok yakın olmalı.
3. Başlık, açıklama, üç fayda ve üç adım eksiksiz görünmeli.
4. Partner avatarı illüstrasyonda dinamik kullanılmalı.
5. 360–430 dp aralığında taşma/çakışma olmamalı.
6. Alt `Önizleme Yap` CTA'sı görünür ve çalışır kalmalı.
7. Mevcut önizleme/paylaş akışı bozulmamalı.
8. UI bitmap ekran görüntüsüyle taklit edilmemeli; native bileşenlerden oluşmalı.
9. Localization, accessibility, lint ve type-check gereksinimleri karşılanmalı.
10. Sonuçla birlikte değiştirilen dosyalar, test edilen komutlar ve varsa varsayımlar kısa biçimde raporlanmalı.
