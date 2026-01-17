export type PrayerCategory = "main" | "sunnah";

export interface Prayer {
  id: string;
  name: string;
  arabicName: string;
  rakaat: number;
  enabled: boolean;
  category: PrayerCategory;
  fixed?: boolean; // Cannot be removed
  minRakaat?: number;
  maxRakaat?: number;
  mustBeOdd?: boolean;
  isRawatib?: boolean;
  recitationRakaat?: number; // How many rakaat have surah recitation
  order: number; // For sorting by prayer time
}

export interface DailyAssignment {
  date: string;
  assignments: PrayerAssignment[];
}

export interface PrayerAssignment {
  prayerId: string;
  prayerName: string;
  rakaatSurahs: RakaatSurah[];
  isTemporary?: boolean;
  order?: number; // For sorting
}

export interface RakaatSurah {
  rakaatNumber: number;
  surahNumber: number;
  surahName: string;
  arabicName: string;
  startAyah: number;
  endAyah: number;
  isTemporary?: boolean; // Mark if this rakaat was added via temporary prayer
}

export interface SurahChunkSelection {
  id: string; // "surahNumber-startAyah-endAyah"
  surahNumber: number;
  startAyah: number;
  endAyah: number;
}

export interface AppState {
  prayers: Prayer[];
  selectedJuz: number[];
  selectedChunks: SurahChunkSelection[]; // Replaces selectedSurahs
  mandatoryChunks: string[]; // IDs of chunks that must always appear
  usedChunks: string[]; // IDs of used chunks
  lastShuffleDate: string;
  dailyAssignments: DailyAssignment[];
}

export const defaultPrayers: Prayer[] = [
  // Sunnah - Night prayers
  {
    id: "tahajud",
    name: "Tahajud",
    arabicName: "تهجد",
    rakaat: 4,
    enabled: true,
    category: "sunnah",
    minRakaat: 2,
    maxRakaat: 12,
    order: 1,
  },
  {
    id: "witir",
    name: "Witir",
    arabicName: "وتر",
    rakaat: 3,
    enabled: true,
    category: "sunnah",
    minRakaat: 1,
    maxRakaat: 11,
    mustBeOdd: true,
    order: 2,
  },

  // Fajr time
  {
    id: "rawatib-subuh",
    name: "Qabliyah Subuh",
    arabicName: "قبلية الصبح",
    rakaat: 2,
    enabled: true,
    category: "sunnah",
    minRakaat: 2,
    maxRakaat: 2,
    isRawatib: true,
    order: 3,
  },
  {
    id: "subuh",
    name: "Subuh",
    arabicName: "صبح",
    rakaat: 2,
    enabled: true,
    category: "main",
    minRakaat: 2,
    maxRakaat: 2,
    order: 4,
  },

  // Morning prayers
  {
    id: "syuruq",
    name: "Syuruq/Isyraq",
    arabicName: "شروق",
    rakaat: 2,
    enabled: true,
    category: "sunnah",
    minRakaat: 2,
    maxRakaat: 2,
    order: 5,
  },
  {
    id: "dhuha",
    name: "Dhuha",
    arabicName: "ضحى",
    rakaat: 4,
    enabled: true,
    category: "sunnah",
    minRakaat: 2,
    maxRakaat: 12,
    order: 6,
  },

  // Dzuhur time
  {
    id: "rawatib-dzuhur-before",
    name: "Qabliyah Dzuhur",
    arabicName: "قبلية الظهر",
    rakaat: 2,
    enabled: true,
    category: "sunnah",
    minRakaat: 2,
    maxRakaat: 4,
    isRawatib: true,
    order: 7,
  },
  {
    id: "dzuhur",
    name: "Dzuhur",
    arabicName: "ظهر",
    rakaat: 4,
    enabled: false,
    category: "main",
    minRakaat: 4,
    maxRakaat: 4,
    recitationRakaat: 2,
    order: 8,
  },
  {
    id: "rawatib-dzuhur-after",
    name: "Ba'diyah Dzuhur",
    arabicName: "بعدية الظهر",
    rakaat: 2,
    enabled: true,
    category: "sunnah",
    minRakaat: 2,
    maxRakaat: 2,
    isRawatib: true,
    order: 9,
  },

  // Ashar time
  {
    id: "rawatib-ashar",
    name: "Qabliyah Ashar",
    arabicName: "قبلية العصر",
    rakaat: 4,
    enabled: false,
    category: "sunnah",
    minRakaat: 2,
    maxRakaat: 4,
    isRawatib: true,
    order: 10,
  },
  {
    id: "ashar",
    name: "Ashar",
    arabicName: "عصر",
    rakaat: 4,
    enabled: false,
    category: "main",
    minRakaat: 4,
    maxRakaat: 4,
    recitationRakaat: 2,
    order: 11,
  },

  // Maghrib time
  {
    id: "maghrib",
    name: "Maghrib",
    arabicName: "مغرب",
    rakaat: 3,
    enabled: false,
    category: "main",
    minRakaat: 3,
    maxRakaat: 3,
    recitationRakaat: 2,
    order: 12,
  },
  {
    id: "rawatib-maghrib",
    name: "Ba'diyah Maghrib",
    arabicName: "بعدية المغرب",
    rakaat: 2,
    enabled: true,
    category: "sunnah",
    minRakaat: 2,
    maxRakaat: 2,
    isRawatib: true,
    order: 13,
  },

  // Isya time
  {
    id: "isya",
    name: "Isya",
    arabicName: "عشاء",
    rakaat: 4,
    enabled: false,
    category: "main",
    minRakaat: 4,
    maxRakaat: 4,
    recitationRakaat: 2,
    order: 14,
  },
  {
    id: "rawatib-isya",
    name: "Ba'diyah Isya",
    arabicName: "بعدية العشاء",
    rakaat: 2,
    enabled: true,
    category: "sunnah",
    minRakaat: 2,
    maxRakaat: 2,
    isRawatib: true,
    order: 15,
  },
];

export const categoryLabels: Record<
  PrayerCategory,
  { name: string; arabicName: string; description: string }
> = {
  main: {
    name: "Fardhu",
    arabicName: "فرض",
    description: "Obligatory prayers",
  },
  sunnah: {
    name: "Sunnah",
    arabicName: "سنة",
    description: "Recommended prayers",
  },
};
