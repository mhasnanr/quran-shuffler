import { useCallback, useState } from "react";
import quranData from "../data/quranOffline.json";

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
}

export interface AyahWithTranslations {
  numberInSurah: number;
  arabic: string;
  english: string;
  indonesian: string;
}

interface OfflineAyah {
  number: number;
  arabic: string;
  english: string;
  indonesian: string;
}

interface OfflineSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: OfflineAyah[];
}

interface OfflineQuranData {
  metadata: {
    scrapedAt: string;
    source: string;
    arabicEdition: string;
    englishEdition: string;
    indonesianEdition: string;
  };
  surahs: OfflineSurah[];
}

const typedQuranData = quranData as OfflineQuranData;

// Remove bismillah from first ayat
const removeBismillah = (text: string): string => {
  // Exact bismillah pattern from offline data:
  // بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ
  // Unicode: 0628 0650 0633 06e1 0645 0650 0020 0671 0644 0644 0651 064e 0647 0650 0020 0671 0644 0631 0651 064e 062d 06e1 0645 064e 0640 0670 0646 0650 0020 0671 0644 0631 0651 064e 062d 0650 06cc 0645 0650
  const bismillah =
    "\u0628\u0650\u0633\u06e1\u0645\u0650" + // بِسۡمِ
    " " +
    "\u0671\u0644\u0644\u0651\u064e\u0647\u0650" + // ٱللَّهِ
    " " +
    "\u0671\u0644\u0631\u0651\u064e\u062d\u06e1\u0645\u064e\u0640\u0670\u0646\u0650" + // ٱلرَّحۡمَـٰنِ
    " " +
    "\u0671\u0644\u0631\u0651\u064e\u062d\u0650\u06cc\u0645\u0650"; // ٱلرَّحِیمِ

  if (text.startsWith(bismillah)) {
    return text.slice(bismillah.length).trim();
  }
  return text;
};

export const useQuranApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAyahs = useCallback(
    async (
      surahNumber: number,
      startAyah: number,
      endAyah: number,
    ): Promise<AyahWithTranslations[]> => {
      setLoading(true);
      setError(null);

      try {
        // Find surah from offline data
        const surah = typedQuranData.surahs.find(
          (s) => s.number === surahNumber,
        );

        if (!surah) {
          setError(`Surah ${surahNumber} not found`);
          return [];
        }

        const result: AyahWithTranslations[] = [];

        for (let i = startAyah; i <= endAyah; i++) {
          const ayah = surah.ayahs.find((a) => a.number === i);

          if (ayah) {
            let arabicText = ayah.arabic;
            // Remove bismillah from first ayat of surahs (except Al-Fatihah and At-Taubah)
            if (i === 1 && surahNumber !== 1 && surahNumber !== 9) {
              arabicText = removeBismillah(arabicText);
            }

            result.push({
              numberInSurah: i,
              arabic: arabicText.trim(),
              english: ayah.english,
              indonesian: ayah.indonesian,
            });
          }
        }

        return result;
      } catch (err) {
        setError("Failed to fetch ayat");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { fetchAyahs, loading, error };
};
