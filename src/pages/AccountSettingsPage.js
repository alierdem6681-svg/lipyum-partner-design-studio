import { Button } from "../components/Button.js";
import { Card } from "../components/Card.js";
import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";

export function AccountSettingsPage() {
  return PageContainer({
    className: "account-settings-page",
    children: `
      ${Header({
        title: "Hesap ve Güvenlik",
        subtitle: "Güvenlik ve hesap durumunu yönet",
      })}
      ${Card({
        className: "account-status-card",
        ariaLabel: "Hesap durumu",
        children: `
          <div class="account-status-head">
            <span>
              <strong>Hesap Durumu</strong>
              <small>Aktif partner hesabı</small>
            </span>
            <em>Aktif</em>
          </div>
          <p>Bu alandaki işlemler canlı işlem yapmaz; üretimde çok aşamalı onay ve güvenlik kontrolü ile bağlanacak.</p>
          <div class="account-soft-actions">
            ${Button({ label: "Hesabı Geçici Dondur", variant: "ghost", action: "profile-freeze", extraClass: "profile-soft-danger" })}
            ${Button({ label: "Hesabı Sil", variant: "ghost", action: "profile-delete", extraClass: "profile-soft-danger is-delete" })}
          </div>
        `,
      })}
    `,
  });
}
