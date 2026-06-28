export const swipeInstruction = {
  title: "Sola kaydır, sıradaki işi gör",
  description: "Beğenmediğin işleri kolayca geç.",
};

export const swipeBottomHint = {
  text: "Beğenmediğin işleri sola kaydır, beğendiklerini inceleyip hemen iletişime geç.",
};

export const jobSwipeCards = [
  {
    id: "job-klima-2481",
    title: "Klima bakımı",
    statusLabel: "Yeni İş",
    createdAtLabel: "3 dk önce",
    location: "Mezitli / Mersin",
    ownershipCopy: "İş sizin · müşteri sizi bekliyor",
    icon: "snowflake",
    durationLabel: "45 dk",
    earningLabel: "850 TL",
    chips: [
      { icon: "wrench", title: "Bakım", label: "Hizmet" },
      { icon: "home", title: "Daire", label: "Konum" },
      { icon: "wind", title: "Split", label: "Klima" },
    ],
    details: [
      "Klima iç ve dış ünite detaylı bakım yapılacak.",
      "Filtre temizliği, gaz kontrolü ve genel performans testi.",
    ],
    customer: {
      name: "Ahmet Y.",
      rating: 4.8,
      reviewCount: 13,
      verified: true,
      phone: "0501 123 45 67",
    },
  },
  {
    id: "job-petek-2482",
    title: "Petek temizliği",
    statusLabel: "Randevu",
    createdAtLabel: "24 dk önce",
    location: "Pozcu / Mersin",
    ownershipCopy: "İş sizin · müşteri sizi bekliyor",
    icon: "wrench",
    durationLabel: "1 saat 15 dk",
    earningLabel: "1.350 TL",
    chips: [
      { icon: "wrench", title: "Temizlik", label: "Hizmet" },
      { icon: "home", title: "Apartman", label: "Konum" },
      { icon: "timer", title: "Bugün", label: "Zaman" },
    ],
    details: [
      "Peteklerin tamamında detaylı temizlik yapılacak.",
      "Basınç testi uygulanacak ve sistem kontrol edilecek.",
    ],
    customer: {
      name: "Elif K.",
      rating: 4.9,
      reviewCount: 18,
      verified: true,
      phone: "0532 456 78 90",
    },
  },
  {
    id: "job-temizlik-2483",
    title: "Ev temizliği",
    statusLabel: "Yeni İş",
    createdAtLabel: "8 dk önce",
    location: "Yenişehir / Mersin",
    ownershipCopy: "İş sizin · müşteri sizi bekliyor",
    icon: "cleaning-home",
    durationLabel: "5 saat",
    earningLabel: "1.900 TL",
    chips: [
      { icon: "sparkles", title: "Genel", label: "Temizlik" },
      { icon: "home", title: "Daire", label: "Konut" },
      { icon: "briefcase", title: "3+1", label: "Tip" },
    ],
    details: [
      "Ev genelinde detaylı temizlik yapılacak.",
      "Tüm odalar, mutfak ve banyo temizliği bekleniyor.",
    ],
    customer: {
      name: "Zehra T.",
      rating: 4.7,
      reviewCount: 9,
      verified: true,
      phone: "0544 111 22 33",
    },
  },
  {
    id: "job-camasir-2484",
    title: "Çamaşır makinesi",
    statusLabel: "Yeni İş",
    createdAtLabel: "35 dk önce",
    location: "Toroslar / Mersin",
    ownershipCopy: "İş sizin · müşteri sizi bekliyor",
    icon: "washing-machine",
    durationLabel: "55 dk",
    earningLabel: "720 TL",
    chips: [
      { icon: "wrench", title: "Arıza", label: "Hizmet" },
      { icon: "home", title: "Ev", label: "Konum" },
      { icon: "shield", title: "Acil", label: "Öncelik" },
    ],
    details: [
      "Makine su boşaltmıyor ve program yarıda kalıyor.",
      "Yerinde kontrol ve onarım talep ediliyor.",
    ],
    customer: {
      name: "Murat A.",
      rating: 4.8,
      reviewCount: 21,
      verified: true,
      phone: "0555 987 65 43",
    },
  },
];

export function clampIndex(index, jobs = jobSwipeCards) {
  if (!Array.isArray(jobs) || jobs.length === 0) return 0;
  return Math.max(0, Math.min(Number(index) || 0, jobs.length - 1));
}

export function getCurrentJob(index = 0, jobs = jobSwipeCards) {
  if (!Array.isArray(jobs) || jobs.length === 0) return null;
  return jobs[clampIndex(index, jobs)] || null;
}

export function getNextJob(index = 0, jobs = jobSwipeCards) {
  if (!Array.isArray(jobs) || jobs.length <= 1) return null;
  return jobs[index + 1] || null;
}

export function shouldAdvanceOnSwipe(deltaX, threshold = 72) {
  return Number(deltaX) <= -Math.abs(threshold);
}

export function formatCustomerRating(customer = {}) {
  if (!customer.rating || !customer.reviewCount) return "";
  return `${customer.rating.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} puan · ${customer.reviewCount} değerlendirme`;
}
