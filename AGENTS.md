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
