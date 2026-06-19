# Design Token Migration Map

V12 Golden Master çalışmasında tokenlar yeniden tasarlanmadı; mevcut V11 premium görünümde kullanılan değerler korunarak Vue/Tailwind tarafına taşınacak kaynak olarak işaretlendi.

| Legacy değer/class | Token | Tailwind karşılığı | Kullanıldığı alan |
| --- | --- | --- | --- |
| `#12b76a`, `#079455` | `--color-primary`, `--color-primary-dark` | `emerald` theme ailesi | Aktif durum, ana aksiyon, CTA |
| `#ecfdf3`, `#ecfdf5` | `--color-primary-soft` | `bg-emerald-50` | Soft başarı chipleri, aktif pill |
| `#175cd3` | `--color-info` | `blue` theme ailesi | Bilgi, bonus, nötr finansal aksiyon |
| `#f59e0b`, `#d99a0b` | `--color-warning` | `amber` theme ailesi | Uyarı, bakiye, ödül |
| `#d92d20`, `#f04438` | `--color-danger` | `red` theme ailesi | Tehlikeli işlem, hesap aksiyonları |
| `#101828`, `#0f172a` | `--text-primary`, `--color-neutral-900` | `slate-900` | Başlıklar ve ana metin |
| `#475467`, `#667085` | `--text-secondary`, `--text-muted` | `slate-600`, `slate-500` | Açıklamalar ve pasif bilgi |
| `#e5e7eb`, `#edf0f2` | `--color-border` | `border-slate-200` | Kart ve input border |
| `0 8px 20px rgba(16,24,40,.06)` | `--shadow-soft` | `shadow-soft` | Hafif kart gölgesi |
| `0 10px 24px rgba(0,122,61,.30)` | `--shadow-cta` | `shadow-cta` | Ana orta CTA |
| `16px` kart radius | `--radius-card` | `rounded-card` | Standart kart |
| `24px` sheet radius | `--radius-sheet` | `rounded-sheet` | Sheet/modal |
| `30px` bottom radius | `--radius-bottom-bar` | `rounded-bottom-bar` | Bottom bar |
| `58px` header + `58px` safe status | `--app-header-height`, `--simulator-status-height` | AppHeader tokenları | Header geometry |
| `92px` bottom safe | `--bottom-safe-height` | AppBottomBar tokenları | Bottom bar geometry |

## V12 Notu

Vue preview şu anda bu tokenları kullanıyor ancak `/home`, `/jobs`, `/my-jobs`, `/calendar` içerik ve görsel parity’si henüz geçmedi. Bu nedenle token map “cutover tamamlandı” anlamına gelmez; sadece Golden Master değerlerinin taşınacağı sözleşmedir.

