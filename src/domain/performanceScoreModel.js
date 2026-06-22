export const PERFORMANCE_STORAGE_KEY = "lipyum.performanceScoreDemo.v1";

export const PERFORMANCE_TARGET_SCORE = 85;

export const PERFORMANCE_CATEGORIES = [
  {
    id: "customerSatisfaction",
    title: "Müşteri memnuniyeti",
    fullTitle: "Müşteri memnuniyeti ve hizmet kalitesi",
    shortDescription: "Yorumlar, puan ve sorunsuz iş",
    current: 24.2,
    max: 30,
    metrics: [
      { title: "Müşteri yorum puanı ortalaması", max: 8 },
      { title: "Müşteri yorumlarına yanıt verme", max: 5 },
      { title: "Sorunsuz tamamlanan iş oranı", max: 7 },
      { title: "Aynı sorunun 14 gün içinde tekrar açılmaması", max: 6 },
      { title: "Randevuya zamanında varma", max: 4 },
    ],
  },
  {
    id: "jobTransparency",
    title: "İş sonucu ve mali şeffaflık",
    shortDescription: "Ücret, gider, sonuç ve belgeler",
    current: 20.1,
    max: 25,
    metrics: [
      { title: "İş sonucunun, alınan ücretlerin ve giderlerin zamanında sisteme girilmesi", max: 15 },
      { title: "Garanti belgesi, kalite taahhüdü ve benzeri belgelerin sistem üzerinden verilmesi", max: 8 },
      { title: "Müşterinin işin tamamlandığını dijital olarak onaylaması", max: 2 },
    ],
  },
  {
    id: "responseTrust",
    title: "Yanıt ve güvenilirlik",
    fullTitle: "Yanıt, iletişim ve güvenilirlik",
    shortDescription: "İlk yanıt, mesaj ve randevu",
    current: 12.4,
    max: 15,
    metrics: [
      { title: "Yeni işe veya teklif talebine ilk yanıt süresi", max: 6 },
      { title: "Müşteri mesajlarına zamanında cevap verme", max: 3 },
      { title: "Yola çıktım, adrese ulaştım, işe başladım ve tamamlandı durumlarını güncelleme", max: 3 },
      { title: "Usta kaynaklı iptal, gecikme ve randevuya gelmeme oranı", max: 3 },
    ],
  },
  {
    id: "jobPool",
    title: "Lipyum iş havuzu",
    fullTitle: "Lipyum iş havuzuna katılım",
    shortDescription: "Bakiye yenileme ve yorum alma",
    current: 10.8,
    max: 15,
    metrics: [
      { title: "Bakiye bittikten sonra 18 saat içinde yeniden bakiye yükleme", max: 10 },
      { title: "Müşterilerden yorum alma oranı", max: 5 },
    ],
  },
  {
    id: "profilePromotion",
    title: "Profil ve tanıtım",
    fullTitle: "Profil kalitesi ve tanıtım",
    shortDescription: "Eksiksiz profil ve paylaşım",
    current: 9.2,
    max: 10,
    metrics: [
      { title: "Profilde istenen tüm bilgilerin eksiksiz doldurulması", max: 6 },
      { title: "Profil kartını sosyal medyada veya WhatsApp'ta paylaşma", max: 2 },
      { title: "Profil kartını kendi web sitesine ekleme", max: 2 },
    ],
  },
  {
    id: "ecosystem",
    title: "Ekosisteme katkı",
    fullTitle: "Lipyum ekosistemine katkı",
    shortDescription: "Yeni partner ve ilk işi",
    current: 5,
    max: 5,
    metrics: [
      { title: "Yeni bir partneri Lipyum'a davet edip kayıt olmasını sağlama", max: 2 },
      { title: "Davet edilen partnerin ilk işini tamamlaması", max: 3 },
    ],
  },
];

export const PERFORMANCE_TASKS = [
  {
    id: "job-result",
    title: "Son işin bilgilerini gir",
    shortDescription: "Ücret, gider ve iş sonucunu tamamla.",
    category: "jobTransparency",
    estimatedMinutes: 3,
    scoreDelta: 0.2,
    status: "open",
    priority: "high",
    actionLabel: "BİLGİLERİ GİR",
    route: "/performance-score/task/job-result",
    oneTimeOnly: true,
    icon: "file-text",
    criticalBoost: 1.5,
  },
  {
    id: "review-reply",
    title: "Müşteri yorumuna cevap ver",
    shortDescription: "Yeni yoruma kısa ve nazik yanıt ver.",
    category: "customerSatisfaction",
    estimatedMinutes: 1,
    scoreDelta: 0.1,
    status: "open",
    priority: "medium",
    actionLabel: "YAP",
    route: "/reviews",
    oneTimeOnly: true,
    icon: "message",
  },
  {
    id: "warranty-document",
    title: "Garanti belgesi oluştur",
    shortDescription: "Müşteriye güven veren belgeyi hazırla.",
    category: "jobTransparency",
    estimatedMinutes: 2,
    scoreDelta: 0.1,
    status: "open",
    priority: "medium",
    actionLabel: "YAP",
    route: "/performance-score/tasks",
    oneTimeOnly: true,
    icon: "shield",
  },
  {
    id: "profile-complete",
    title: "Profilini tamamla",
    shortDescription: "Eksik profil alanlarını bitir.",
    category: "profilePromotion",
    estimatedMinutes: 4,
    scoreDelta: 0.1,
    status: "completed",
    priority: "low",
    actionLabel: "GÖR",
    route: "/profile",
    completedAt: "demo",
    oneTimeOnly: true,
    icon: "user",
  },
  {
    id: "request-review",
    title: "Müşteriden yorum al",
    shortDescription: "Tamamlanan işten yorum iste.",
    category: "jobPool",
    estimatedMinutes: 1,
    scoreDelta: 0.1,
    status: "completed",
    priority: "low",
    actionLabel: "GÖR",
    route: "/reviews",
    completedAt: "demo",
    oneTimeOnly: true,
    icon: "star",
  },
  {
    id: "wallet-top-up",
    title: "Bakiye yükle",
    shortDescription: "İş fırsatlarını kaçırma.",
    category: "jobPool",
    estimatedMinutes: 2,
    scoreDelta: 0.1,
    status: "completed",
    priority: "low",
    actionLabel: "GÖR",
    route: "/wallet",
    completedAt: "demo",
    oneTimeOnly: true,
    icon: "wallet",
  },
  {
    id: "invite-partner",
    title: "Yeni usta davet et",
    shortDescription: "Güvendiğin ustayı Lipyum'a çağır.",
    category: "ecosystem",
    estimatedMinutes: 2,
    scoreDelta: 0.1,
    status: "completed",
    priority: "low",
    actionLabel: "GÖR",
    route: "/referral",
    completedAt: "demo",
    oneTimeOnly: true,
    icon: "users",
  },
  {
    id: "share-profile",
    title: "Profil kartını paylaş",
    shortDescription: "Profilini WhatsApp'ta paylaş.",
    category: "profilePromotion",
    estimatedMinutes: 1,
    scoreDelta: 0.1,
    status: "completed",
    priority: "low",
    actionLabel: "GÖR",
    route: "/partner-card-preview",
    completedAt: "demo",
    oneTimeOnly: true,
    icon: "share",
  },
];

const scoreFormatter = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function roundScoreToOneDecimal(value) {
  return Math.round((Number(value) + Number.EPSILON) * 10) / 10;
}

export function formatScoreTr(value) {
  return scoreFormatter.format(roundScoreToOneDecimal(value));
}

export function clampScore(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, roundScoreToOneDecimal(value)));
}

export function createInitialCategoryScores() {
  return Object.fromEntries(PERFORMANCE_CATEGORIES.map((category) => [category.id, category.current]));
}

export function calculateTotalScore(categoryScores = createInitialCategoryScores()) {
  return clampScore(Object.values(categoryScores).reduce((total, value) => total + Number(value || 0), 0));
}

export function getRemainingToTarget(score, targetScore = PERFORMANCE_TARGET_SCORE) {
  return Math.max(0, roundScoreToOneDecimal(targetScore - score));
}

export function calculateTaskPriority(task) {
  const base = Number(task.scoreDelta || 0) / Math.max(1, Number(task.estimatedMinutes || 1));
  return roundScoreToOneDecimal(base * 10 + Number(task.criticalBoost || 0));
}

export function rankTasks(tasks = PERFORMANCE_TASKS) {
  return [...tasks]
    .filter((task) => task.status !== "completed")
    .sort((a, b) => calculateTaskPriority(b) - calculateTaskPriority(a));
}

export function createInitialPerformanceState() {
  const categoryScores = createInitialCategoryScores();
  const completedTaskIds = PERFORMANCE_TASKS.filter((task) => task.status === "completed").map((task) => task.id);
  const score = calculateTotalScore(categoryScores);

  return {
    score,
    animatedScore: score,
    targetScore: PERFORMANCE_TARGET_SCORE,
    categoryScores,
    tasks: PERFORMANCE_TASKS.map((task) => ({ ...task })),
    completedTaskIds,
    scoreHistory: [],
    lastScoreChange: null,
    selectedTaskId: null,
  };
}

export function completePerformanceTask(state, taskId, now = new Date().toISOString()) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) return { state, changed: false, message: "Görev bulunamadı." };

  const alreadyCompleted = state.completedTaskIds.includes(taskId) || task.status === "completed";
  if (alreadyCompleted && task.oneTimeOnly) {
    return { state, changed: false, message: "Bu görev daha önce tamamlandı." };
  }

  const oldScore = calculateTotalScore(state.categoryScores);
  const nextCategoryScores = { ...state.categoryScores };
  const category = PERFORMANCE_CATEGORIES.find((item) => item.id === task.category);
  const max = category?.max ?? 100;
  nextCategoryScores[task.category] = clampScore(Number(nextCategoryScores[task.category] || 0) + task.scoreDelta, 0, max);
  const newScore = calculateTotalScore(nextCategoryScores);
  const nextTasks = state.tasks.map((item) =>
    item.id === taskId ? { ...item, status: "completed", completedAt: now } : { ...item },
  );
  const completedTaskIds = [...new Set([...state.completedTaskIds, taskId])];
  const change = {
    taskId,
    taskTitle: task.title,
    delta: roundScoreToOneDecimal(newScore - oldScore),
    oldScore,
    newScore,
    createdAt: now,
  };

  return {
    state: {
      ...state,
      score: newScore,
      categoryScores: nextCategoryScores,
      tasks: nextTasks,
      completedTaskIds,
      lastScoreChange: change,
      scoreHistory: [...state.scoreHistory, change],
    },
    changed: true,
    message: `+${formatScoreTr(change.delta)} puan eklendi.`,
  };
}

export function restorePerformanceState(rawValue) {
  if (!rawValue) return createInitialPerformanceState();
  try {
    const parsed = JSON.parse(rawValue);
    const initial = createInitialPerformanceState();
    const state = {
      ...initial,
      ...parsed,
      categoryScores: { ...initial.categoryScores, ...(parsed.categoryScores || {}) },
      tasks: initial.tasks.map((task) => {
        const persisted = parsed.tasks?.find?.((item) => item.id === task.id);
        return persisted ? { ...task, ...persisted } : task;
      }),
      completedTaskIds: Array.isArray(parsed.completedTaskIds) ? parsed.completedTaskIds : initial.completedTaskIds,
      scoreHistory: Array.isArray(parsed.scoreHistory) ? parsed.scoreHistory : [],
    };
    const score = calculateTotalScore(state.categoryScores);
    return { ...state, score, animatedScore: parsed.animatedScore ?? score };
  } catch {
    return createInitialPerformanceState();
  }
}

export function serializePerformanceState(state) {
  return JSON.stringify({
    score: state.score,
    animatedScore: state.animatedScore,
    targetScore: state.targetScore,
    categoryScores: state.categoryScores,
    tasks: state.tasks,
    completedTaskIds: state.completedTaskIds,
    scoreHistory: state.scoreHistory,
    lastScoreChange: state.lastScoreChange,
    selectedTaskId: state.selectedTaskId,
  });
}
