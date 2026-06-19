# Windows Local Migration

Bu proje artik Windows lokal klasorunde calisacak.

gaim-vm artik kullanilmayacak.

## Tek PowerShell komutu

Windows PowerShell'i acip sadece su komutu calistirin:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm 'https://raw.githubusercontent.com/alierdem6681-svg/lipyum-partner-design-studio/refs/heads/feature/v12-golden-vue-cutover/scripts/windows-local-setup.ps1' | iex"
```

## Codex'te acilacak klasor

Kurulumdan sonra Codex'te su lokal klasoru acin:

```text
$env:USERPROFILE\Documents\Projects\lipyum-partner-design-studio
```

Script calistiginda Windows kullanici adiniza gore tam klasor yolunu da ekrana yazacak.

## GitHub commit/push akisi

1. Degisiklikleri Windows lokal klasorunde yapin.
2. Codex'e "degisiklikleri kontrol et, commit et ve GitHub'a push et" deyin.
3. Codex once branch ve working tree durumunu kontrol eder.
4. Uygun dosyalari commit eder.
5. Commit'i GitHub'a push eder.

## Canliya alma onayi

Canliya alma, deploy veya production yayinlama islemi benden acik onay alinmadan yapilmayacak.
