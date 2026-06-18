# V12 Release Report

Tarih: 18 Haziran 2026

## Durum

V12 Golden Master çalışması güvenli paralel preview aşamasındadır. Production/default boot değiştirilmedi. `src/app.js` yalnızca `?engine=vue` query parametresiyle Vue root preview açar; normal açılış V11 stable legacy runtime ile devam eder.

## Tamamlananlar

- `v11-stable` annotated tag ve `archive/v11-stable` branch oluşturuldu.
- Temiz `origin/main` stable preview korunarak ayrı `feature/v12-golden-vue-cutover` worktree oluşturuldu.
- V11 Golden Master screenshot seti üretildi: `tests/golden-master/v11-stable/`.
- Vercel ve temiz local stable için 16 route x 8 viewport screenshot baseline alındı.
- Vue Router ve Pinia feature preview mimarisine eklendi.
- `AppShell`, Vue `MobileLayout`, `HomePage`, `JobsPage`, `MyJobsPage`, `CalendarPage` ve compatibility bridge oluşturuldu.
- Vue preview telefon simulator frame ve `#appRoot` scroll konteynerine bağlandı.
- V12 architecture/core/compatibility/parity safety testleri eklendi.
- `V12_VISUAL_PARITY_REPORT.md` üretildi.

## Cutover Kararı

Cutover yapılmadı.

Neden:

- `/home`, `/jobs`, `/my-jobs`, `/calendar` için pixel parity FAIL.
- Aynı route’larda content parity FAIL.
- Aynı route’larda interaction label parity FAIL.
- Header ve bottom bar geometry artık eşleşiyor, ancak içerik/kart/action parity henüz yeterli değil.

## Test Sonuçları

- `npm run build`: geçti.
- `npm run test:v12-architecture`: geçti.
- `npm run test:v12-core`: geçti.
- `npm run test:v12-compatibility`: geçti.
- `npm run test:v12-parity`: güvenlik kapısı olarak geçti; parity farklarını raporladı ve default Vue cutover’ın kapalı olduğunu doğruladı.

## Bilinen P0 Farklar

- Vue `/home` Golden Master’daki tüm kart/ticker/aksiyon yoğunluğunu henüz birebir taşımıyor.
- Vue `/jobs`, `/my-jobs`, `/calendar` içerik metni ve aksiyon listesi Golden Master’dan daha kısa.
- Compatibility bridge sadece geçici gövde sağlar; diğer route’ların stable içerik parity’si V13 öncesinde tamamlanmalı.
- `legacyApp.js` production/default runtime olarak kalıyor; bu V12 güvenlik kararıdır, final cutover değildir.

## Sonraki Adım

Core dört route için Golden Master üzerinden birebir section/card/action taşıma yapılmalı. `V12_VISUAL_PARITY_REPORT.md` P0/P1 fark göstermeden `src/app.js` default Vue boot’a geçirilmemelidir.

