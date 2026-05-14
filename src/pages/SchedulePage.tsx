import { useState, useEffect } from "react";
import DailySchedule from "@/components/DailySchedule";
import { useAppState } from "@/hooks/useAppState";
import { useReviewItems } from "@/hooks/useReviewItems";
import { useStats } from "@/hooks/useStats";
import { useMurojaahState } from "@/hooks/useMurojaahState";
import { Seo } from "@/components/Seo";

const SchedulePage = () => {
  const {
    state,
    showTranslation,
    shuffleForToday,
    getTodayAssignment,
    forceReshuffle,
    addTemporaryPrayers,
  } = useAppState();

  const { reviewItems, addReviewItem, removeReviewItem } = useReviewItems();
  const { recordAyatRead, recordWeakSpot } = useStats();
  const { markSurahCompleted } = useMurojaahState();
  const [todayAssignment, setTodayAssignment] = useState(getTodayAssignment());

  useEffect(() => {
    setTodayAssignment(getTodayAssignment());
  }, [state.dailyAssignments, getTodayAssignment]);

  const handleShuffle = () => {
    const assignment = shuffleForToday();
    setTodayAssignment(assignment);
  };

  const handleReshuffle = () => {
    const assignment = forceReshuffle();
    setTodayAssignment(assignment);
  };

  const handleAddTemporaryPrayers = (
    entries: Array<{
      id: string;
      prayerId: string;
      prayerName: string;
      rakaat: number;
    }>,
  ) => {
    const assignment = addTemporaryPrayers(entries);
    if (assignment) {
      setTodayAssignment(assignment);
    }
  };

  // Wrapper function that also syncs with murojaah
  const handleRecordAyatRead = (
    ayatCount: number,
    surahNumber: number,
    surahName: string,
    arabicName: string,
  ) => {
    // Record stats as usual
    recordAyatRead(ayatCount, surahNumber, surahName, arabicName);
    // Also mark in murojaah session if it exists
    markSurahCompleted(surahNumber);
  };

  const enabledPrayers = state.prayers.filter((p) => p.enabled);

  return (
    <DailySchedule
      assignment={todayAssignment}
      onShuffle={handleShuffle}
      onReshuffle={handleReshuffle}
      usedCount={state.usedChunks.length}
      totalCount={state.selectedChunks.length}
      onAddToReview={addReviewItem}
      onRemoveFromReview={removeReviewItem}
      enabledPrayers={enabledPrayers}
      onAddTemporaryPrayers={handleAddTemporaryPrayers}
      showTranslation={showTranslation}
      onRecordAyatRead={handleRecordAyatRead}
      onRecordWeakSpot={recordWeakSpot}
      reviewItems={reviewItems}
    />
  );
};

export default SchedulePage;
