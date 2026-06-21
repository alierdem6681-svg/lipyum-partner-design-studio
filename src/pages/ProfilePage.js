import { Header } from "../components/Header.js";
import { MenuList } from "../components/MenuList.js";
import { PageContainer } from "../components/PageContainer.js";
import { ProfileMenuGrid } from "../components/ProfileMenuGrid.js";
import { renderProfileCard } from "../components/ProfileCard.js";
import { partnerProfile, profileSettingsItems } from "../data/mockData.js";
import { PROFILE_MENU_ITEMS } from "../utils/constants.js";

const icon = (name) => `<svg class="icon"><use href="#i-${name}"></use></svg>`;

export function ProfilePage({ badgesExpanded = false } = {}) {
  return PageContainer({
    className: "profile-page profile-screen",
    children: `
      ${Header({
        title: "Profilim",
        subtitle: "Profil ve hesap ayarların",
        showBack: true,
        backIcon: icon("chevron-left"),
      })}
      ${renderProfileCard({
        ...partnerProfile,
        badgesExpanded,
        icon,
      })}
      ${ProfileMenuGrid({
        items: PROFILE_MENU_ITEMS,
        icon,
      })}
      ${MenuList({
        title: "Hesap ve Profil Ayarları",
        items: profileSettingsItems,
        icon,
      })}
    `,
  });
}
