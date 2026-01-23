import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuranApi, AyahWithTranslations } from "@/hooks/useQuranApi";
import { cn } from "@/lib/utils";

interface RecallFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  surahNumber: number;
  surahName: string;
  startAyah: number;
  endAyah: number;
  ayahRange: string;
  onRemembered: () => void;
  onForgot: (forgottenAyahs: number[]) => void;
  showTranslation: boolean;
}

const RecallFeedbackDialog = ({
  open,
  onOpenChange,
  surahNumber,
  surahName,
  startAyah,
  endAyah,
  ayahRange,
  onRemembered,
  onForgot,
  showTranslation,
}: RecallFeedbackDialogProps) => {
  const [step, setStep] = useState<"feedback" | "select">("feedback");
  const [ayahs, setAyahs] = useState<AyahWithTranslations[]>([]);
  const [selectedAyahs, setSelectedAyahs] = useState<Set<number>>(new Set());
  const { fetchAyahs, loading } = useQuranApi();

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setStep("feedback");
      setSelectedAyahs(new Set());
      setAyahs([]);
    }
  }, [open]);

  const handleNeedReview = async () => {
    // Fetch ayahs for step 2
    const data = await fetchAyahs(surahNumber, startAyah, endAyah);
    setAyahs(data);
    setStep("select");
  };

  const toggleAyah = (ayahNumber: number) => {
    setSelectedAyahs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ayahNumber)) {
        newSet.delete(ayahNumber);
      } else {
        newSet.add(ayahNumber);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    onForgot(Array.from(selectedAyahs));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          step === "feedback"
            ? "max-w-sm"
            : "max-w-lg max-h-[80vh] flex flex-col p-0 gap-0",
        )}
      >
        {step === "feedback" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">How did it go?</DialogTitle>
              <DialogDescription className="text-center pt-3">
                <span className="font-medium text-foreground">{surahName}</span>
                {ayahRange && (
                  <span className="text-muted-foreground"> ({ayahRange})</span>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-2">
              <Button
                variant="outline"
                onClick={handleNeedReview}
                className="flex-1 flex items-center justify-center border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 hover:text-amber-700"
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Need Review
              </Button>
              <Button
                onClick={onRemembered}
                className="flex-1 flex items-center justify-center bg-emerald-500 text-white hover:bg-emerald-600"
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Remembered
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="p-6 pb-4 border-b shrink-0">
              <DialogTitle>Which ayahs do you need to review?</DialogTitle>
              <DialogDescription className="pt-1">
                Tap on ayahs that you forgot. They will be highlighted in yellow
                during review.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : (
                ayahs.map((ayah) => {
                  const isSelected = selectedAyahs.has(ayah.numberInSurah);
                  return (
                    <button
                      key={ayah.numberInSurah}
                      onClick={() => toggleAyah(ayah.numberInSurah)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-all",
                        isSelected
                          ? "bg-amber-200/50 dark:bg-amber-900/30 border-amber-500/50"
                          : "bg-card border-border hover:bg-muted/50",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {ayah.numberInSurah}
                        </span>
                        <div className="flex-1 space-y-1">
                          <p
                            className="font-arabic text-right text-base leading-relaxed"
                            dir="rtl"
                          >
                            {ayah.arabic}
                          </p>
                          {showTranslation && (
                            <p className="text-xs text-muted-foreground">
                              {ayah.indonesian}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
            <div className="flex gap-2 p-6 pt-4 border-t shrink-0">
              <Button
                variant="outline"
                onClick={() => setStep("feedback")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-amber-500 hover:bg-amber-600"
              >
                Save
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecallFeedbackDialog;
