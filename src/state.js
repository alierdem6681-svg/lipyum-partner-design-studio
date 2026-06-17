export const navigationStack = [];

export const initialUiState = {
  screen: "home",
  dispatchOn: true,
  workTab: "pool",
  jobsTab: "incoming",
  selectedIssue: "",
  ticketTopic: "İade",
  offerMessage: "",
  selectedDate: "Bugün",
  regionFilter: "Bugün",
  reviewFilter: "all",
  reviewVisibleCount: 3,
  reviewListMode: false,
  notificationVisibleCount: 7,
  lazyListCounts: {},
  notificationReadIds: ["n3", "n6"],
  notificationsCleared: false,
  showReadNotifications: false,
  referralFilter: "all",
  referralSearch: "",
  referralVisibleCount: 6,
  leaderboardSector: "Beyaz Eşya Tamiri",
  leaderboardRegion: "",
  packageTab: "free",
  growthPackageTab: "demand",
  growthPackageStep: 1,
  previousScreen: "home",
  selectedTaskKey: "ready",
  selectedReferralId: "ahmet-kaya",
  selectedEarningId: "earn-1",
  drawerBadgesExpanded: false,
  profileBadgesExpanded: false,
};

export function createUiState(overrides = {}) {
  return {
    ...initialUiState,
    ...overrides,
    notificationReadIds: [...initialUiState.notificationReadIds],
    lazyListCounts: { ...initialUiState.lazyListCounts, ...(overrides.lazyListCounts || {}) },
  };
}
