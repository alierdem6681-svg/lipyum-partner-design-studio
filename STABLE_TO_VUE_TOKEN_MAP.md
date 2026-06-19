# Stable To Vue Token Map

Date: 2026-06-19

This map defines which stable legacy tokens/classes Vue preview must preserve for V12-K.

| Stable source | Value / role | Vue preview mapping | Validation |
| --- | --- | --- | --- |
| `--page-x-padding` | `12px` mobile content gutter | `.v-shell__content`, `.v-bottom`, stable profile cards | Header/bottom/profile specs |
| `--app-header-action-size` | `44px` touch target | `.v-header__action`, legacy `.icon-btn` test ids | Header spec |
| `--app-header-gap` | `8px` header grid gap | `.v-header`, legacy `.app-header`/`.page-header` | Header spec |
| `--header-height` / `--app-header-height` | `58px` base header height | `.v-header` shell min-height plus top safe space | Header spec |
| `.app-header` home grid | `44px minmax(0, 1fr) 94px` | `.v-header[data-header-variant='home']` | Header spec |
| `.page-header` subpage grid | `44px minmax(0, 1fr) 44px` measured as `44px 265px 44px` at 393px | `.v-header[data-header-variant='subpage']` | Header spec |
| `.bottom-nav` | Absolute 5-column nav, 92px high | `<AppBottomBar>` keeps `v-bottom bottom-nav` | Bottom bar spec |
| `.bottom-item` | Standard nav item, 56px min height | `<AppBottomBar>` keeps `v-bottom__item bottom-item` | Bottom bar spec |
| `.bottom-item.featured` | 76px CTA item cell | `<AppBottomBar>` keeps `featured cta-fab` | Bottom bar spec |
| `.cta-lightning-wrap` | Visible CTA circle, 62px home and 58px subpage | Same class in Vue preview | Bottom bar spec |
| `.bottom-badge` | 22px notification badge | Same class in Vue preview | Bottom bar spec |
| `.partner-menu` | Drawer shell, `min(92vw, 388px)`, 10px padding | `<AppDrawer>` keeps `sheet partner-menu` | Drawer spec |
| `.drawer-profile-card` | Drawer identity card, 190px min-height | `<DrawerProfileCard>` keeps class | Drawer spec |
| `.drawer-work-status-card` | Drawer status card, 48px measured height | `<DrawerProfileCard>` keeps class | Drawer spec |
| `.drawer-menu-card` | Stable menu grouped card | `<DrawerMenuCard>` keeps class | Drawer spec |
| `.drawer-menu-item` | Stable row: `34px minmax(0, 1fr) 18px` | `<DrawerMenuCard>` keeps class | Drawer spec |
| `.v-drawer-menu__item` | Generic Vue drawer row | Must not appear on stable drawer | Drawer spec |
| `.partner-profile-card` | Profile identity card, 16px padding, 18px radius | `<PartnerProfileCard>` keeps class | Profile spec |
| `.partner-profile-avatar-btn` | 76px square avatar, 5px radius | Same class in Vue preview | Profile spec |
| `.partner-profile-chip` | 28px badge, 44px more-button touch target | Same class in Vue preview | Profile spec |
| `.profile-strength-card` | Strength card, 14px padding, 22px radius | `<ProfileStrengthCard>` keeps class | Profile spec |
| `.score-ring` | 98px circular score | Same class in Vue preview | Profile spec |
| `.checklist-item` | 40px checklist row | Same class in Vue preview | Profile spec |
| `.profile-menu-grid` | 4 columns x 2 rows at 393px, 8px gap | `<ProfileMenuGrid>` keeps class | Profile spec |
| `.profile-menu-card` | 81.25px x 92px at 393px | Same class in Vue preview | Profile spec |
| `.v-route-hero`, `.v-profile-card`, `.v-profile-strength-card`, `.v-profile-menu` | Generic Vue profile route presentation | Must not replace stable profile surface | Profile spec |

## Notes

- The contract validates geometry, stable class usage and the profile shortcut labels covered by `tests/e2e/stable-vue-shell-parity.spec.js`.
- Vue profile shortcut labels now use the full stable labels.
- New screenshot baselines should only be added after product approval; V12-K uses deterministic DOM/CSS assertions.
