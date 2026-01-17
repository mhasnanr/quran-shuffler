import { useState, useEffect } from "react";
import { DailyAssignment, PrayerAssignment, RakaatSurah } from "@/types/prayer";
import { Button } from "@/components/ui/button";
import {
  Shuffle,
  RotateCcw,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AyahViewer from "./AyahViewer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import RecallFeedbackDialog from "./RecallFeedbackDialog";

interface DailyScheduleProps {
  assignment: DailyAssignment | null;
  onShuffle: () => void;
  onReshuffle: () => void;
  usedCount: number;
  totalCount: number;
  onAddToReview: (item: {
    surahNumber: number;
    surahName: string;
    arabicName: string;
    startAyah: number;
    endAyah: number;
    prayerName?: string;
  }) => void;
}

const getCategoryColor = (prayerId: string) => {
  if (["subuh", "dzuhur", "ashar", "maghrib", "isya"].includes(prayerId)) {
    return "bg-primary/20 text-primary border-primary/40 dark:bg-primary/30 dark:text-primary dark:border-primary/50";
  }
  if (prayerId.startsWith("rawatib")) {
    return "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/25 dark:text-emerald-400 dark:border-emerald-500/40";
  }
  // Sunnah prayers (Tahajud, Witir, Dhuha, etc.)
  return "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:bg-amber-500/25 dark:text-amber-400 dark:border-amber-500/40";
};

const getStorageKey = (date: string) => `completed-prayers-${date}`;
const getRakaatStorageKey = (date: string) => `completed-rakaat-${date}`;

// Helper to split rakaat into rounds of 2 (or 2+1 for odd)
const splitIntoRounds = (totalRakaat: number): number[] => {
  const rounds: number[] = [];
  let remaining = totalRakaat;

  while (remaining > 0) {
    if (remaining === 1) {
      rounds.push(1);
      remaining = 0;
    } else {
      rounds.push(2);
      remaining -= 2;
    }
  }

  return rounds;
};

const DailySchedule = ({
  assignment,
  onShuffle,
  onReshuffle,
  usedCount,
  totalCount,
  onAddToReview,
}: DailyScheduleProps) => {
  // Use local timezone for date key
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const today = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const [completedPrayers, setCompletedPrayers] = useState<string[]>(() => {
    const saved = localStorage.getItem(getStorageKey(todayKey));
    return saved ? JSON.parse(saved) : [];
  });

  const [completedRakaat, setCompletedRakaat] = useState<string[]>(() => {
    const saved = localStorage.getItem(getRakaatStorageKey(todayKey));
    return saved ? JSON.parse(saved) : [];
  });

  const [pendingOpen, setPendingOpen] = useState(true);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [expandedRounds, setExpandedRounds] = useState<string[]>([]);
  const [isReshuffling, setIsReshuffling] = useState(false);

  // Feedback dialog state
  const [feedbackDialog, setFeedbackDialog] = useState<{
    open: boolean;
    rakaat: RakaatSurah | null;
    prayerName: string;
    rakaatKey: string;
  }>({ open: false, rakaat: null, prayerName: "", rakaatKey: "" });
  useEffect(() => {
    localStorage.setItem(
      getStorageKey(todayKey),
      JSON.stringify(completedPrayers),
    );
  }, [completedPrayers, todayKey]);

  useEffect(() => {
    localStorage.setItem(
      getRakaatStorageKey(todayKey),
      JSON.stringify(completedRakaat),
    );
  }, [completedRakaat, todayKey]);

  const toggleCompleted = (prayerId: string) => {
    setCompletedPrayers((prev) =>
      prev.includes(prayerId)
        ? prev.filter((id) => id !== prayerId)
        : [...prev, prayerId],
    );
  };

  const handleRakaatCheck = (
    rakaatKey: string,
    prayerId: string,
    totalRakaatForPrayer: number,
    rakaat: RakaatSurah,
    prayerName: string,
  ) => {
    const isAlreadyCompleted = completedRakaat.includes(rakaatKey);

    if (isAlreadyCompleted) {
      // If unchecking, just remove it
      setCompletedRakaat((prev) => prev.filter((id) => id !== rakaatKey));
    } else {
      // If checking, show feedback dialog
      setFeedbackDialog({
        open: true,
        rakaat,
        prayerName,
        rakaatKey,
      });
    }
  };

  const handleFeedbackRemembered = () => {
    const { rakaatKey, rakaat } = feedbackDialog;
    if (!rakaat) return;

    // Mark as completed
    completeRakaat(rakaatKey);
    setFeedbackDialog({
      open: false,
      rakaat: null,
      prayerName: "",
      rakaatKey: "",
    });
  };

  const handleFeedbackForgot = () => {
    const { rakaat, prayerName, rakaatKey } = feedbackDialog;
    if (!rakaat) return;

    // Add to review list
    onAddToReview({
      surahNumber: rakaat.surahNumber,
      surahName: rakaat.surahName,
      arabicName: rakaat.arabicName,
      startAyah: rakaat.startAyah,
      endAyah: rakaat.endAyah,
      prayerName,
    });

    // Still mark as completed
    completeRakaat(rakaatKey);
    setFeedbackDialog({
      open: false,
      rakaat: null,
      prayerName: "",
      rakaatKey: "",
    });
  };

  const completeRakaat = (rakaatKey: string) => {
    // Extract prayerId and find prayer to get total rakaat
    const parts = rakaatKey.split("-rakaat-");
    const prayerId = parts[0];
    const prayerAssignment = assignment?.assignments.find(
      (a) => a.prayerId === prayerId,
    );
    const totalRakaatForPrayer = prayerAssignment?.rakaatSurahs.length || 0;

    setCompletedRakaat((prev) => {
      const newCompleted = [...prev, rakaatKey];

      // Check if all rakaat for this prayer are now completed
      const allRakaatCompleted = Array.from(
        { length: totalRakaatForPrayer },
        (_, i) => `${prayerId}-rakaat-${i}`,
      ).every((key) => newCompleted.includes(key));

      // Auto-complete the prayer if all rakaat are done
      if (allRakaatCompleted && !completedPrayers.includes(prayerId)) {
        setCompletedPrayers((p) => [...p, prayerId]);
      }

      return newCompleted;
    });
  };

  const toggleRoundExpanded = (roundKey: string) => {
    setExpandedRounds((prev) =>
      prev.includes(roundKey)
        ? prev.filter((k) => k !== roundKey)
        : [...prev, roundKey],
    );
  };

  const isRakaatCompleted = (rakaatKey: string) =>
    completedRakaat.includes(rakaatKey);

  const totalRakaat =
    assignment?.assignments.reduce(
      (sum, a) => sum + a.rakaatSurahs.length,
      0,
    ) || 0;

  const pendingPrayers =
    assignment?.assignments.filter(
      (p) => !completedPrayers.includes(p.prayerId),
    ) || [];

  const completedPrayersList =
    assignment?.assignments.filter((p) =>
      completedPrayers.includes(p.prayerId),
    ) || [];

  const renderRakaatRound = (
    prayerAssignment: PrayerAssignment,
    roundIndex: number,
    roundSize: number,
    startRakaatIndex: number,
    isCompleted: boolean,
    totalRakaatForPrayer: number,
  ) => {
    const roundKey = `${prayerAssignment.prayerId}-round-${roundIndex}`;
    const isExpanded = expandedRounds.includes(roundKey);
    const rakaatInRound = prayerAssignment.rakaatSurahs.slice(
      startRakaatIndex,
      startRakaatIndex + roundSize,
    );

    const allRakaatInRoundCompleted = rakaatInRound.every((_, idx) =>
      isRakaatCompleted(
        `${prayerAssignment.prayerId}-rakaat-${startRakaatIndex + idx}`,
      ),
    );

    const getRoundLabel = () => {
      if (roundSize === 1) return "1 Rakaat";
      return `${roundSize} Rakaat`;
    };

    return (
      <Collapsible
        key={roundKey}
        open={isExpanded}
        onOpenChange={() => toggleRoundExpanded(roundKey)}
      >
        <div
          className={cn(
            "rounded-lg bg-muted/50 overflow-hidden",
            allRakaatInRoundCompleted && "opacity-60",
          )}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2.5 hover:bg-muted/70 transition-colors">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {roundIndex + 1}
              </span>
              <span className="text-sm font-medium text-foreground">
                {getRoundLabel()}
              </span>
              {allRakaatInRoundCompleted && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              )}
            </div>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="px-3 pb-3 space-y-2">
              {rakaatInRound.map((rakaat, idx) => {
                const rakaatKey = `${prayerAssignment.prayerId}-rakaat-${startRakaatIndex + idx}`;
                const rakaatCompleted = isRakaatCompleted(rakaatKey);
                const showAyahRange =
                  rakaat.startAyah !== rakaat.endAyah || rakaat.startAyah !== 1;

                return (
                  <div
                    key={rakaatKey}
                    className={cn(
                      "rounded-lg bg-card px-3 py-2 border border-border/50",
                      rakaatCompleted && "opacity-60",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleRakaatCheck(
                            rakaatKey,
                            prayerAssignment.prayerId,
                            totalRakaatForPrayer,
                            rakaat,
                            prayerAssignment.prayerName,
                          )
                        }
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all shrink-0",
                          rakaatCompleted
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-muted-foreground/30 hover:border-primary",
                        )}
                      >
                        {rakaatCompleted && <Check className="h-3 w-3" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            Rakaat {startRakaatIndex + idx + 1}
                          </span>
                          <p
                            className={cn(
                              "text-sm font-medium text-foreground truncate",
                              rakaatCompleted &&
                                "line-through text-muted-foreground",
                            )}
                          >
                            {rakaat.surahName}
                          </p>
                          {showAyahRange && (
                            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {rakaat.startAyah}-{rakaat.endAyah}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <AyahViewer
                      surahNumber={rakaat.surahNumber}
                      surahName={rakaat.surahName}
                      startAyah={rakaat.startAyah}
                      endAyah={rakaat.endAyah}
                    />
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  };

  const renderPrayerCard = (
    prayerAssignment: PrayerAssignment,
    idx: number,
    isCompleted: boolean,
  ) => {
    const totalPrayerRakaat = prayerAssignment.rakaatSurahs.length;
    const rounds = splitIntoRounds(totalPrayerRakaat);
    let rakaatIndex = 0;

    return (
      <div
        key={prayerAssignment.prayerId}
        className={cn(
          "animate-slide-up rounded-2xl bg-card p-4 shadow-card transition-all",
          isCompleted && "opacity-60",
        )}
        style={{ animationDelay: `${idx * 50}ms` }}
      >
        <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCompleted(prayerAssignment.prayerId)}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                isCompleted
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-muted-foreground/30 hover:border-primary",
              )}
            >
              {isCompleted && <Check className="h-4 w-4" />}
            </button>
            <h3
              className={cn(
                "font-semibold text-foreground",
                isCompleted && "line-through text-muted-foreground",
              )}
            >
              {prayerAssignment.prayerName}
            </h3>
          </div>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-xs font-medium",
              getCategoryColor(prayerAssignment.prayerId),
            )}
          >
            {totalPrayerRakaat} rakaat
          </span>
        </div>
        <div className="space-y-2">
          {rounds.map((roundSize, roundIdx) => {
            const component = renderRakaatRound(
              prayerAssignment,
              roundIdx,
              roundSize,
              rakaatIndex,
              isCompleted,
              totalPrayerRakaat,
            );
            rakaatIndex += roundSize;
            return component;
          })}
        </div>
      </div>
    );
  };

  const getAyahRangeText = (rakaat: RakaatSurah | null) => {
    if (!rakaat) return "";
    if (rakaat.startAyah === rakaat.endAyah) return `Ayat ${rakaat.startAyah}`;
    return `Ayat ${rakaat.startAyah}-${rakaat.endAyah}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Today's Schedule
          </h2>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Surah Pool</p>
          <p className="text-sm font-medium text-foreground">
            {totalCount - usedCount} / {totalCount}
          </p>
        </div>
      </div>

      {!assignment ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center shadow-card">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shuffle className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Ready to shuffle</p>
            <p className="text-sm text-muted-foreground">
              Generate today's Quran recitation plan
            </p>
          </div>
          <Button
            onClick={onShuffle}
            className="gradient-islamic w-full text-primary-foreground shadow-islamic hover:opacity-90"
          >
            <Shuffle className="mr-2 h-4 w-4" />
            Shuffle for Today
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "space-y-3 transition-opacity duration-300",
            isReshuffling && "opacity-50",
          )}
        >
          <div className="flex items-center justify-between rounded-xl bg-primary/5 px-4 py-2">
            <span className="text-sm text-muted-foreground">
              Total rakaat today
            </span>
            <span className="font-semibold text-primary">
              {totalRakaat} rakaat
            </span>
          </div>

          {/* To Do Prayers - Collapsible */}
          {pendingPrayers.length > 0 && (
            <Collapsible open={pendingOpen} onOpenChange={setPendingOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted/50 px-4 py-2 hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    To Do ({pendingPrayers.length})
                  </span>
                </div>
                {pendingOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-3 pt-3">
                  {pendingPrayers.map((prayerAssignment, idx) =>
                    renderPrayerCard(prayerAssignment, idx, false),
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Completed Section - Collapsible */}
          {completedPrayersList.length > 0 && (
            <Collapsible open={completedOpen} onOpenChange={setCompletedOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-emerald-500/10 px-4 py-2 hover:bg-emerald-500/20 transition-colors">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Completed ({completedPrayersList.length})
                  </span>
                </div>
                {completedOpen ? (
                  <ChevronUp className="h-4 w-4 text-emerald-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-emerald-600" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-3 pt-3">
                  {completedPrayersList.map((prayerAssignment, idx) =>
                    renderPrayerCard(prayerAssignment, idx, true),
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* All Completed Message */}
          {pendingPrayers.length === 0 && completedPrayersList.length > 0 && (
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-emerald-500/10 p-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              <p className="font-medium text-foreground">
                Masha'Allah! All prayers completed
              </p>
              <p className="text-sm text-muted-foreground">
                May Allah accept your ibadah
              </p>
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => {
              setIsReshuffling(true);
              setTimeout(() => {
                onReshuffle();
                setIsReshuffling(false);
              }, 400);
            }}
            disabled={isReshuffling}
            className="w-full"
          >
            <RotateCcw
              className={cn("mr-2 h-4 w-4", isReshuffling && "animate-spin")}
            />
            {isReshuffling ? "Shuffling..." : "Re-shuffle Today"}
          </Button>
        </div>
      )}

      {/* Recall Feedback Dialog */}
      <RecallFeedbackDialog
        open={feedbackDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setFeedbackDialog({
              open: false,
              rakaat: null,
              prayerName: "",
              rakaatKey: "",
            });
          }
        }}
        surahName={feedbackDialog.rakaat?.surahName || ""}
        ayahRange={getAyahRangeText(feedbackDialog.rakaat)}
        onRemembered={handleFeedbackRemembered}
        onForgot={handleFeedbackForgot}
      />
    </div>
  );
};

export default DailySchedule;
