# V10 Quality Automation

This document is verified by `tests/e2e/v10-quality-automation.spec.js`.

Covered V10 additions:
- Clickable inventory report
- Visual QA report
- Header consistency smoke
- Touch target smoke
- Text overflow smoke
- Modal, sheet and drawer smoke
- Partner public badge preview route

Status: automation files are present and the partner card preview route renders.

## V11 Superset

V11 ile kalite otomasyonu genişletildi:

- CTA sis efektinin gecikmeli/reduced-motion davranışı.
- Bildirimler header ayar aksiyonu.
- Profil 4x2 grid geometri testi.
- Route metadata ve legacy migration audit.

Bu kontroller `npm run test:quality-gate` ve `npm run test:quality-gate:v11` içine dahil edildi.
