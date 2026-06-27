<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();

const teams = ref([
  {
    id: "klima",
    name: "Klima Ekibi",
    workingHours: "09:00 - 18:00",
    members: [
      {
        id: "ahmet",
        firstName: "Ahmet",
        lastName: "Yılmaz",
        phone: "0532 000 00 00",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80",
        active: true,
      },
      { id: "merve", firstName: "Merve", lastName: "Kaya", phone: "0544 111 22 33", photoUrl: "", active: false },
      {
        id: "can",
        firstName: "Can",
        lastName: "Demir",
        phone: "0555 222 33 44",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80",
        active: false,
      },
    ],
  },
  {
    id: "kombi",
    name: "Kombi Ekibi",
    workingHours: "10:00 - 19:00",
    members: [
      { id: "elif", firstName: "Elif", lastName: "Durmaz", phone: "0533 444 55 66", photoUrl: "", active: true },
      { id: "murat", firstName: "Murat", lastName: "Koç", phone: "0541 777 88 99", photoUrl: "", active: true },
    ],
  },
]);

const activeTeamId = ref("klima");
const saveState = ref("idle");
const editingTeamName = ref(false);
const memberDraft = reactive({
  firstName: "",
  lastName: "",
  phone: "",
  photoUrl: "",
});

const activeTeam = computed(() => teams.value.find((team) => team.id === activeTeamId.value) || teams.value[0]);
const teamCount = computed(() => teams.value.length);
const totalMembers = computed(() => teams.value.reduce((total, team) => total + team.members.length, 0));
const activeTodayCount = computed(() => teams.value.reduce((total, team) => total + team.members.filter((member) => member.active).length, 0));
const hasWorkingHours = computed(() => teams.value.every((team) => Boolean(team.workingHours)));

function selectTeam(teamId) {
  activeTeamId.value = teamId;
  editingTeamName.value = false;
}

function addTeam() {
  const nextIndex = teams.value.length + 1;
  const team = {
    id: `ekip-${Date.now()}`,
    name: `Yeni Ekip ${nextIndex}`,
    workingHours: "09:00 - 18:00",
    members: [],
  };
  teams.value = [...teams.value, team];
  activeTeamId.value = team.id;
  editingTeamName.value = true;
  shell.showToast("Yeni ekip eklendi.");
}

function decreaseTeamCount() {
  if (teams.value.length <= 1) return;
  const removed = teams.value[teams.value.length - 1];
  teams.value = teams.value.slice(0, -1);
  if (activeTeamId.value === removed.id) activeTeamId.value = teams.value[0].id;
  shell.showToast("Son ekip kaldırıldı.");
}

function increaseTeamCount() {
  addTeam();
}

function toggleTeamNameEdit() {
  editingTeamName.value = !editingTeamName.value;
}

function updateActiveTeamName(event) {
  activeTeam.value.name = event.target.value;
}

function openWorkingHours() {
  shell.showToast("Ekip çalışma saatleri düzenleme akışı açılacak.");
}

function resetMemberDraft() {
  memberDraft.firstName = "";
  memberDraft.lastName = "";
  memberDraft.phone = "";
  memberDraft.photoUrl = "";
}

function addMember() {
  const firstName = memberDraft.firstName.trim();
  const lastName = memberDraft.lastName.trim();
  const phone = memberDraft.phone.trim();
  if (!firstName || !lastName || !phone) {
    shell.showToast("İsim, soyisim ve telefon bilgisi gerekli.");
    return;
  }

  activeTeam.value.members = [
    ...activeTeam.value.members,
    {
      id: `member-${Date.now()}`,
      firstName,
      lastName,
      phone,
      photoUrl: memberDraft.photoUrl,
      active: false,
    },
  ];
  resetMemberDraft();
  shell.showToast("Ekip üyesi eklendi.");
}

function editMember(member) {
  memberDraft.firstName = member.firstName;
  memberDraft.lastName = member.lastName;
  memberDraft.phone = member.phone;
  memberDraft.photoUrl = member.photoUrl;
  shell.showToast(`${member.firstName} bilgileri forma alındı.`);
}

function removeMember(memberId) {
  activeTeam.value.members = activeTeam.value.members.filter((member) => member.id !== memberId);
  shell.showToast("Ekip üyesi kaldırıldı.");
}

function setPhotoPlaceholder() {
  memberDraft.photoUrl = "pending";
  shell.showToast("Fotoğraf seçimi mock olarak işaretlendi.");
}

function saveTeams() {
  saveState.value = "saved";
  shell.showToast("Ekip bilgileri kaydedildi.");
  window.setTimeout(() => {
    saveState.value = "idle";
  }, 1800);
}

function handleHeaderAdd() {
  addTeam();
}

onMounted(() => {
  window.addEventListener("lipyum:team-add", handleHeaderAdd);
});

onUnmounted(() => {
  window.removeEventListener("lipyum:team-add", handleHeaderAdd);
});
</script>

<template>
  <AppPage title="Ekibim" data-testid="profile-team-page">
    <div class="profile-team-page">
      <section class="profile-team-summary" aria-labelledby="team-summary-title">
        <span class="profile-team-summary__icon" aria-hidden="true">
          <AppIcon name="users" :size="38" />
        </span>
        <div class="profile-team-summary__copy">
          <h2 id="team-summary-title">{{ teamCount }} ekip · {{ totalMembers }} kişi</h2>
          <p>Bugün <strong>{{ activeTodayCount }} kişi</strong> aktif çalışıyor</p>
          <span v-if="hasWorkingHours" class="profile-team-status-chip">
            <AppIcon name="check" :size="15" />
            Çalışma saatleri tanımlı
          </span>
        </div>
      </section>

      <section class="profile-team-stepper-card" aria-labelledby="team-count-title">
        <div>
          <h2 id="team-count-title">Kaç ekibin var?</h2>
          <p>Ekip sayısını istediğin zaman değiştirebilirsin.</p>
        </div>
        <div class="profile-team-stepper" aria-label="Ekip sayısı">
          <button type="button" aria-label="Ekip sayısını azalt" @click="decreaseTeamCount">
            <AppIcon name="minus" :size="18" />
          </button>
          <output>{{ teamCount }}</output>
          <button type="button" aria-label="Ekip sayısını artır" @click="increaseTeamCount">
            <AppIcon name="plus" :size="18" />
          </button>
        </div>
      </section>

      <section class="profile-team-tabs" aria-label="Ekip seçimi">
        <button
          v-for="team in teams"
          :key="team.id"
          class="profile-team-tab"
          type="button"
          :aria-pressed="activeTeamId === team.id"
          @click="selectTeam(team.id)"
        >
          <AppIcon name="users" :size="19" />
          <span>{{ team.name }}</span>
        </button>
        <button class="profile-team-tab profile-team-tab--add" type="button" @click="addTeam">
          <AppIcon name="plus" :size="18" />
          <span>Ekip</span>
        </button>
      </section>

      <section class="profile-team-card profile-team-settings" aria-labelledby="active-team-title">
        <div class="profile-team-section-head">
          <span class="profile-team-section-head__icon" aria-hidden="true">
            <AppIcon name="users" :size="20" />
          </span>
          <h2 id="active-team-title">{{ activeTeam.name }}</h2>
          <button type="button" aria-label="Ekip adını düzenle" @click="toggleTeamNameEdit">
            <AppIcon name="edit" :size="20" />
          </button>
        </div>

        <label class="profile-team-field">
          <span>Ekip adı</span>
          <input
            :value="activeTeam.name"
            :readonly="!editingTeamName"
            type="text"
            aria-label="Ekip adı"
            @input="updateActiveTeamName"
          />
          <button type="button" aria-label="Ekip adını düzenle" @click="toggleTeamNameEdit">
            <AppIcon name="edit" :size="18" />
          </button>
        </label>

        <button class="profile-team-hours-row" type="button" @click="openWorkingHours">
          <span aria-hidden="true">
            <AppIcon name="clock" :size="22" />
          </span>
          <span>
            <strong>Çalışma saatleri</strong>
            <small>{{ activeTeam.workingHours }}</small>
          </span>
          <AppIcon name="chevron-right" :size="20" />
        </button>
      </section>

      <section class="profile-team-card profile-team-members" aria-labelledby="team-members-title">
        <div class="profile-team-members__head">
          <h2 id="team-members-title">Ekip üyeleri</h2>
          <span>{{ activeTeam.members.length }} kişi</span>
        </div>
        <div class="profile-team-member-list" role="list">
          <article v-for="member in activeTeam.members" :key="member.id" class="profile-team-member" role="listitem">
            <span class="profile-team-member__avatar" aria-hidden="true">
              <img v-if="member.photoUrl" :src="member.photoUrl" alt="" />
              <AppIcon v-else name="camera" :size="24" />
            </span>
            <span class="profile-team-member__copy">
              <strong>{{ member.firstName }} {{ member.lastName }}</strong>
              <small>{{ member.phone }}</small>
            </span>
            <span v-if="member.active" class="profile-team-member__active">Aktif</span>
            <button type="button" aria-label="Üyeyi düzenle" @click="editMember(member)">
              <AppIcon name="edit" :size="18" />
            </button>
            <button class="profile-team-member__delete" type="button" aria-label="Üyeyi sil" @click="removeMember(member.id)">
              <AppIcon name="trash" :size="18" />
            </button>
          </article>
          <p v-if="!activeTeam.members.length" class="profile-team-empty" role="status">
            Bu ekipte henüz üye yok. İlk üyeyi ekleyerek başla.
          </p>
        </div>
      </section>

      <section class="profile-team-card profile-team-add-member" aria-labelledby="add-member-title">
        <h2 id="add-member-title">Yeni üye ekle</h2>
        <div class="profile-team-add-member__grid">
          <button class="profile-team-photo-drop" type="button" @click="setPhotoPlaceholder">
            <AppIcon name="camera" :size="25" />
            <span>{{ memberDraft.photoUrl ? "Fotoğraf seçildi" : "Fotoğraf ekle" }}</span>
          </button>
          <div class="profile-team-form-fields">
            <label class="profile-team-input">
              <AppIcon name="user" :size="18" />
              <input v-model="memberDraft.firstName" type="text" autocomplete="given-name" placeholder="İsim" aria-label="İsim" />
            </label>
            <label class="profile-team-input">
              <AppIcon name="user" :size="18" />
              <input v-model="memberDraft.lastName" type="text" autocomplete="family-name" placeholder="Soyisim" aria-label="Soyisim" />
            </label>
            <label class="profile-team-input">
              <AppIcon name="phone" :size="18" />
              <input v-model="memberDraft.phone" type="tel" autocomplete="tel" placeholder="Telefon numarası" aria-label="Telefon numarası" />
            </label>
          </div>
        </div>
        <button class="profile-team-primary-action" type="button" @click="addMember">
          <AppIcon name="user-plus" :size="22" />
          <span>Üyeyi ekle</span>
        </button>
      </section>

      <div class="profile-team-save-bar">
        <button class="profile-team-save-button" type="button" data-testid="team-save-button" @click="saveTeams">
          <AppIcon :name="saveState === 'saved' ? 'check' : 'users'" :size="18" />
          <span>{{ saveState === "saved" ? "Kaydedildi" : "Ekibi Kaydet" }}</span>
        </button>
      </div>
    </div>
  </AppPage>
</template>

<style scoped>
.profile-team-page {
  display: grid;
  gap: var(--space-4);
  padding-bottom: calc(90px + env(safe-area-inset-bottom, 0px));
}

.profile-team-summary,
.profile-team-stepper-card,
.profile-team-card {
  border: 1px solid color-mix(in srgb, var(--color-border) 88%, transparent);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.profile-team-summary {
  display: grid;
  grid-template-columns: 76px 1fr;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
}

.profile-team-summary__icon,
.profile-team-section-head__icon,
.profile-team-hours-row > span:first-child {
  display: inline-grid;
  place-items: center;
  color: var(--color-primary-dark);
  background: var(--color-primary-soft);
}

.profile-team-summary__icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
}

.profile-team-summary__copy h2,
.profile-team-stepper-card h2,
.profile-team-section-head h2,
.profile-team-members__head h2,
.profile-team-add-member h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-size-card-title);
  line-height: 1.2;
  font-weight: 850;
  letter-spacing: 0;
}

.profile-team-summary__copy p,
.profile-team-stepper-card p {
  margin: 5px 0 0;
  color: var(--text-muted);
  font-size: var(--font-size-small);
  line-height: 1.35;
  font-weight: 650;
}

.profile-team-summary__copy p strong {
  color: var(--color-primary-dark);
  font-weight: 850;
}

.profile-team-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  margin-top: 10px;
  padding: 0 12px;
  border: 1px solid color-mix(in srgb, var(--color-primary-dark) 28%, var(--color-border));
  border-radius: 999px;
  color: var(--color-primary-dark);
  background: var(--color-primary-soft);
  font-size: var(--font-size-caption);
  font-weight: 800;
}

.profile-team-stepper-card {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
}

.profile-team-stepper {
  display: grid;
  grid-template-columns: 44px 48px 44px;
  min-height: 44px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card-compact);
  background: var(--color-surface);
}

.profile-team-stepper button,
.profile-team-stepper output {
  display: inline-grid;
  place-items: center;
  border: 0;
  border-left: 1px solid var(--color-border);
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  font-size: var(--font-size-body-lg);
  font-weight: 850;
}

.profile-team-stepper button:first-child {
  border-left: 0;
}

.profile-team-stepper button {
  color: var(--color-primary-dark);
  cursor: pointer;
}

.profile-team-tabs {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  padding: 2px 0;
  scrollbar-width: none;
}

.profile-team-tabs::-webkit-scrollbar {
  display: none;
}

.profile-team-tab {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 52px;
  min-width: 132px;
  border: 1px solid color-mix(in srgb, var(--color-border) 88%, transparent);
  border-radius: var(--radius-card-compact);
  background: var(--color-surface);
  color: var(--text-primary);
  box-shadow: var(--shadow-soft);
  font-family: var(--font-family-base);
  font-size: var(--font-size-small);
  font-weight: 820;
  white-space: nowrap;
  cursor: pointer;
}

.profile-team-tab[aria-pressed="true"] {
  border-color: var(--color-primary-dark);
  color: var(--color-primary-dark);
  background: var(--color-primary-soft);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.profile-team-tab--add {
  border-style: dashed;
  color: var(--color-primary-dark);
}

.profile-team-card {
  padding: var(--space-4);
}

.profile-team-section-head,
.profile-team-members__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.profile-team-section-head__icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: var(--color-surface);
  background: var(--color-primary-dark);
}

.profile-team-section-head h2,
.profile-team-members__head h2 {
  min-width: 0;
  flex: 1;
}

.profile-team-section-head button,
.profile-team-member button {
  display: inline-grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 1px solid var(--color-border);
  border-radius: 13px;
  color: var(--text-muted);
  background: var(--color-surface);
  cursor: pointer;
}

.profile-team-field {
  display: grid;
  grid-template-columns: 1fr 42px;
  gap: 0;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card-compact);
  background: var(--color-surface);
  overflow: hidden;
}

.profile-team-field span {
  grid-column: 1 / -1;
  padding: 9px 12px 0;
  color: var(--text-muted);
  font-size: var(--font-size-caption);
  font-weight: 760;
}

.profile-team-field input {
  min-width: 0;
  border: 0;
  outline: 0;
  padding: 7px 12px 12px;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-family-base);
  font-size: var(--font-size-body-lg);
  font-weight: 850;
}

.profile-team-field input[readonly] {
  pointer-events: none;
}

.profile-team-field button {
  width: 42px;
  height: 42px;
  margin-right: 6px;
  border: 0;
  background: transparent;
  color: var(--text-muted);
}

.profile-team-hours-row {
  display: grid;
  grid-template-columns: 46px 1fr auto;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  min-height: 68px;
  margin-top: var(--space-3);
  border: 0;
  border-top: 1px solid var(--color-border);
  background: transparent;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
}

.profile-team-hours-row > span:first-child {
  width: 42px;
  height: 42px;
  border-radius: 50%;
}

.profile-team-hours-row strong,
.profile-team-hours-row small,
.profile-team-member__copy strong,
.profile-team-member__copy small {
  display: block;
  line-height: 1.22;
}

.profile-team-hours-row strong,
.profile-team-member__copy strong {
  color: var(--text-primary);
  font-size: var(--font-size-small);
  font-weight: 850;
}

.profile-team-hours-row small,
.profile-team-member__copy small {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: var(--font-size-small);
  font-weight: 650;
}

.profile-team-members__head span {
  color: var(--color-primary-dark);
  font-weight: 850;
}

.profile-team-member-list {
  display: grid;
  gap: var(--space-3);
}

.profile-team-member {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) auto 42px 42px;
  align-items: center;
  gap: var(--space-2);
  min-height: 76px;
  padding: 9px;
  border: 1px solid color-mix(in srgb, var(--color-border) 85%, transparent);
  border-radius: var(--radius-card-compact);
  background: var(--color-surface);
}

.profile-team-member__avatar {
  display: inline-grid;
  place-items: center;
  width: 56px;
  height: 56px;
  overflow: hidden;
  border-radius: 50%;
  color: var(--text-muted);
  background: var(--color-neutral-100);
}

.profile-team-member__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-team-member__copy {
  min-width: 0;
}

.profile-team-member__copy strong,
.profile-team-member__copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-team-member__active {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  font-size: var(--font-size-caption);
  font-weight: 850;
}

.profile-team-member__delete {
  color: var(--color-danger) !important;
}

.profile-team-empty {
  margin: 0;
  padding: var(--space-3);
  border-radius: var(--radius-card-compact);
  background: var(--color-neutral-100);
  color: var(--text-muted);
  font-size: var(--font-size-small);
  font-weight: 700;
}

.profile-team-add-member h2 {
  margin-bottom: var(--space-3);
}

.profile-team-add-member__grid {
  display: grid;
  grid-template-columns: 118px 1fr;
  gap: var(--space-3);
}

.profile-team-photo-drop {
  display: grid;
  place-items: center;
  align-content: center;
  gap: var(--space-2);
  min-height: 134px;
  border: 1px dashed color-mix(in srgb, var(--text-muted) 55%, var(--color-border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-neutral-100) 55%, var(--color-surface));
  color: var(--text-muted);
  font-family: var(--font-family-base);
  font-size: var(--font-size-small);
  font-weight: 760;
  text-align: center;
  cursor: pointer;
}

.profile-team-form-fields {
  display: grid;
  gap: var(--space-2);
}

.profile-team-input {
  display: grid;
  grid-template-columns: 36px 1fr;
  align-items: center;
  min-height: 42px;
  border: 1px solid var(--color-border);
  border-radius: 13px;
  background: var(--color-surface);
  color: var(--text-muted);
  padding: 0 11px;
}

.profile-team-input input {
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-family-base);
  font-size: var(--font-size-small);
  font-weight: 720;
}

.profile-team-input input::placeholder {
  color: var(--text-muted);
}

.profile-team-primary-action,
.profile-team-save-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  min-height: 52px;
  border: 0;
  border-radius: var(--radius-card-compact);
  background: var(--color-primary-dark);
  color: var(--color-surface);
  box-shadow: var(--shadow-soft);
  font-family: var(--font-family-base);
  font-size: var(--font-size-body-lg);
  font-weight: 850;
  cursor: pointer;
}

.profile-team-primary-action {
  margin-top: var(--space-3);
}

.profile-team-save-bar {
  padding: 0;
}

@media (max-width: 360px) {
  .profile-team-summary {
    grid-template-columns: 60px 1fr;
    gap: var(--space-3);
  }

  .profile-team-summary__icon {
    width: 60px;
    height: 60px;
  }

  .profile-team-stepper-card {
    grid-template-columns: 1fr;
  }

  .profile-team-member {
    grid-template-columns: 50px minmax(0, 1fr) 38px 38px;
  }

  .profile-team-member__active {
    grid-column: 2 / 3;
    justify-self: start;
  }

  .profile-team-add-member__grid {
    grid-template-columns: 1fr;
  }

  .profile-team-photo-drop {
    min-height: 96px;
    border-radius: var(--radius-card-compact);
  }
}
</style>
