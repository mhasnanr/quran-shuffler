import { useState, useEffect } from "react";
import { surahs } from "@/data/quranData";

const MUROJAAH_ENABLED_KEY = "quran-shuffler-murojaah-enabled";
const MUROJAAH_CONFIG_KEY = "quran-shuffler-murojaah-config";
const MUROJAAH_SESSION_KEY = "quran-shuffler-murojaah-session";

export interface MurojaahConfig {
  selectedSurahs: number[];
  dailyTarget: number;
}

export interface MurojaahSessionSurah {
  surahNumber: number;
  surahName: string;
  arabicName: string;
}

export interface MurojaahSession {
  date: string;
  surahs: MurojaahSessionSurah[];
  completedIndexes: number[];
}

const getTodayDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getStoredEnabled = (): boolean => {
  const stored = localStorage.getItem(MUROJAAH_ENABLED_KEY);
  return stored === "true";
};

const getStoredConfig = (): MurojaahConfig => {
  const stored = localStorage.getItem(MUROJAAH_CONFIG_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid data, return default
    }
  }
  return { selectedSurahs: [], dailyTarget: 10 };
};

const getStoredSession = (): MurojaahSession | null => {
  const stored = localStorage.getItem(MUROJAAH_SESSION_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid data
    }
  }
  return null;
};

export const useMurojaahState = () => {
  const [murojaahEnabled, setMurojaahEnabledState] = useState<boolean>(
    getStoredEnabled,
  );
  const [config, setConfigState] = useState<MurojaahConfig>(getStoredConfig);
  const [session, setSessionState] = useState<MurojaahSession | null>(
    getStoredSession,
  );

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem(MUROJAAH_ENABLED_KEY, String(murojaahEnabled));
  }, [murojaahEnabled]);

  useEffect(() => {
    localStorage.setItem(MUROJAAH_CONFIG_KEY, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(MUROJAAH_SESSION_KEY, JSON.stringify(session));
    }
  }, [session]);

  const setMurojaahEnabled = (enabled: boolean) => {
    setMurojaahEnabledState(enabled);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('murojaah-enabled-changed', { detail: enabled }));
  };

  // Listen for changes from other components
  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      setMurojaahEnabledState(e.detail);
    };

    window.addEventListener('murojaah-enabled-changed' as any, handleStorageChange);
    return () => {
      window.removeEventListener('murojaah-enabled-changed' as any, handleStorageChange);
    };
  }, []);

  const setSelectedSurahs = (surahNumbers: number[]) => {
    setConfigState((prev) => ({ ...prev, selectedSurahs: surahNumbers }));
  };

  const setDailyTarget = (target: number) => {
    setConfigState((prev) => ({ ...prev, dailyTarget: target }));
  };

  const generateSession = (): MurojaahSession => {
    const today = getTodayDate();
    const { selectedSurahs, dailyTarget } = config;

    if (selectedSurahs.length === 0 || dailyTarget === 0) {
      const emptySession: MurojaahSession = {
        date: today,
        surahs: [],
        completedIndexes: [],
      };
      setSessionState(emptySession);
      return emptySession;
    }

    // Build the session surahs array
    const sessionSurahs: MurojaahSessionSurah[] = [];
    for (let i = 0; i < dailyTarget; i++) {
      const surahNumber = selectedSurahs[i % selectedSurahs.length];
      const surah = surahs.find((s) => s.number === surahNumber);
      if (surah) {
        sessionSurahs.push({
          surahNumber: surah.number,
          surahName: surah.name,
          arabicName: surah.arabicName,
        });
      }
    }

    // Shuffle the session surahs
    const shuffled = [...sessionSurahs].sort(() => Math.random() - 0.5);

    const newSession: MurojaahSession = {
      date: today,
      surahs: shuffled,
      completedIndexes: [],
    };

    setSessionState(newSession);
    return newSession;
  };

  const reshuffleSession = (): MurojaahSession => {
    // Just regenerate - same logic as generateSession
    return generateSession();
  };

  const markCompleted = (index: number) => {
    if (!session) return;

    setSessionState((prev) => {
      if (!prev) return null;

      const isAlreadyCompleted = prev.completedIndexes.includes(index);
      const newCompletedIndexes = isAlreadyCompleted
        ? prev.completedIndexes.filter((i) => i !== index)
        : [...prev.completedIndexes, index];

      return {
        ...prev,
        completedIndexes: newCompletedIndexes,
      };
    });
  };

  const getTodaySession = (): MurojaahSession | null => {
    const today = getTodayDate();
    if (session && session.date === today) {
      return session;
    }
    return null;
  };

  // Mark a surah as completed by surah number (called from prayer schedule)
  const markSurahCompleted = (surahNumber: number) => {
    const todaySession = getTodaySession();
    if (!todaySession) return;

    // Find all indexes that match this surah number
    const matchingIndexes = todaySession.surahs
      .map((s, idx) => (s.surahNumber === surahNumber ? idx : -1))
      .filter((idx) => idx !== -1);

    if (matchingIndexes.length === 0) return;

    setSessionState((prev) => {
      if (!prev) return null;

      // Add all matching indexes that aren't already completed
      const newCompletedIndexes = [...prev.completedIndexes];
      let hasChanges = false;

      for (const idx of matchingIndexes) {
        if (!newCompletedIndexes.includes(idx)) {
          newCompletedIndexes.push(idx);
          hasChanges = true;
        }
      }

      if (!hasChanges) return prev;

      return {
        ...prev,
        completedIndexes: newCompletedIndexes,
      };
    });
  };

  return {
    murojaahEnabled,
    setMurojaahEnabled,
    selectedSurahs: config.selectedSurahs,
    setSelectedSurahs,
    dailyTarget: config.dailyTarget,
    setDailyTarget,
    session,
    generateSession,
    reshuffleSession,
    markCompleted,
    markSurahCompleted,
    getTodaySession,
  };
};
