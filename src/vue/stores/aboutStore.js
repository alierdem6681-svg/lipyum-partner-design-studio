import { defineStore } from "pinia";

const STORAGE_KEY = "lipyum.about.profile.v1";
const MAX_ABOUT_LENGTH = 500;

export const experienceOptions = ["1 yıldan az", "1-3 yıl", "4-7 yıl", "8 yıl", "10+ yıl"];
export const accountTypeOptions = ["Kurumsal", "Bireysel"];

const defaultState = {
  sectorExperience: "8 yıl",
  accountType: "Kurumsal",
  companyName: "Demir Tesisat Ltd. Şti.",
  companyAddress: "Atatürk Mah. 123 Sk. No:45 K:2 D:4, Çankaya / Ankara",
  taxNumber: "123 456 7890",
  aboutText:
    "10 yılı aşkın süredir tesisat, doğalgaz ve kombi bakım alanında profesyonel çözümler sunuyoruz. Müşteri memnuniyetini ön planda tutarak zamanında, kaliteli ve güvenilir hizmet sağlıyoruz.",
};

function clampAboutText(value) {
  return String(value || "").slice(0, MAX_ABOUT_LENGTH);
}

function safeParse(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function readStoredState() {
  if (typeof window === "undefined") return { ...defaultState };
  try {
    const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY));
    return parsed
      ? {
          ...defaultState,
          ...parsed,
          aboutText: clampAboutText(parsed.aboutText),
        }
      : { ...defaultState };
  } catch {
    return { ...defaultState };
  }
}

function writeStoredState(state) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sectorExperience: state.sectorExperience,
        accountType: state.accountType,
        companyName: state.companyName,
        companyAddress: state.companyAddress,
        taxNumber: state.taxNumber,
        aboutText: clampAboutText(state.aboutText),
      }),
    );
  } catch {
    // Local storage can be unavailable in private or restricted contexts.
  }
}

export const useAboutStore = defineStore("about", {
  state: () => readStoredState(),
  getters: {
    maxLength: () => MAX_ABOUT_LENGTH,
    remainingCharacters: (state) => Math.max(0, MAX_ABOUT_LENGTH - clampAboutText(state.aboutText).length),
    aboutLength: (state) => clampAboutText(state.aboutText).length,
  },
  actions: {
    saveProfile(payload) {
      const nextExperience = experienceOptions.includes(payload.sectorExperience)
        ? payload.sectorExperience
        : defaultState.sectorExperience;
      this.sectorExperience = nextExperience;
      this.accountType = accountTypeOptions.includes(payload.accountType) ? payload.accountType : defaultState.accountType;
      this.companyName = String(payload.companyName || "").trim() || defaultState.companyName;
      this.companyAddress = String(payload.companyAddress || "").trim() || defaultState.companyAddress;
      this.taxNumber = String(payload.taxNumber || "").trim() || defaultState.taxNumber;
      this.aboutText = clampAboutText(payload.aboutText);
      writeStoredState(this.$state);
    },
    resetAboutDemo() {
      this.$patch({ ...defaultState });
      writeStoredState(this.$state);
    },
  },
});

export { MAX_ABOUT_LENGTH, STORAGE_KEY as ABOUT_STORAGE_KEY, clampAboutText };
