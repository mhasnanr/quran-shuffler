import { useState, useEffect, useCallback } from 'react';

const STATS_STORAGE_KEY = 'quran-shuffler-stats';

interface DailyStats {
  date: string;
  ayatRead: number;
  surahsCompleted: number;
  prayersCompleted: number;
}

interface WeakSpot {
  surahNumber: number;
  surahName: string;
  arabicName: string;
  reviewCount: number;
}

interface Stats {
  dailyStats: DailyStats[];
  weakSpots: WeakSpot[];
  currentStreak: number;
  longestStreak: number;
  totalAyatAllTime: number;
  totalSurahsAllTime: number;
  lastActiveDate: string;
}

const getDefaultStats = (): Stats => ({
  dailyStats: [],
  weakSpots: [],
  currentStreak: 0,
  longestStreak: 0,
  totalAyatAllTime: 0,
  totalSurahsAllTime: 0,
  lastActiveDate: '',
});

const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const getYesterdayKey = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
};

export const useStats = () => {
  const [stats, setStats] = useState<Stats>(() => {
    const stored = localStorage.getItem(STATS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Check and update streak on load
      const today = getTodayKey();
      const yesterday = getYesterdayKey();
      
      if (parsed.lastActiveDate !== today && parsed.lastActiveDate !== yesterday) {
        // Streak broken
        parsed.currentStreak = 0;
      }
      
      return parsed;
    }
    return getDefaultStats();
  });

  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const recordAyatRead = useCallback((ayatCount: number, surahNumber: number, surahName: string, arabicName: string) => {
    const today = getTodayKey();
    
    setStats(prev => {
      const newStats = { ...prev };
      
      // Update daily stats
      const todayStatsIndex = newStats.dailyStats.findIndex(d => d.date === today);
      if (todayStatsIndex >= 0) {
        newStats.dailyStats[todayStatsIndex].ayatRead += ayatCount;
        newStats.dailyStats[todayStatsIndex].surahsCompleted += 1;
      } else {
        newStats.dailyStats.push({
          date: today,
          ayatRead: ayatCount,
          surahsCompleted: 1,
          prayersCompleted: 0,
        });
      }
      
      // Update all-time totals
      newStats.totalAyatAllTime += ayatCount;
      newStats.totalSurahsAllTime += 1;
      
      // Update streak
      const yesterday = getYesterdayKey();
      if (prev.lastActiveDate === yesterday) {
        newStats.currentStreak = prev.currentStreak + 1;
      } else if (prev.lastActiveDate !== today) {
        newStats.currentStreak = 1;
      }
      newStats.longestStreak = Math.max(newStats.longestStreak, newStats.currentStreak);
      newStats.lastActiveDate = today;
      
      // Keep only last 30 days of daily stats
      newStats.dailyStats = newStats.dailyStats
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 30);
      
      return newStats;
    });
  }, []);

  const recordPrayerCompleted = useCallback(() => {
    const today = getTodayKey();
    
    setStats(prev => {
      const newStats = { ...prev };
      
      const todayStatsIndex = newStats.dailyStats.findIndex(d => d.date === today);
      if (todayStatsIndex >= 0) {
        newStats.dailyStats[todayStatsIndex].prayersCompleted += 1;
      } else {
        newStats.dailyStats.push({
          date: today,
          ayatRead: 0,
          surahsCompleted: 0,
          prayersCompleted: 1,
        });
      }
      
      return newStats;
    });
  }, []);

  const recordWeakSpot = useCallback((surahNumber: number, surahName: string, arabicName: string) => {
    setStats(prev => {
      const newStats = { ...prev };
      
      const existingIndex = newStats.weakSpots.findIndex(w => w.surahNumber === surahNumber);
      if (existingIndex >= 0) {
        newStats.weakSpots[existingIndex].reviewCount += 1;
      } else {
        newStats.weakSpots.push({
          surahNumber,
          surahName,
          arabicName,
          reviewCount: 1,
        });
      }
      
      // Sort by review count descending
      newStats.weakSpots.sort((a, b) => b.reviewCount - a.reviewCount);
      
      return newStats;
    });
  }, []);

  const getTodayStats = useCallback(() => {
    const today = getTodayKey();
    return stats.dailyStats.find(d => d.date === today) || {
      date: today,
      ayatRead: 0,
      surahsCompleted: 0,
      prayersCompleted: 0,
    };
  }, [stats.dailyStats]);

  const getWeeklyStats = useCallback(() => {
    const last7Days: DailyStats[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const dayStats = stats.dailyStats.find(d => d.date === dateKey);
      last7Days.push(dayStats || { date: dateKey, ayatRead: 0, surahsCompleted: 0, prayersCompleted: 0 });
    }
    return last7Days;
  }, [stats.dailyStats]);

  return {
    stats,
    recordAyatRead,
    recordPrayerCompleted,
    recordWeakSpot,
    getTodayStats,
    getWeeklyStats,
  };
};
