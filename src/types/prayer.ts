export interface Prayer {
  id: string;
  name: string;
  arabicName: string;
  rakaat: number;
  enabled: boolean;
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
  { id: 'tahajud', name: 'Tahajud', arabicName: 'تهجد', rakaat: 4, enabled: true },
  { id: 'witir-2', name: 'Witir (2 Rakaat)', arabicName: 'وتر', rakaat: 2, enabled: true },
  { id: 'witir-1', name: 'Witir (1 Rakaat)', arabicName: 'وتر', rakaat: 1, enabled: true },
  { id: 'syuruq', name: 'Syuruq', arabicName: 'شروق', rakaat: 2, enabled: true },
  { id: 'dhuha', name: 'Dhuha', arabicName: 'ضحى', rakaat: 4, enabled: true },
];
