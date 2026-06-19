# Tamamlanmamis Arayuz Gorevleri

Kaynak: Son 500 Lipyum talimati, aktif hash route taramasi, Playwright kontrolleri ve kaynak kod incelemesi.

Kriter: Tamamlandigi aktif ekranda net gorunmeyen, placeholder kalan, butonu olup akisi olmayan veya is kurali eksik olan arayuz/ekran davranislari listelenmistir.

1. Dogrudan `/profile` adresi acildiginda profil sayfasi yerine ana sayfa aciliyor.
2. Dogrudan `/leaderboard` adresi acildiginda liderlik tablosu yerine ana sayfa aciliyor.
3. Dogrudan `/reviews` adresi acildiginda yorumlar sayfasi yerine ana sayfa aciliyor.
4. Dogrudan `/wallet` adresi acildiginda cuzdan sayfasi yerine ana sayfa aciliyor.
5. Dogrudan `/support/customer-service` adresi acildiginda musteri hizmetleri sayfasi yerine ana sayfa aciliyor.
6. Sayfa yenilendiginde aktif sayfa korunmuyor ve uygulama ana sayfaya donuyor.
7. Route sistemi hash ve normal path davranisini tutarli yonetmiyor.
8. Geri tusu bazi durumlarda onceki ekrana degil genel ana akis mantigina donuyor.
9. Uygulama ilk acilista bazi route'larda kisa sure bos ekran yakalatiyor.
10. Alt menudeki orta CTA etiketi `Is Al` ve rozet degeri ayni baselineda durmuyor.
11. Alt menudeki `Is Al 3` etiketi tek parca ve dengeli okunur gorunmuyor.
12. Alt menunun iPhone 15 safe-area boslugu gercek cihazda kanitlanmis sekilde kapanmamis.
13. Ust status alaninda tek aktif durum yerine birden fazla durum karti ayni anda gorunuyor.
14. Ust status alaninda aktif, pasif, bakiye yok, hesap askida ve duraklatilmis durumlari ayni ekrani kalabaliklastiriyor.
15. Ust durum alaninda kullanicinin o anki tek calisma durumu net secilmiyor.
16. Pull-to-refresh yalnizca metin gosteriyor; aktif sayfa verisini yeniledigi kanitlanmiyor.
17. Pull-to-refresh subpage'lerde de gorunuyor ama her ekranda anlamli sonuc uretmiyor.
18. Ana sayfa basligi `Bolgemdeki Isler` degil, hala `Bolgendeki Isler` olarak gorunuyor.
19. Bolge aktivite yazilari 5 saniye yerine yaklasik 3.6 saniyede degisiyor.
20. Bolgedeki isler alani uc bildirimi pano gibi tek tek yukari kaydirarak gostermiyor.
21. Bolgedeki isler alani sadece tek hareket metni gosteriyor.
22. Bolgedeki isler alani eski bolge basligi ile yeni talimat arasinda tutarsiz kaliyor.
23. Ana sayfada `Direct Job`, `Pool Job` ve `Offer` haklari ayri kartlar halinde gorunmuyor.
24. Ana sayfada haftalik ucretsiz haklar net `Kalan X / Hafta` formatinda toplanmamis.
25. Ana sayfada ucretsiz hesap aciklamasi paket haklariyla birlikte net gorunmuyor.
26. Ana sayfada `Musteriyi Ara` en guclu CTA olarak one cikarilmiyor.
27. Ana sayfada yeni is gelince ne olacagi senaryo kartlariyla anlatilmiyor.
28. Ana sayfada is alimi kapaliysa nedeni ve acma aksiyonu tek alanda netlesmiyor.
29. Ana sayfada performans karti `Nedir?` aksiyonunun gercek aciklama modalina gittigi kanitlanmiyor.
30. Performans skoru sayfasi gercek icerik yerine placeholder olarak kaliyor.
31. Performans skoru sayfasinda skor detaylari, puan nedenleri ve artirma aksiyonlari yok.
32. Performans skorundaki `Skorumu Artir` aksiyonu detayli gorev akisi acmiyor.
33. Cuzdan sayfasinda baslik iki kez `Cuzdan` olarak tekrar ediyor.
34. Cuzdan sayfasinda bakiye yukleme ve krediye cevir aksiyonlari iki farkli yerde tekrar ediyor.
35. Cuzdan sayfasinda uzun hareket listesi hala `Daha Fazla Hareket Goster` butonuna bagli.
36. Cuzdan hareketleri sonsuz kaydirma seklinde calismiyor.
37. Cuzdan ve bonus kartlarinda 6 haneli degerlerle tasma testi gorunmuyor.
38. Bonus sayfasinda `240 kredi bonus` metni kredi ve bonus kavramlarini karistiriyor.
39. Bonus krediye cevirme aksiyonu gercek donusum akisi acmiyor.
40. Bonus sayfasinda bonusun kredi yuklerken kullanilma kurali yeterince islemsel anlatilmiyor.
41. Odul merkezi alani kapali olmasina ragmen kullaniciya teknik bayrak metni gibi gorunuyor.
42. Profil kartinda `Paylas` metni hala aktif ekranda gorunuyor.
43. Profil kartinda yalnizca kompakt `Onizle` aksiyonu kalmamis.
44. Profil kartindaki `Onizle` butonu isim-soyisim hizasinda sag ustte durmuyor.
45. Profil karti ile sidebar kisi karti ayni gorsel yapiyi kullanmiyor.
46. Sidebar kisi karti profil fotografi yerine bas harfleri gosteriyor.
47. Sidebar kisi kartinda profil kartindaki fotograf yukleme davranisi yok.
48. Sidebar kisi kartinda profil kartindaki onizleme aksiyonu yok.
49. Sidebar kisi kartinda profil kartindaki paylasim/onizleme kuraliyla ayni davranis yok.
50. Profil kartindaki `+2` rozetleri acildiktan sonra tekrar kapatilamiyor.
51. Sidebar kartindaki `+2` rozetleri acildiktan sonra tekrar kapatilamiyor.
52. Profil karti ile sidebar rozet acma davranisi birbirinden farkli.
53. Profil kartinda `Gold Partner` ifadesi genel kartta hala eski sekilde gorunuyor.
54. Profil kartinda `Lipyum Partner` vurgusu motivasyon yaratacak sekilde guclendirilmemis.
55. Profil fotografi yukleme butonu gercek dosya yukleme akisi acmiyor.
56. Profildeki `Musteri Profilimi Onizle` butonu gercek onizleme sayfasina gecmiyor.
57. `Musteri Profilimi Onizle` butonu sadece toast mesaji gosteriyor.
58. Profil tamamlama alani tiklaninca tamamlanan ve eksik gorevler acilip kapanmiyor.
59. Profil tamamlama alani tek basina ortalanmis `82` degeri olarak sade kalmamis.
60. Profil guclendirme karti gorev listesiyle eski yogun tasarimi koruyor.
61. Profil sayfasinda `Profilini Guclendir` karti referans tasarima birebir yaklasmamis.
62. Profil sayfasindaki `Hakkimda` sayfasi placeholder olarak kaliyor.
63. Profil sayfasindaki `Fotograflarim` sayfasi placeholder olarak kaliyor.
64. Profil sayfasindaki `Ekibim` sayfasi placeholder olarak kaliyor.
65. Profil sayfasindaki `Stratejim` sayfasi placeholder olarak kaliyor.
66. Profil sayfasindaki `Iletisim Bilgileri` sayfasi placeholder olarak kaliyor.
67. Profil sayfasindaki `Bildirim Ayarlari` sayfasi placeholder olarak kaliyor.
68. Hesap ve Guvenlik sayfasinda dondurma ve silme aksiyonlari hala buton gibi gorunuyor.
69. Hesap dondurma aksiyonu guvenli onay akisi acmiyor.
70. Hesap silme aksiyonu yalnizca toast mesajina bagli kaliyor.
71. Partner onizleme sayfasi tam ekran profil onizlemesi olarak acilmiyor.
72. Partner onizleme sayfasinda alt menu hala gorunuyor.
73. Partner onizleme sayfasinda normal sayfa basligi hala gorunuyor.
74. Partner onizleme sayfasinda kapatma `X` butonu yok.
75. Partner onizleme sayfasinda paylas aksiyonu yok.
76. Partner onizleme sayfasinda `+2` dahil tum rozetler gosterilmiyor.
77. Partner onizleme sayfasinda `Lipyum Gold Partner` yerine `Gold Partner` yaziyor.
78. Partner onizleme sayfasinda embed kodu bolumu onizleme deneyimini kalabaliklastiriyor.
79. Partner onizleme sayfasinda profil linki kopyalama bolumu onizlemeye mahsus sade akisi bozuyor.
80. Partner onizleme sayfasi musteriye gorunen profil referansina benzemiyor.
81. Partner onizleme sayfasi diger partnerleri heveslendirecek guclu `Lipyum Partner` vurgusunu tasimiyor.
82. Partner onizleme karti sosyal medya ve web rozeti gibi kalmis, tam musteri profili gibi calismiyor.
83. Partner paylasim panelinde WhatsApp paylasimi yalnizca mock mesaj olarak kaliyor.
84. Partner profil linki kopyalama aksiyonu gercek basari durumunu ekranda kalici gostermiyor.
85. Bildirimler sayfasinda `Bildirimler` basligi iki kez tekrar ediyor.
86. Bildirim ayarlari sayfasi gercek ayar ekrani yerine placeholder olarak kaliyor.
87. Bildirimlerde okunmus ve okunmamis durumlar ayri ikonlarla anlatilmiyor.
88. Bildirim kartlarinda tek tek silme aksiyonu gorunmuyor.
89. Bildirim kartlarinda tek tek okundu yapma aksiyonu gorunmuyor.
90. Bildirim listesinde yeni ve eski bildirimleri sonsuz kaydirma ile yukleme net gorunmuyor.
91. Bildirim sayfasindaki uc nokta/ayar aksiyonu istenen bildirim menu deneyimini tam vermiyor.
92. Bildirim seceneklerinde okunanlari goster, tumunu sil ve ayarlar sirasinin aktif ekranda net kaniti yok.
93. Okundu yap onayi acikken sayfa degistirildiginde modal baska ekranin ustunde kalabiliyor.
94. Bildirimlerde `Bakiye Yukle` CTA'si bildirim satiri icinde ayrik aksiyon gibi calismiyor.
95. Bildirimlerde en yeni bildirimlerin yukaridan geldigine dair siralama etiketi yok.
96. Bildirimlerde read/unread ikonlari olmadigi icin okundu durumu sadece filtreye bagli kaliyor.
97. Yorumlarda yanitlanmis yorumlarda `Bildir` butonu hala gorunuyor.
98. Yorum bildir aksiyonu otomatik bildirim gondermiyor, sorun formu aciyor.
99. Yorum bildir aksiyonu bildirimin alindigini aninda netlestirmiyor.
100. Yorum yanit modalinda musteri yorumu tekrar gosteriliyor.
101. Yorum yanit modalinda sadece cevap alaniyla sade bir akis yok.
102. Yorum listesinde `Daha Fazla Yorum Goster` butonu hala duruyor.
103. Yorum listesi tamamen sonsuz kaydirma ile calismiyor.
104. Yorumlarda rapor butonu tarih ile ayni satirda olsa da yanitlanmis yorumlarda gizlenmiyor.
105. Yorumlarda `+18 yeni yorum` alaninin farkli ekran genisliklerinde tasma kaniti yok.
106. Yorumlardaki memnuniyet grafigi daha etkileyici yeni grafik olarak tamamlanmamis gorunuyor.
107. Yorumlarda bildir butonu otomatik gonderim yerine genel sorun kategorilerine yonlendiriyor.
108. Yorumlarda bildirilen yorum icin ozel yorum raporlama durumu tutulmuyor.
109. Yorum yaniti gonderildikten sonra kart uzerinde guncel yanit durumu degismiyor.
110. Yorum filtreleri var ama filtre secimi sonrasinda sayfa durumu ve liste sayisi kalici gorunmuyor.
111. Liderlik tablosunda sektor ve sehir iki ayri select olarak ayni anda gorunuyor.
112. Liderlik tablosunda sektor ve sehir secimi ayni anda yapilamayacak sekilde tasarlanmamis.
113. Liderlikte sehir secilince sektor select gorunur degeri temizlenmiyor.
114. Liderlikte sektor secilince sehir select degeri ve sehir modu net temizlenmiyor.
115. Liderlikte sehir seciminden sonra sektor select varsayilan `Beyaz Esya Tamiri` degerine donuyor.
116. Liderlikte `Sektor Ligi` ve `Sehir Ligi` alanlari birbirini dislayan tek kontrol gibi calismiyor.
117. Liderlikte aktif lig tipi kullaniciya tek ve net bir sekilde gosterilmiyor.
118. Liderlikte `Haftanin vitrini` metni hala `Haftanin En Iyileri` alaninin ustunde gorunuyor.
119. Liderlikte haftanin en iyileri basligi ve rozet metni tekrarli hissediliyor.
120. Liderlikte `S Sen` satiri kendini tekrar eden bir kendi-kullanici etiketi gibi gorunuyor.
121. Liderlikte sadece iki ust ve iki alt rakip gosterme kurali tam uygulanmamis.
122. Liderlikte nearby karti hala 5 satirlik rakip listesi gosteriyor.
123. Liderlikte kutlama sahnesi istenen kadar gorsel ve gururlandirici degil.
124. Liderlikte oduller alani hala `Oduller` basligi ve kazanilacak oduller metniyle klasik kart gibi duruyor.
125. Liderlikte alt bosluk ve alt kart kapanisi yeniden kontrol edilmemis.
126. Liderlikte sektor degisimi sayfadaki metrikleri gercekten degistirmiyor.
127. Liderlikte sehir degisimi rakip listesini gercekten degistirmiyor.
128. Liderlikte `Daha cok is al, siralamada yuksel` alani tam genislik ve ana motivasyon alani gibi calismiyor.
129. Liderlikte odul rozetleri tiklanabilir detay akisi acmiyor.
130. Is Al ekraninda ana secim `Talep Olustur` olarak konumlanmamis.
131. Is Al ekraninda dogrudan is senaryosu ayri kart olarak gorunmuyor.
132. Is Al ekraninda havuz isi ve teklif isi disinda direkt is akisi yok.
133. Is Al ekraninda ucretsiz kullanicinin havuz/teklif/cancel kisitlari gorunmuyor.
134. Is Al ekraninda kalan direkt is, havuz isi ve teklif haklari gorunmuyor.
135. Is Al ekraninda haftalik hak kullanimi net bir sayacla gosterilmiyor.
136. Is Al ekraninda paket hakki bitince ne olacagi acik anlatilmiyor.
137. Is Al ekraninda havuzdan alma aksiyonu gercek onay akisi acmiyor.
138. Is Al ekraninda teklif verme akisi teklif formuna donusmuyor.
139. Is Al ekraninda `Havuz nedir?` bilgisi var ama havuz kural detaylari is akisini baglamiyor.
140. Islerim ekraninda sadece tek yeni is karti var; aktif, teklif, tamamlanan ve sorunlu sekmelerinin icerigi yok.
141. Islerim ekraninda sekme degisimleri liste icerigini anlamli sekilde degistirmiyor.
142. Islerim ekraninda `Musteriyi Ara` gercek arama niyeti ve izin akisi acmiyor.
143. Islerim ekraninda `Sorun Bildir` is kartina ozel takip numarasiyla acilmiyor.
144. Islerim ekraninda sorun bildirme akisi yorum bildirme akisiyle karisabiliyor.
145. Islerim ekraninda iade guvencesi metni var ama iade durum takibi yok.
146. Takvim ekraninda tarih/gun secimi bulunmuyor.
147. Takvim ekraninda randevu detayina girme akisi yok.
148. Takvim ekraninda randevu linki paylasma aksiyonu gercek paylasim akisi acmiyor.
149. Takvim ekraninda QR goster aksiyonu gercek QR modalina bagli oldugu kanitlanmiyor.
150. Takvim ekraninda calisan musaitligi duzenleme akisi yok.
151. Canli destek butonuna basildiktan sonra 5 saniye icinde sohbet arayuzu acilmiyor.
152. Canli destek sayfasi temsilciyle gercek sohbet penceresine gecmiyor.
153. Canli destek baslangicinda konu basligi ve not alanlari gonderim sonucuna baglanmiyor.
154. Destek ana sayfasinda arama kutusu gercek arama sonucu uretmiyor.
155. Destek ana sayfasindaki `?` isareti anlamli yardim modalina baglanmiyor.
156. Talep Olustur sayfasinda dosya veya ekran goruntusu ekleme aksiyonu gercek yukleme akisi acmiyor.
157. Talep Olustur sayfasinda talep gonderildikten sonra acik talep takip ekrani acilmiyor.
158. Talep Olustur sayfasinda kategori ve oncelik secimi sonuc ekraninda gorunur olmuyor.
159. Acik Taleplerim aksiyonu ayri takip listesine gitmiyor.
160. Musteri Hizmetleri sayfasinda telefon destegini acma butonu gercek abonelik kontrolu yapmiyor.
161. Musteri Hizmetleri sayfasinda ucretli kullanici arayabilir kuralinin aktif/pasif hali yok.
162. Musteri Hizmetleri sayfasinda telefon arama aksiyonu gercek call intent davranisi gostermiyor.
163. Paketler sayfasi hala emoji agirlikli eski paket vitrini gibi duruyor.
164. Paketler sayfasi Gold, Pro ve VIP abonelik ekraninin premium kart yapisiyla uyumlu degil.
165. Paketler sayfasinda direkt is, havuz ve teklif haklari karsilastirmali gosterilmiyor.
166. Paketler sayfasinda paket kartlari yuksek donusumlu swipe deneyimi gibi calismiyor.
167. Abonelik sayfasinda Plus paketi yok, Gold paketi kullaniliyor.
168. Sidebar banneri Plus'a yonlendirirken abonelik sayfasi Gold, Pro ve VIP paketleri gosteriyor.
169. Abonelik sayfasinda `Ucretsiz`, `Plus`, `Pro`, `VIP` tab yapisi yok.
170. Abonelik sayfasinda paket haklari haftalik direkt is, havuz ve teklif olarak acik degil.
171. Abonelik sayfasinda `Gold'a Gec`, `Pro'a Gec`, `VIP'a Gec` butonlari hizli odeme akisi acmiyor.
172. Ucretli aboneligi iptal et aksiyonu gercek iptal onay akisi acmiyor.
173. Paket yukseltme akisi mevcut paket durumunu ve kullanicinin niye yukseltmesi gerektigini net gostermiyor.
174. Sidebar bannerinda kullanicinin mevcut paketi Gold ise Plus'a yonlendirme mantigi tutarsiz kalmis.
175. Bolge Hizmetleri sayfasinda bolge satirlari tiklanabilir ayar akisi acmiyor.
176. Hizmet Alanlari sayfasinda hizmet modlari tiklanabilir ac/kapat kontrolleri degil.
177. Calisma Plani sayfasinda saat alanlari gercek saat secici gibi calismiyor.
178. Kapasite sayfasinda secilen kapasite degeri kayit sonrasi ekranda kalici gorunmuyor.
179. Faturalarim sayfasinda `Son faturalar`, `Odeme belgeleri` ve `Fatura bilgileri` butonlari gercek icerik degistirmiyor.
180. Gelir Gider Takibi sayfasinda gelir, gider ve donem ozeti bolumleri gercek listeye baglanmiyor.
181. Partner Davet ekraninda `B B` gibi anlamsiz tekrar metinleri hala gorunuyor.
182. Partner Davet ekraninda telefon numarasi girme alani metinde anlatiliyor ama gorunur form deneyimi zayif kaliyor.
183. Partner Davet ekraninda davet gonderme sonrasinda WhatsApp davet onayi net bir akisla gorunmuyor.
184. Partner Davet ekraninda filtre kartlari tiklaninca tam listeye gecis davranisi net degil.
185. Referral earnings ekraninda kazanc kalemleri detay modalina aciliyor gibi gorunse de aktif detay kaniti yok.
186. Referral earnings ekraninda bekleyen ve kazanilan bonuslar filtrelenebilir degil.
187. Photo Gallery, About, Team ve Strategy sayfalari gercek profil duzenleme deneyimi yerine placeholder kaliyor.
188. Notification Settings ve Contact Settings sayfalari gercek ayar formlari yerine placeholder kaliyor.
189. Services, Regions, Working Hours ve Capacity sayfalari profil kartindan aciliyor ama tumu gercek kayitli ayar akisi gibi calismiyor.
190. Genel olarak cok sayida buton toast mesaji gosteriyor ama kullaniciyi tamamlanmis bir ekrana veya state degisimine tasimiyor.
