# V12-H Home Parity Report

Durum: BLOCKED

## Kanit

- Branch: `feature/v12-golden-vue-cutover`
- Checkpoint commit: `db9c978ff746492f066e3baabdc1087d6e692663`
- Golden screenshot: `tests/golden-master/v11-stable/vercel/393x852/home.png`
- Vue feature URL: `http://127.0.0.1:5173/#/home`
- Engine: default Vue, `?engine=legacy` kullanilmadi.
- Viewport: `393x852`
- Hedef diff: `<= 0.015`
- Mevcut Vue diff: `0.037619`
- Mevcut kabul edilen Vercel gorunumu stored baseline'a karsi: `0.031855`
- Console/page error: yok.

## Kok Neden

Stored Golden baseline, kullanicinin dogru kabul ettigi guncel Vercel/GitHub Pages arayuzuyle artik strict `0.015` seviyesinde eslesmiyor. Bu nedenle sadece Vue Home'u duzelterek PASS almak guvenilir degil; dogru kabul edilen canli UI bile stored baseline'a karsi `0.031855` ile fail oluyor.

Ek olarak stored baseline/canli eski gorunum bottom bar'da `Islerim` ve `Takvim` etiketlerini tasiyor. V12 urun karari ve testleri ise `Isler` ve `Randevu` etiketlerini zorunlu kiliyor. Vue tarafini eski etikete dondurmek urun kapsam kararini bozar.

## Yapilan Guvenli Denemeler

- Header/bottom bar legacy geometri siniflariyla hizalandi.
- Home stack gap degeri kucultuldu.
- Cuzdan/bonus ve bolge karti shadow degerleri daha dusuk diff uretecek sekilde ayarlandi.
- Syntax kontrolu tekrar gecti.

Bu denemeler diff'i azaltti ancak strict hedefi gecirmedi.

## Karar

V12-H Home visual parity PASS degildir. Golden baseline degistirilmeden, threshold yukseltmeden veya V12 urun kapsamini bozacak eski bottom label'lara donmeden bu adim tamamlandi sayilmamalidir.
