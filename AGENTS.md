# Calisma Kurallari

Kisa, net, cozum odakli ve resmi ol. Her gorev bitince kisa bir sonuc raporu ver; yapilan isleri herkesin net anlayacagi sekilde acikla.

## Iki Asamali Gelistirme Ve Yayin Kurali

1. Gorsel ve islevsel duzenlemeler once local ortamda yapilir ve kullanici local URL uzerinden kontrol eder.
2. Kullanici gun sonunda veya acikca "canliya al" dediginde tum onaylanmis gelistirmeler tek paket olarak release surecine alinir.
3. Canliya alma oncesinde mevcut format, lint, typecheck, unit test, integration test, end-to-end test, security check ve production build islemleri calistirilir.
4. Hicbir test atlanmaz, kapatilmaz veya basarisiz sonuc gormezden gelinmez.
5. Basarisiz olan kontrollerin nedeni incelenir, sorun duzeltilir, ilgili testler ve tum kalite kapilari tekrar calistirilir.
6. Tum onaylanmis degisiklikler birlikte basarili olmadan production deployment yapilmaz.
7. Butun kalite kapilari gectiginde tek bir production deployment yapilir.
8. Deployment sonrasinda smoke test, health check ve kritik route kontrolleri calistirilir.
9. Deployment sonrasi kritik hata varsa islem basarili sayilmaz.
10. Guvenli rollback mekanizmasi mevcutsa production sorunu durumunda rollback uygulanir.
11. Sonuc raporunda gecen kontroller, yapilan duzeltmeler, deployment durumu ve production URL kisa bicimde bildirilir.

## Gece Otomatik Production Release Kurali

1. Her gece saat 02:00'da localde kalan ve henuz production'a alinmamis onayli gelistirmeler icin production release sureci baslatilir.
2. Release oncesinde mevcut production main SHA icin siradaki versioned yedek alinir; yedekler v6, v7, v8 seklinde kullanilmamis ilk numarayla ilerler.
3. Yedek tag'i, archive branch'i ve release manifesti olusturulmadan merge veya deployment yapilmaz.
4. Format, lint, typecheck, unit test, integration test, end-to-end test, security check, production build, git diff check ve repo quality gate kontrolleri eksiksiz calistirilir.
5. Hata veren kontrollerin nedeni incelenir, sorun duzeltilir ve ilgili testlerle birlikte tum kalite kapilari tekrar calistirilir.
6. Tum kalite kapilari gecmeden production'a cikilmaz.
7. Basarili kontrollerden sonra tek bir production deployment yapilir.
8. Deployment sonrasi smoke test, health check, release SHA, kritik route, console error ve horizontal overflow kontrolleri yapilir.
9. Kritik production hatasi varsa release basarili sayilmaz; guvenli rollback varsa son yedekten rollback uygulanir.
