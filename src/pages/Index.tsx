import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomNav, { TabType } from "@/components/BottomNav";
import DailySchedule from "@/components/DailySchedule";
import PrayerConfig from "@/components/PrayerConfig";
import JuzSelector from "@/components/JuzSelector";
import SurahList from "@/components/SurahList";
import ChunkSizeConfig from "@/components/ChunkSizeConfig";
import ChunkModeToggle from "@/components/ChunkModeToggle";
import PrayerGuideContent from "@/components/PrayerGuideContent";
import ReviewList from "@/components/ReviewList";
import { useAppState } from "@/hooks/useAppState";
import { useReviewItems } from "@/hooks/useReviewItems";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("schedule");
  const {
    state,
    chunkSize,
    chunksEnabled,
    setChunksEnabled,
    togglePrayer,
    updatePrayerRakaat,
    updateSelectedJuz,
    toggleChunk,
    toggleMandatory,
    selectAllChunks,
    deselectAllChunks,
    includeAllAyahs,
    revertToChunks,
    updateChunkSize,
    shuffleForToday,
    resetUsedChunks,
    getTodayAssignment,
    forceReshuffle,
    getAllPossibleChunks,
  } = useAppState();

  const { reviewItems, addReviewItem, removeReviewItem } = useReviewItems();
  const [todayAssignment, setTodayAssignment] = useState(getTodayAssignment());

  useEffect(() => {
    setTodayAssignment(getTodayAssignment());
  }, [state.dailyAssignments]);

  const handleShuffle = () => {
    const assignment = shuffleForToday();
    setTodayAssignment(assignment);
  };

  const handleReshuffle = () => {
    const assignment = forceReshuffle();
    setTodayAssignment(assignment);
  };

  const allPossibleChunks = getAllPossibleChunks();

  return (
    <div className="flex min-h-screen flex-col bg-background geometric-pattern">
      <Header />

      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-6">
        <div className="mx-auto max-w-lg">
          {activeTab === "guide" && <PrayerGuideContent />}

          {activeTab === "schedule" && (
            <DailySchedule
              assignment={todayAssignment}
              onShuffle={handleShuffle}
              onReshuffle={handleReshuffle}
              usedCount={state.usedChunks.length}
              totalCount={state.selectedChunks.length}
              onAddToReview={addReviewItem}
            />
          )}

          {activeTab === "review" && (
            <ReviewList
              items={reviewItems}
              onRemove={removeReviewItem}
              onComplete={removeReviewItem}
            />
          )}

          {activeTab === "config" && (
            <div className="space-y-6">
              <PrayerConfig
                prayers={state.prayers}
                onToggle={togglePrayer}
                onUpdateRakaat={updatePrayerRakaat}
              />

              <JuzSelector
                selectedJuz={state.selectedJuz}
                onSelectJuz={updateSelectedJuz}
              />

              <ChunkModeToggle
                chunksEnabled={chunksEnabled}
                onToggle={setChunksEnabled}
              />

              {chunksEnabled && (
                <ChunkSizeConfig
                  chunkSize={chunkSize}
                  onChunkSizeChange={updateChunkSize}
                />
              )}

              <SurahList
                selectedJuz={state.selectedJuz}
                selectedChunks={state.selectedChunks}
                mandatoryChunks={state.mandatoryChunks}
                allPossibleChunks={allPossibleChunks}
                chunksEnabled={chunksEnabled}
                onToggleChunk={toggleChunk}
                onToggleMandatory={toggleMandatory}
                onSelectAll={selectAllChunks}
                onDeselectAll={deselectAllChunks}
                onIncludeAllAyahs={includeAllAyahs}
                onRevertToChunks={revertToChunks}
              />

              <div className="rounded-xl bg-card p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Reset Used Pool
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {state.usedChunks.length} chunks used recently
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetUsedChunks}
                    disabled={state.usedChunks.length === 0}
                  >
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
