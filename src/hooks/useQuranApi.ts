import { useState, useCallback } from "react";
import { hasOfflineData, getOfflineAyat } from "@/data/quranAyat";

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

const CACHE_KEY = "quran-ayah-cache";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  data: AyahWithTranslations[];
  timestamp: number;
}

const getCache = (): Record<string, CacheEntry> => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
};

const setCache = (key: string, data: AyahWithTranslations[]) => {
  try {
    const cache = getCache();
    cache[key] = { data, timestamp: Date.now() };
    const keys = Object.keys(cache);
    if (keys.length > 50) {
      const oldest = keys.sort(
        (a, b) => cache[a].timestamp - cache[b].timestamp,
      )[0];
      delete cache[oldest];
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore cache errors
  }
};

// Remove bismillah from first ayat
const removeBismillah = (text: string): string => {
  // Exact bismillah pattern from API:
  // بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ
  // Using Unicode code points for exact match
  const bismillahRegex = new RegExp(
    "^" +
      "\u0628\u0650\u0633\u06E1\u0645\u0650" + // بِسۡمِ
      "\\s*" +
      "\u0671\u0644\u0644\u0651\u064E\u0647\u0650" + // ٱللَّهِ
      "\\s*" +
      "\u0671\u0644\u0631\u0651\u064E\u062D\u06E1\u0645\u064E\u0640\u0670\u0646\u0650" + // ٱلرَّحۡمَـٰنِ
      "\\s*" +
      "\u0671\u0644\u0631\u0651\u064E\u062D\u0650\u06CC\u0645\u0650" + // ٱلرَّحِیمِ
      "\\s*",
    "u",
  );

  const cleaned = text.replace(bismillahRegex, "").trim();
  return cleaned || text;
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
      const cacheKey = `${surahNumber}-${startAyah}-${endAyah}`;

      // Check cache first
      const cache = getCache();
      const cached = cache[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
        return cached.data;
      }

      // Check for offline data first
      if (hasOfflineData(surahNumber)) {
        const offlineData = getOfflineAyat(surahNumber, startAyah, endAyah);
        if (offlineData.length > 0) {
          // Process to remove bismillah from first ayat
          const result = offlineData.map((ayah) => {
            if (
              ayah.numberInSurah === 1 &&
              surahNumber !== 1 &&
              surahNumber !== 9
            ) {
              return { ...ayah, arabic: removeBismillah(ayah.arabic) };
            }
            return ayah;
          });
          setCache(cacheKey, result);
          return result;
        }
      }

      setLoading(true);
      setError(null);
      try {
        const [arabicResponse, englishResponse, indonesianResponse] =
          await Promise.all([
            fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
            fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`),
            fetch(
              `https://api.alquran.cloud/v1/surah/${surahNumber}/id.indonesian`,
            ),
          ]);

        const [arabicData, englishData, indonesianData] = await Promise.all([
          arabicResponse.json(),
          englishResponse.json(),
          indonesianResponse.json(),
        ]);

        const result: AyahWithTranslations[] = [];

        for (let i = startAyah; i <= endAyah; i++) {
          const arabicAyah = arabicData.data.ayahs.find(
            (a: Ayah) => a.numberInSurah === i,
          );
          const englishAyah = englishData.data.ayahs.find(
            (a: Ayah) => a.numberInSurah === i,
          );
          const indonesianAyah = indonesianData.data.ayahs.find(
            (a: Ayah) => a.numberInSurah === i,
          );

          if (arabicAyah) {
            let arabicText = arabicAyah.text;
            // Remove bismillah from first ayat of surahs (except Al-Fatihah and At-Taubah)
            if (i === 1 && surahNumber !== 1 && surahNumber !== 9) {
              arabicText = removeBismillah(arabicText);
            }

            result.push({
              numberInSurah: i,
              arabic: arabicText,
              english: englishAyah?.text || "",
              indonesian: indonesianAyah?.text || "",
            });
          }
        }

        setCache(cacheKey, result);
        return result;
      } catch (err) {
        // Fallback to offline data if available
        if (hasOfflineData(surahNumber)) {
          const offlineData = getOfflineAyat(surahNumber, startAyah, endAyah);
          if (offlineData.length > 0) {
            return offlineData.map((ayah) => {
              if (
                ayah.numberInSurah === 1 &&
                surahNumber !== 1 &&
                surahNumber !== 9
              ) {
                return { ...ayah, arabic: removeBismillah(ayah.arabic) };
              }
              return ayah;
            });
          }
        }
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
