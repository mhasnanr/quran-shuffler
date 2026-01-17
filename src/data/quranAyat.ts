// Hardcoded Quran data for offline use - Juz 30 (Juz Amma)
// Format: { surahNumber: { ayahNumber: { arabic, english, indonesian } } }

export interface AyahData {
  arabic: string;
  english: string;
  indonesian: string;
}

export const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
export const BISMILLAH_ENGLISH =
  "In the name of Allah, the Entirely Merciful, the Especially Merciful.";
export const BISMILLAH_INDONESIAN =
  "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.";
