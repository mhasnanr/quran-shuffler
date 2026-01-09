export type PrayerCategory = 'main' | 'witir' | 'rawatib' | 'optional';

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
}

export interface DailyAssignment {
  date: string;
  assignments: PrayerAssignment[];
}

export interface PrayerAssignment {
  prayerId: string;
  prayerName: string;
  rakaatSurahs: RakaatSurah[];
}

export interface RakaatSurah {
  rakaatNumber: number;
  surahNumber: number;
  surahName: string;
  arabicName: string;
}

export interface AppState {
  prayers: Prayer[];
  selectedJuz: number[];
  selectedSurahs: number[];
  usedSurahs: number[];
  lastShuffleDate: string;
  dailyAssignments: DailyAssignment[];
}

export const defaultPrayers: Prayer[] = [
  // Main prayers - Fixed, cannot be removed
  { id: 'subuh', name: 'Subuh', arabicName: 'صبح', rakaat: 2, enabled: true, category: 'main', fixed: true, minRakaat: 2, maxRakaat: 2 },
  { id: 'dzuhur', name: 'Dzuhur', arabicName: 'ظهر', rakaat: 4, enabled: true, category: 'main', fixed: true, minRakaat: 4, maxRakaat: 4 },
  { id: 'ashar', name: 'Ashar', arabicName: 'عصر', rakaat: 4, enabled: true, category: 'main', fixed: true, minRakaat: 4, maxRakaat: 4 },
  { id: 'maghrib', name: 'Maghrib', arabicName: 'مغرب', rakaat: 3, enabled: true, category: 'main', fixed: true, minRakaat: 3, maxRakaat: 3 },
  { id: 'isya', name: 'Isya', arabicName: 'عشاء', rakaat: 4, enabled: true, category: 'main', fixed: true, minRakaat: 4, maxRakaat: 4 },
  
  // Rawatib - Sunnah prayers before/after main prayers
  { id: 'rawatib-subuh', name: 'Qabliyah Subuh', arabicName: 'قبلية الصبح', rakaat: 2, enabled: true, category: 'rawatib', minRakaat: 2, maxRakaat: 2 },
  { id: 'rawatib-dzuhur-before', name: 'Qabliyah Dzuhur', arabicName: 'قبلية الظهر', rakaat: 2, enabled: true, category: 'rawatib', minRakaat: 2, maxRakaat: 4 },
  { id: 'rawatib-dzuhur-after', name: "Ba'diyah Dzuhur", arabicName: 'بعدية الظهر', rakaat: 2, enabled: true, category: 'rawatib', minRakaat: 2, maxRakaat: 2 },
  { id: 'rawatib-maghrib', name: "Ba'diyah Maghrib", arabicName: 'بعدية المغرب', rakaat: 2, enabled: true, category: 'rawatib', minRakaat: 2, maxRakaat: 2 },
  { id: 'rawatib-isya', name: "Ba'diyah Isya", arabicName: 'بعدية العشاء', rakaat: 2, enabled: true, category: 'rawatib', minRakaat: 2, maxRakaat: 2 },
  
  // Witir - Must be odd number
  { id: 'witir', name: 'Witir', arabicName: 'وتر', rakaat: 3, enabled: true, category: 'witir', minRakaat: 1, maxRakaat: 11, mustBeOdd: true },
  
  // Optional prayers
  { id: 'tahajud', name: 'Tahajud', arabicName: 'تهجد', rakaat: 4, enabled: true, category: 'optional', minRakaat: 2, maxRakaat: 12 },
  { id: 'syuruq', name: 'Syuruq/Isyraq', arabicName: 'شروق', rakaat: 2, enabled: true, category: 'optional', minRakaat: 2, maxRakaat: 4 },
  { id: 'dhuha', name: 'Dhuha', arabicName: 'ضحى', rakaat: 4, enabled: true, category: 'optional', minRakaat: 2, maxRakaat: 12 },
];

export const categoryLabels: Record<PrayerCategory, { name: string; arabicName: string; description: string }> = {
  main: { name: 'Fardhu', arabicName: 'فرض', description: 'Obligatory prayers' },
  rawatib: { name: 'Rawatib', arabicName: 'رواتب', description: 'Sunnah before/after fardhu' },
  witir: { name: 'Witir', arabicName: 'وتر', description: 'Odd-numbered prayer' },
  optional: { name: 'Sunnah', arabicName: 'سنة', description: 'Optional prayers' },
};
