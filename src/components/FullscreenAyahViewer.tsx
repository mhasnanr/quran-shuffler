import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useQuranApi, AyahWithTranslations } from "@/hooks/useQuranApi";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BISMILLAH,
  BISMILLAH_ENGLISH,
  BISMILLAH_INDONESIAN,
} from "@/data/quranAyat";

interface FullscreenAyahViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  surahNumber: number;
  surahName: string;
  arabicName: string;
  startAyah: number;
  endAyah: number;
}

type TranslationLang = "id" | "en";

const FullscreenAyahViewer = ({
  open,
  onOpenChange,
  surahNumber,
  surahName,
  arabicName,
  startAyah,
  endAyah,
}: FullscreenAyahViewerProps) => {
  const [ayahs, setAyahs] = useState<AyahWithTranslations[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [translationLang, setTranslationLang] = useState<TranslationLang>("id");
  const { fetchAyahs, loading, error } = useQuranApi();

  // Show bismillah separately for surahs other than Al-Fatihah (1) and At-Taubah (9)
  const showBismillah =
    startAyah === 1 && surahNumber !== 1 && surahNumber !== 9;

  useEffect(() => {
    if (open && !hasLoaded) {
      fetchAyahs(surahNumber, startAyah, endAyah).then((data) => {
        setAyahs(data);
        setHasLoaded(true);
      });
    }
  }, [open, hasLoaded, surahNumber, startAyah, endAyah, fetchAyahs]);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setHasLoaded(false);
      setAyahs([]);
    }
  }, [open]);

  const ayahRange =
    startAyah === endAyah
      ? `Ayat ${startAyah}`
      : `Ayat ${startAyah}-${endAyah}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 pb-2 border-b shrink-0">
          <div className="flex items-center justify-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full gradient-islamic text-primary-foreground text-sm font-bold">
              {surahNumber}
            </span>
            <div className="text-left">
              <DialogTitle className="text-lg font-semibold text-left">
                {surahName}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">{ayahRange}</p>
            </div>
          </div>
        </DialogHeader>

        {/* Translation Language Tabs */}
        <div className="px-4 py-2 border-b shrink-0">
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <p className="text-center text-sm text-destructive">{error}</p>
          )}

          {!loading && !error && ayahs.length > 0 && (
            <div className="space-y-6">
              {/* Bismillah - shown separately at top */}
              {showBismillah && (
                <div className="space-y-3 border-b border-border pb-4 bg-primary/5 rounded-lg p-4 -mx-1">
                  <p
                    className="font-arabic text-center text-2xl leading-[2.4] text-primary"
                    dir="rtl"
                  >
                    {BISMILLAH}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground text-center">
                    {translationLang === "id"
                      ? BISMILLAH_INDONESIAN
                      : BISMILLAH_ENGLISH}
                  </p>
                </div>
              )}

              {ayahs.map((ayah) => (
                <div
                  key={ayah.numberInSurah}
                  className="space-y-3 border-b border-border pb-4 last:border-0"
                >
                  <div className="flex items-start justify-end gap-3">
                    <p
                      className="font-arabic text-right text-2xl leading-[2.4] text-foreground flex-1"
                      dir="rtl"
                    >
                      {ayah.arabic}
                    </p>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {ayah.numberInSurah}
                    </span>
                  </div>

                  <div className="text-left">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {translationLang === "id"
                        ? ayah.indonesian
                        : ayah.english}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullscreenAyahViewer;
