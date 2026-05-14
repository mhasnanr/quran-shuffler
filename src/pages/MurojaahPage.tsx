import { useMurojaahState } from "@/hooks/useMurojaahState";
import { useAppState } from "@/hooks/useAppState";
import MurojaahSurahSelector from "@/components/MurojaahSurahSelector";
import AyahViewer from "@/components/AyahViewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { surahs } from "@/data/quranData";
import { Shuffle, Edit, Play } from "lucide-react";
import { useState } from "react";
import { Seo } from "@/components/Seo";

const MurojaahPage = () => {
  const {
    selectedSurahs,
    setSelectedSurahs,
    dailyTarget,
    setDailyTarget,
    session,
    generateSession,
    reshuffleSession,
    markCompleted,
    getTodaySession,
  } = useMurojaahState();

  const { showTranslation } = useAppState();
  const [isEditMode, setIsEditMode] = useState(false);

  const todaySession = getTodaySession();
  const hasSession = todaySession && todaySession.surahs.length > 0;

  const handleToggleSurah = (surahNumber: number) => {
    if (selectedSurahs.includes(surahNumber)) {
      setSelectedSurahs(selectedSurahs.filter((n) => n !== surahNumber));
    } else {
      setSelectedSurahs([...selectedSurahs, surahNumber]);
    }
  };

  const handleSelectAllJuz = (juzNumber: number) => {
    const juzSurahs = surahs.filter((s) => s.juz.includes(juzNumber));
    const juzSurahNumbers = juzSurahs.map((s) => s.number);
    const newSelected = [...new Set([...selectedSurahs, ...juzSurahNumbers])];
    setSelectedSurahs(newSelected);
  };

  const handleDeselectAllJuz = (juzNumber: number) => {
    const juzSurahs = surahs.filter((s) => s.juz.includes(juzNumber));
    const juzSurahNumbers = new Set(juzSurahs.map((s) => s.number));
    const newSelected = selectedSurahs.filter((n) => !juzSurahNumbers.has(n));
    setSelectedSurahs(newSelected);
  };

  const handleStartSession = () => {
    generateSession();
  };

  const handleReshuffle = () => {
    reshuffleSession();
  };

  const handleEditSurahs = () => {
    setIsEditMode(true);
  };

  const handleDoneEditing = () => {
    setIsEditMode(false);
  };

  const completedCount = todaySession?.completedIndexes.length || 0;
  const totalCount = todaySession?.surahs.length || 0;

  // Setup state - show when no session or editing
  if (!hasSession || isEditMode) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-card p-6 shadow-card">
          <h2 className="text-lg font-bold text-foreground mb-2">
            Free Murojaah Session
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Select the surahs you've memorized and set a daily review target.
          </p>

          {/* Daily Target Input */}
          <div className="mb-4">
            <Label htmlFor="daily-target" className="text-sm font-medium">
              Daily Target
            </Label>
            <p className="text-xs text-muted-foreground mb-2">
              How many surahs to review per session (1-100)
            </p>
            <Input
              id="daily-target"
              type="number"
              min={1}
              max={100}
              value={dailyTarget}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= 100) {
                  setDailyTarget(val);
                }
              }}
              className="max-w-[200px]"
            />
          </div>

          {/* Start Session / Done Button */}
          <div className="flex gap-2">
            {isEditMode ? (
              <Button onClick={handleDoneEditing} size="sm">
                Done Editing
              </Button>
            ) : (
              <Button
                onClick={handleStartSession}
                disabled={selectedSurahs.length === 0 || dailyTarget === 0}
                size="sm"
              >
                <Play className="mr-1.5 h-4 w-4" />
                Start Session
              </Button>
            )}
          </div>
        </div>

        {/* Surah Selector */}
        <MurojaahSurahSelector
          selectedSurahs={selectedSurahs}
          onToggleSurah={handleToggleSurah}
          onSelectAllJuz={handleSelectAllJuz}
          onDeselectAllJuz={handleDeselectAllJuz}
        />
      </div>
    );
  }

  // Session state - show randomized list
  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="rounded-xl bg-card p-6 shadow-card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-1">
              Today's Murojaah
            </h2>
            <p className="text-sm text-muted-foreground">
              {completedCount} of {totalCount} completed
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReshuffle}>
              <Shuffle className="mr-1.5 h-4 w-4" />
              Reshuffle
            </Button>
            <Button variant="outline" size="sm" onClick={handleEditSurahs}>
              <Edit className="mr-1.5 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="gradient-islamic h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Surah List */}
      <div className="space-y-3">
        {todaySession.surahs.map((sessionSurah, index) => {
          const isCompleted = todaySession.completedIndexes.includes(index);
          const surah = surahs.find((s) => s.number === sessionSurah.surahNumber);
          if (!surah) return null;

          return (
            <div
              key={index}
              className={cn(
                "rounded-xl bg-card shadow-card overflow-hidden transition-all",
                isCompleted && "opacity-60",
              )}
            >
              {/* Header - Checkbox and Surah Info */}
              <div
                onClick={() => markCompleted(index)}
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
              >
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={() => markCompleted(index)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-muted-foreground">
                      {index + 1}.
                    </span>
                    <span className="text-sm font-medium">
                      {sessionSurah.surahName}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-arabic mt-0.5">
                    {sessionSurah.arabicName}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {surah.verses} ayah
                </span>
              </div>

              {/* Expandable AyahViewer */}
              <div className="border-t border-border">
                <AyahViewer
                  surahNumber={sessionSurah.surahNumber}
                  surahName={sessionSurah.surahName}
                  startAyah={1}
                  endAyah={surah.verses}
                  showTranslation={showTranslation}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MurojaahPage;
