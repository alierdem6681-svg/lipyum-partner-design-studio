# Codex Workflow Protocol

Bu dosya, `lipyum-partner-design-studio` projesi icin kalici Codex calisma protokolunu tanimlar.

## Proje Modu

- Proje sadece Windows lokal klasorunde calistirilir:
  `C:\Users\DENİZKAN\OneDrive\Belgeler\Projects\lipyum-partner-design-studio`
- `gaim-vm`, SSH, uzak VM veya remote calisma ortami kullanilmaz.
- Terminal komutu gerekiyorsa mumkun oldugunca Codex calistirir. Kullaniciya sadece zorunlu durumlarda manuel komut verilir.

## Gelistirme Oncesi Kontrol ve Yedek

Her gelistirme isleminden once asagidaki adimlar uygulanir:

1. Git durumu kontrol edilir.
2. Mevcut branch kaydedilir.
3. Mevcut commit hash bilgisi kaydedilir.
4. Mumkunse timestamp iceren bir git tag olusturulur.
5. Gerekirse ek olarak lokal backup branch olusturulur.
6. Yedek adi sonuc raporunda mutlaka belirtilir.

Yedek ad formati:

```text
backup/YYYYMMDD-HHMMSS-kisa-aciklama
```

Ornek:

```text
backup/20260619-100235-workflow-protokol
```

## Gelistirme Akisi

Her gelistirmede kullanicidan ayrica onay beklenmez.

Codex asagidaki akisi uygular:

1. Degisiklikleri uygular.
2. Uygun `check`, `test` ve `build` kontrollerini calistirir.
3. Kontroller basariliysa degisiklikleri commit eder.
4. GitHub'a push eder.
5. Deploy/canliya alma yontemi mevcutsa otomatik deploy eder.
6. Deploy basarisiz olursa hatayi raporlar ve sistemi bozmadan birakir.

## Gelistirme Sonrasi Rapor

Her gelistirme sonunda kisa sonuc raporu verilir:

- Yapilan is
- Degisen dosyalar
- Calistirilan test/check/build komutlari
- Commit hash
- Push durumu
- Deploy/canli durumu
- Gelistirme oncesi alinan yedek adi
- Geri donus komutu

## Commit, Push ve Deploy

- Commit, push ve deploy islemleri icin bu protokol kapsaminda ayrica onay beklenmez.
- Push hedefi mevcut GitHub remote ayarlaridir.
- Deploy yontemi repoda veya bagli servislerde belirlenebiliyorsa otomatik uygulanir.
- Deploy icin gerekli arac, token veya servis baglantisi yoksa bu durum raporlanir.

## Geri Donus Sistemi

Kullanici `son yedege don` derse veya belirli bir yedek adi verirse geri donus islemi uygulanir.

Geri donus akisi:

1. Mevcut durumun ayrica yedegi alinir.
2. Istenen backup tag veya backup branch bulunur.
3. Proje istenen yedek durumuna dondurulur.
4. Gerekirse force push uygulanir.
5. Gerekirse deploy/canliya alma tekrar uygulanir.
6. Islem sonunda geri donulen yedek adi raporlanir.

Geri donus komutu formati:

```text
son yedege don
```

veya:

```text
backup/YYYYMMDD-HHMMSS-kisa-aciklama yedegine don
```
