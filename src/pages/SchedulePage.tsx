import { useState, useEffect } from "react";
import DailySchedule from "@/components/DailySchedule";
import { useAppState } from "@/hooks/useAppState";
import { useReviewItems } from "@/hooks/useReviewItems";
import { useStats } from "@/hooks/useStats";

const SchedulePage = () => {
  const {
    state,
    showTranslation,
    shuffleForToday,
    getTodayAssignment,
    forceReshuffle,
    addTemporaryPrayers,
  } = useAppState();

  const { addReviewItem } = useReviewItems();
  const { recordAyatRead, recordWeakSpot } = useStats();
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

  const enabledPrayers = state.prayers.filter((p) => p.enabled);

  return (
    <DailySchedule
      assignment={todayAssignment}
      onShuffle={handleShuffle}
      onReshuffle={handleReshuffle}
      usedCount={state.usedChunks.length}
      totalCount={state.selectedChunks.length}
      onAddToReview={addReviewItem}
      enabledPrayers={enabledPrayers}
      onAddTemporaryPrayers={handleAddTemporaryPrayers}
      showTranslation={showTranslation}
      onRecordAyatRead={recordAyatRead}
      onRecordWeakSpot={recordWeakSpot}
    />
  );
};

export default SchedulePage;
