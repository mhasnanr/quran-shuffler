import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Maximize2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useQuranApi, AyahWithTranslations } from "@/hooks/useQuranApi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import FullscreenAyahViewer from "./FullscreenAyahViewer";
import { surahs } from "@/data/quranData";
import {
  BISMILLAH,
  BISMILLAH_ENGLISH,
  BISMILLAH_INDONESIAN,
} from "@/data/quranAyat";

interface AyahViewerProps {
  surahNumber: number;
  surahName: string;
  startAyah: number;
  endAyah: number;
  showTranslation?: boolean;
  forgottenAyahs?: number[]; // Array of ayah numbers that were forgotten and need review
}

type TranslationLang = "id" | "en";

const AyahViewer = ({
  surahNumber,
  surahName,
  startAyah,
  endAyah,
  showTranslation = true,
  forgottenAyahs = [],
}: AyahViewerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ayahs, setAyahs] = useState<AyahWithTranslations[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [translationLang, setTranslationLang] = useState<TranslationLang>("id");
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [hideAyahText, setHideAyahText] = useState(false);
  const [revealedAyahs, setRevealedAyahs] = useState<Set<number>>(new Set());
  const { fetchAyahs, loading, error } = useQuranApi();

  // Toggle individual ayah visibility
  const toggleAyahVisibility = (ayahNumber: number) => {
    setRevealedAyahs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ayahNumber)) {
        newSet.delete(ayahNumber);
      } else {
        newSet.add(ayahNumber);
      }
      return newSet;
    });
  };

  // Check if ayah should be blurred (XOR logic: global hide XOR individually toggled)
  // - Global hide ON + not in set = blurred
  // - Global hide ON + in set = visible (revealed)
  // - Global hide OFF + not in set = visible
  // - Global hide OFF + in set = blurred (manually hidden)
  const isAyahBlurred = (ayahNumber: number) => {
    const isToggled = revealedAyahs.has(ayahNumber);
    return hideAyahText ? !isToggled : isToggled;
  };

  // Reset toggled ayahs when global hide mode changes
  useEffect(() => {
    setRevealedAyahs(new Set());
  }, [hideAyahText]);

  const surah = surahs.find((s) => s.number === surahNumber);
  const arabicName = surah?.arabicName || "";

  // Show bismillah separately for surahs other than Al-Fatihah (1) and At-Taubah (9)
  const showBismillah =
    startAyah === 1 && surahNumber !== 1 && surahNumber !== 9;

  // Check if any ayahs in this range were forgotten
  const hasForgottenAyahs = forgottenAyahs.length > 0;

  // Helper to check if a specific ayah was forgotten
  const isAyahForgotten = (ayahNumber: number) => {
    return forgottenAyahs.includes(ayahNumber);
  };

  useEffect(() => {
    if (isOpen && !hasLoaded) {
      fetchAyahs(surahNumber, startAyah, endAyah).then((data) => {
        setAyahs(data);
        setHasLoaded(true);
      });
    }
  }, [isOpen, hasLoaded, surahNumber, startAyah, endAyah, fetchAyahs]);

  const isFullSurah = startAyah === 1 && endAyah === startAyah;

  return (
    <>
      <div className="mt-2">
        <div className="flex gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex flex-1 items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors",
              hasForgottenAyahs
                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-800"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
            )}
          >
            <span>
              {isFullSurah ? "View Ayat" : `Ayat ${startAyah}-${endAyah}`}
              {hasForgottenAyahs && " ⭐"}
            </span>
            {isOpen ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullscreen(true)}
            className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
            title="View fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {isOpen && (
          <div className="mt-2 max-h-64 overflow-y-auto rounded-lg bg-card p-3 shadow-inner">
            {/* Controls Row */}
            <div className="flex gap-2 mb-3">
              {/* Translation Language Tabs */}
              {showTranslation && (
                <div className="flex gap-1 flex-1 p-1 bg-muted rounded-lg">
                  <button
                    onClick={() => setTranslationLang("id")}
                    className={cn(
                      "flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-all",
                      translationLang === "id"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Indonesia
                  </button>
                  <button
                    onClick={() => setTranslationLang("en")}
                    className={cn(
                      "flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-all",
                      translationLang === "en"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    English
                  </button>
                </div>
              )}
              {/* Murojaah Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHideAyahText(!hideAyahText)}
                className={cn(
                  "h-8 gap-1.5 text-xs",
                  hideAyahText &&
                    "bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/20",
                )}
                title={
                  hideAyahText
                    ? "Show ayah text"
                    : "Hide ayah text for murojaah"
                }
              >
                {hideAyahText ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">
                  {hideAyahText ? "Show" : "Hide"}
                </span>
              </Button>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}

            {error && (
              <p className="text-center text-xs text-destructive">{error}</p>
            )}

            {!loading && !error && ayahs.length > 0 && (
              <div className="space-y-4">
                {/* Bismillah - shown separately at top */}
                {showBismillah && (
                  <div className="space-y-2 border-b border-border pb-3 bg-primary/5 rounded-lg p-3 -mx-1">
                    <p
                      className={cn(
                        "font-arabic text-center text-xl leading-[2.2] text-primary transition-all cursor-pointer",
                        isAyahBlurred(0) && "blur-md select-none",
                      )}
                      dir="rtl"
                      onClick={() => toggleAyahVisibility(0)}
                    >
                      {BISMILLAH}
                    </p>
                    {showTranslation && (
                      <p className="text-xs leading-relaxed text-muted-foreground text-center">
                        {translationLang === "id"
                          ? BISMILLAH_INDONESIAN
                          : BISMILLAH_ENGLISH}
                      </p>
                    )}
                  </div>
                )}

                {ayahs.map((ayah) => (
                  <div
                    key={ayah.numberInSurah}
                    className={cn(
                      "space-y-2 border-b border-border pb-3 last:border-0 rounded-lg p-2 -mx-1 transition-colors",
                      isAyahForgotten(ayah.numberInSurah) &&
                        "bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800"
                    )}
                  >
                    <div className="flex items-start justify-end gap-2">
                      <p
                        className={cn(
                          "font-arabic text-right text-xl leading-[2.2] text-foreground flex-1 transition-all cursor-pointer",
                          isAyahBlurred(ayah.numberInSurah) &&
                            "blur-md select-none",
                        )}
                        dir="rtl"
                        onClick={() => toggleAyahVisibility(ayah.numberInSurah)}
                      >
                        {ayah.arabic}
                      </p>
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {ayah.numberInSurah}
                      </span>
                    </div>

                    {showTranslation && (
                      <div className="text-left">
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {translationLang === "id"
                            ? ayah.indonesian
                            : ayah.english}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <FullscreenAyahViewer
        open={showFullscreen}
        onOpenChange={setShowFullscreen}
        surahNumber={surahNumber}
        surahName={surahName}
        startAyah={startAyah}
        endAyah={endAyah}
        showTranslation={showTranslation}
        forgottenAyahs={forgottenAyahs}
      />
    </>
  );
};

export default AyahViewer;
