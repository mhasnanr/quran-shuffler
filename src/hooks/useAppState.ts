import { useState, useEffect } from 'react';
import { AppState, Prayer, defaultPrayers, DailyAssignment, PrayerAssignment, RakaatSurah } from '@/types/prayer';
import { surahs, getSurahsByJuz } from '@/data/quranData';

const STORAGE_KEY = 'quran-shuffler-state';

const getInitialState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid stored data, return default
    }
  }
  return {
    prayers: defaultPrayers,
    selectedJuz: [30], // Default to Juz 30
    selectedSurahs: getSurahsByJuz([30]).map(s => s.number),
    usedSurahs: [],
    lastShuffleDate: '',
    dailyAssignments: [],
  };
};

const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(getInitialState);

  // Persist to localStorage
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
      prayers: prev.prayers.map(p =>
        p.id === prayerId ? { ...p, rakaat: Math.max(1, rakaat) } : p
      ),
    }));
  };

  const updateSelectedJuz = (juzNumbers: number[]) => {
    const newSurahs = getSurahsByJuz(juzNumbers).map(s => s.number);
    setState(prev => ({
      ...prev,
      selectedJuz: juzNumbers,
      selectedSurahs: newSurahs,
    }));
  };

  const toggleSurah = (surahNumber: number) => {
    setState(prev => ({
      ...prev,
      selectedSurahs: prev.selectedSurahs.includes(surahNumber)
        ? prev.selectedSurahs.filter(s => s !== surahNumber)
        : [...prev.selectedSurahs, surahNumber],
    }));
  };

  const shuffleForToday = (): DailyAssignment | null => {
    const today = getTodayDate();
    
    // Check if we already have assignments for today
    const existingAssignment = state.dailyAssignments.find(a => a.date === today);
    if (existingAssignment) {
      return existingAssignment;
    }

    const enabledPrayers = state.prayers.filter(p => p.enabled);
    const totalRakaatNeeded = enabledPrayers.reduce((sum, p) => sum + p.rakaat, 0);
    
    if (totalRakaatNeeded === 0 || state.selectedSurahs.length === 0) {
      return null;
    }

    // Get available surahs (not used recently)
    let availableSurahs = state.selectedSurahs.filter(s => !state.usedSurahs.includes(s));
    
    // If we don't have enough surahs, reset the used list
    let newUsedSurahs = [...state.usedSurahs];
    if (availableSurahs.length < totalRakaatNeeded) {
      availableSurahs = [...state.selectedSurahs];
      newUsedSurahs = [];
    }

    // Shuffle available surahs
    const shuffled = [...availableSurahs].sort(() => Math.random() - 0.5);
    
    // Assign surahs to each rakaat
    const assignments: PrayerAssignment[] = [];
    let surahIndex = 0;

    for (const prayer of enabledPrayers) {
      const rakaatSurahs: RakaatSurah[] = [];
      
      for (let i = 0; i < prayer.rakaat; i++) {
        const surahNumber = shuffled[surahIndex % shuffled.length];
        const surah = surahs.find(s => s.number === surahNumber)!;
        
        rakaatSurahs.push({
          rakaatNumber: i + 1,
          surahNumber: surah.number,
          surahName: surah.name,
          arabicName: surah.arabicName,
        });
        
        // Track used surahs
        if (!newUsedSurahs.includes(surahNumber)) {
          newUsedSurahs.push(surahNumber);
        }
        
        surahIndex++;
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
      usedSurahs: newUsedSurahs,
      lastShuffleDate: today,
      dailyAssignments: [...prev.dailyAssignments.slice(-6), newAssignment], // Keep last 7 days
    }));

    return newAssignment;
  };

  const resetUsedSurahs = () => {
    setState(prev => ({
      ...prev,
      usedSurahs: [],
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

  return {
    state,
    updatePrayers,
    togglePrayer,
    updatePrayerRakaat,
    updateSelectedJuz,
    toggleSurah,
    shuffleForToday,
    resetUsedSurahs,
    getTodayAssignment,
    forceReshuffle,
  };
};
