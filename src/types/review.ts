export interface ReviewItem {
  id: string;
  surahNumber: number;
  surahName: string;
  arabicName: string;
  startAyah: number;
  endAyah: number;
  addedAt: string; // ISO date string
  prayerName?: string; // Optional: which prayer it was from
}

export const REVIEW_STORAGE_KEY = 'quran-shuffler-review-items';
