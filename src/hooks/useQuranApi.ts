import { useState, useCallback } from 'react';

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

const CACHE_KEY = 'quran-ayah-cache';
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
    // Keep only last 50 entries
    const keys = Object.keys(cache);
    if (keys.length > 50) {
      const oldest = keys.sort((a, b) => cache[a].timestamp - cache[b].timestamp)[0];
      delete cache[oldest];
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore cache errors
  }
};

export const useQuranApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAyahs = useCallback(async (
    surahNumber: number,
    startAyah: number,
    endAyah: number
  ): Promise<AyahWithTranslations[]> => {
    const cacheKey = `${surahNumber}-${startAyah}-${endAyah}`;
    
    // Check cache first
    const cache = getCache();
    const cached = cache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
      return cached.data;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch Arabic text
      const arabicResponse = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}`
      );
      const arabicData = await arabicResponse.json();
      
      // Fetch English translation
      const englishResponse = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`
      );
      const englishData = await englishResponse.json();
      
      // Fetch Indonesian translation
      const indonesianResponse = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/id.indonesian`
      );
      const indonesianData = await indonesianResponse.json();

      const result: AyahWithTranslations[] = [];
      
      for (let i = startAyah; i <= endAyah; i++) {
        const arabicAyah = arabicData.data.ayahs.find((a: Ayah) => a.numberInSurah === i);
        const englishAyah = englishData.data.ayahs.find((a: Ayah) => a.numberInSurah === i);
        const indonesianAyah = indonesianData.data.ayahs.find((a: Ayah) => a.numberInSurah === i);
        
        if (arabicAyah) {
          let arabicText = arabicAyah.text;
          
          // Remove bismillah from first ayah of surahs (except Al-Fatihah:1 and At-Taubah:9)
          if (i === 1 && surahNumber !== 1 && surahNumber !== 9) {
            // Comprehensive bismillah patterns covering various Unicode representations
            const bismillahPatterns = [
              // Full bismillah with various diacritics
              /^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/u,
              /^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/u,
              /^بسم الله الرحمن الرحيم\s*/u,
              /^بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ\s*/u,
              // With optional ornament at start
              /^۞?\s*بِسْمِ\s*اللَّهِ\s*الرَّحْمَٰنِ\s*الرَّحِيمِ\s*/u,
              /^۞?\s*بِسْمِ\s*ٱللَّهِ\s*ٱلرَّحْمَٰنِ\s*ٱلرَّحِيمِ\s*/u,
            ];
            
            for (const pattern of bismillahPatterns) {
              if (pattern.test(arabicText)) {
                arabicText = arabicText.replace(pattern, '').trim();
                break;
              }
            }
          }
          
          result.push({
            numberInSurah: i,
            arabic: arabicText,
            english: englishAyah?.text || '',
            indonesian: indonesianAyah?.text || '',
          });
        }
      }

      // Cache the result
      setCache(cacheKey, result);
      
      return result;
    } catch (err) {
      setError('Failed to fetch ayahs');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchAyahs, loading, error };
};
