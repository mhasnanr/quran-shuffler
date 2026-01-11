import { useState, useEffect, useCallback } from 'react';
import { AppState, Prayer, defaultPrayers, DailyAssignment, PrayerAssignment, RakaatSurah, SurahChunkSelection } from '@/types/prayer';
import { surahs, getSurahsByJuz } from '@/data/quranData';
import { generateDefaultChunks, CHUNK_SIZE_STORAGE_KEY, DEFAULT_CHUNK_SIZE } from '@/types/surahSelection';

const STORAGE_KEY = 'quran-shuffler-state';

// Generate chunk ID
const getChunkId = (surahNumber: number, startAyah: number, endAyah: number): string => {
  return `${surahNumber}-${startAyah}-${endAyah}`;
};

// Generate default chunks for juz selection
const generateChunksForJuz = (juzNumbers: number[], chunkSize: number = DEFAULT_CHUNK_SIZE): SurahChunkSelection[] => {
  const juzSurahs = getSurahsByJuz(juzNumbers);
  const chunks: SurahChunkSelection[] = [];
  
  for (const surah of juzSurahs) {
    // For short surahs (<=chunkSize verses), use whole surah
    if (surah.verses <= chunkSize) {
      chunks.push({
        id: getChunkId(surah.number, 1, surah.verses),
        surahNumber: surah.number,
        startAyah: 1,
        endAyah: surah.verses,
      });
    } else {
      // For longer surahs, create chunks
      const ranges = generateDefaultChunks(surah.verses, chunkSize);
      for (const range of ranges) {
        chunks.push({
          id: getChunkId(surah.number, range.start, range.end),
          surahNumber: surah.number,
          startAyah: range.start,
          endAyah: range.end,
        });
      }
    }
  }
  
  return chunks;
};

const getStoredChunkSize = (): number => {
  const stored = localStorage.getItem(CHUNK_SIZE_STORAGE_KEY);
  if (stored) {
    const parsed = parseInt(stored, 10);
    if (!isNaN(parsed) && parsed >= 5 && parsed <= 50) {
      return parsed;
    }
  }
  return DEFAULT_CHUNK_SIZE;
};

const getInitialState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const chunkSize = getStoredChunkSize();
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Merge with default prayers to handle new prayers added
      const mergedPrayers = defaultPrayers.map(defaultPrayer => {
        const storedPrayer = parsed.prayers?.find((p: Prayer) => p.id === defaultPrayer.id);
        if (storedPrayer) {
          return { ...defaultPrayer, enabled: storedPrayer.enabled, rakaat: storedPrayer.rakaat };
        }
        return defaultPrayer;
      });
      
      // Handle migration from old format
      if (parsed.selectedSurahs && !parsed.selectedChunks) {
        const defaultChunks = generateChunksForJuz(parsed.selectedJuz || [30], chunkSize);
        return {
          ...parsed,
          prayers: mergedPrayers,
          selectedChunks: defaultChunks,
          usedChunks: [],
        };
      }
      
      return { ...parsed, prayers: mergedPrayers };
    } catch {
      // Invalid stored data, return default
    }
  }
  
  const defaultJuz = [30];
  return {
    prayers: defaultPrayers,
    selectedJuz: defaultJuz,
    selectedChunks: generateChunksForJuz(defaultJuz, chunkSize),
    usedChunks: [],
    lastShuffleDate: '',
    dailyAssignments: [],
  };
};

const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(getInitialState);
  const [chunkSize, setChunkSizeState] = useState<number>(getStoredChunkSize);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updatePrayers = (prayers: Prayer[]) => {
    setState(prev => ({ ...prev, prayers }));
  };

  const togglePrayer = (prayerId: string) => {
    setState(prev => ({
      ...prev,
      prayers: prev.prayers.map(p =>
        p.id === prayerId ? { ...p, enabled: !p.enabled } : p
      ),
    }));
  };

  const updatePrayerRakaat = (prayerId: string, rakaat: number) => {
    setState(prev => ({
      ...prev,
      prayers: prev.prayers.map(p => {
        if (p.id !== prayerId) return p;
        
        let newRakaat = rakaat;
        if (p.minRakaat) newRakaat = Math.max(p.minRakaat, newRakaat);
        if (p.maxRakaat) newRakaat = Math.min(p.maxRakaat, newRakaat);
        
        return { ...p, rakaat: newRakaat };
      }),
    }));
  };

  const updateSelectedJuz = (juzNumbers: number[]) => {
    const newChunks = generateChunksForJuz(juzNumbers, chunkSize);
    setState(prev => ({
      ...prev,
      selectedJuz: juzNumbers,
      selectedChunks: newChunks,
      usedChunks: [], // Reset used chunks when changing juz
    }));
  };

  const toggleChunk = (chunkId: string) => {
    setState(prev => ({
      ...prev,
      selectedChunks: prev.selectedChunks.some(c => c.id === chunkId)
        ? prev.selectedChunks.filter(c => c.id !== chunkId)
        : [...prev.selectedChunks, findChunkById(chunkId, prev.selectedJuz)].filter(Boolean) as SurahChunkSelection[],
    }));
  };

  const findChunkById = (chunkId: string, juzNumbers: number[]): SurahChunkSelection | null => {
    const [surahNum, startAyah, endAyah] = chunkId.split('-').map(Number);
    const surah = surahs.find(s => s.number === surahNum);
    if (!surah) return null;
    return {
      id: chunkId,
      surahNumber: surahNum,
      startAyah,
      endAyah,
    };
  };

  const updateChunkRange = (surahNumber: number, startAyah: number, endAyah: number, newStart: number, newEnd: number) => {
    const oldId = getChunkId(surahNumber, startAyah, endAyah);
    const newId = getChunkId(surahNumber, newStart, newEnd);
    
    setState(prev => ({
      ...prev,
      selectedChunks: prev.selectedChunks.map(c =>
        c.id === oldId
          ? { ...c, id: newId, startAyah: newStart, endAyah: newEnd }
          : c
      ),
    }));
  };

  const selectAllChunks = () => {
    const allChunks = generateChunksForJuz(state.selectedJuz, chunkSize);
    setState(prev => ({
      ...prev,
      selectedChunks: allChunks,
    }));
  };

  const deselectAllChunks = () => {
    setState(prev => ({
      ...prev,
      selectedChunks: [],
    }));
  };

  const updateChunkSize = useCallback((newSize: number) => {
    localStorage.setItem(CHUNK_SIZE_STORAGE_KEY, String(newSize));
    setChunkSizeState(newSize);
    
    // Regenerate chunks with new size
    const newChunks = generateChunksForJuz(state.selectedJuz, newSize);
    setState(prev => ({
      ...prev,
      selectedChunks: newChunks,
      usedChunks: [], // Reset used chunks when changing chunk size
    }));
  }, [state.selectedJuz]);

  const shuffleForToday = (): DailyAssignment | null => {
    const today = getTodayDate();
    
    const existingAssignment = state.dailyAssignments.find(a => a.date === today);
    if (existingAssignment) {
      return existingAssignment;
    }

    // Sort prayers by order for proper daily sequence
    const enabledPrayers = state.prayers
      .filter(p => p.enabled)
      .sort((a, b) => a.order - b.order);
    
    // Calculate total rakaat needed (considering recitationRakaat)
    const totalRakaatNeeded = enabledPrayers.reduce((sum, p) => {
      const recitationCount = p.recitationRakaat ?? p.rakaat;
      return sum + recitationCount;
    }, 0);
    
    if (totalRakaatNeeded === 0 || state.selectedChunks.length === 0) {
      return null;
    }

    let availableChunks = state.selectedChunks.filter(c => !state.usedChunks.includes(c.id));
    
    let newUsedChunks = [...state.usedChunks];
    if (availableChunks.length < totalRakaatNeeded) {
      availableChunks = [...state.selectedChunks];
      newUsedChunks = [];
    }

    const shuffled = [...availableChunks].sort(() => Math.random() - 0.5);
    
    const assignments: PrayerAssignment[] = [];
    let chunkIndex = 0;

    for (const prayer of enabledPrayers) {
      const rakaatSurahs: RakaatSurah[] = [];
      const recitationCount = prayer.recitationRakaat ?? prayer.rakaat;
      
      for (let i = 0; i < recitationCount; i++) {
        const chunk = shuffled[chunkIndex % shuffled.length];
        const surah = surahs.find(s => s.number === chunk.surahNumber)!;
        
        rakaatSurahs.push({
          rakaatNumber: i + 1,
          surahNumber: surah.number,
          surahName: surah.name,
          arabicName: surah.arabicName,
          startAyah: chunk.startAyah,
          endAyah: chunk.endAyah,
        });
        
        if (!newUsedChunks.includes(chunk.id)) {
          newUsedChunks.push(chunk.id);
        }
        
        chunkIndex++;
      }

      assignments.push({
        prayerId: prayer.id,
        prayerName: prayer.name,
        rakaatSurahs,
      });
    }

    const newAssignment: DailyAssignment = {
      date: today,
      assignments,
    };

    setState(prev => ({
      ...prev,
      usedChunks: newUsedChunks,
      lastShuffleDate: today,
      dailyAssignments: [...prev.dailyAssignments.slice(-6), newAssignment],
    }));

    return newAssignment;
  };

  const resetUsedChunks = () => {
    setState(prev => ({
      ...prev,
      usedChunks: [],
    }));
  };

  const getTodayAssignment = (): DailyAssignment | null => {
    const today = getTodayDate();
    return state.dailyAssignments.find(a => a.date === today) || null;
  };

  const forceReshuffle = () => {
    const today = getTodayDate();
    setState(prev => ({
      ...prev,
      dailyAssignments: prev.dailyAssignments.filter(a => a.date !== today),
    }));
  };

  // Get all possible chunks for the selected juz (for UI)
  const getAllPossibleChunks = () => {
    return generateChunksForJuz(state.selectedJuz, chunkSize);
  };

  return {
    state,
    chunkSize,
    updatePrayers,
    togglePrayer,
    updatePrayerRakaat,
    updateSelectedJuz,
    toggleChunk,
    updateChunkRange,
    selectAllChunks,
    deselectAllChunks,
    updateChunkSize,
    shuffleForToday,
    resetUsedChunks,
    getTodayAssignment,
    forceReshuffle,
    getAllPossibleChunks,
  };
};
