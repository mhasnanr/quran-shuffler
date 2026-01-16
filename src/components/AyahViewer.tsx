import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useQuranApi, AyahWithTranslations } from '@/hooks/useQuranApi';
import { cn } from '@/lib/utils';

interface AyahViewerProps {
  surahNumber: number;
  surahName: string;
  startAyah: number;
  endAyah: number;
}

type TranslationLang = 'id' | 'en';

const AyahViewer = ({ surahNumber, surahName, startAyah, endAyah }: AyahViewerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ayahs, setAyahs] = useState<AyahWithTranslations[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [translationLang, setTranslationLang] = useState<TranslationLang>('id');
  const { fetchAyahs, loading, error } = useQuranApi();

  useEffect(() => {
    if (isOpen && !hasLoaded) {
      fetchAyahs(surahNumber, startAyah, endAyah).then((data) => {
        // Filter out bismillah from first ayat of most surahs (except Al-Fatihah and At-Taubah)
        const filteredData = data.map(ayah => {
          if (ayah.numberInSurah === 1 && surahNumber !== 1 && surahNumber !== 9) {
            // Universal regex to match any form of bismillah at the start
            // Matches: بسم followed by variations of الله الرحمن الرحيم with any diacritics
            const bismillahRegex = /^۞?\s*بِ?سْ?مِ?\s*[ٱا]?للَّ?هِ?\s*[ٱا]?لرَّ?حْ?مَ?[ٰـ]?نِ?\s*[ٱا]?لرَّ?حِ?يمِ?\s*/u;
            
            let cleanedArabic = ayah.arabic.replace(bismillahRegex, '').trim();
            
            // Fallback: if regex didn't work, try removing by detecting common starting words
            if (cleanedArabic === ayah.arabic && ayah.arabic.startsWith('بِسْمِ')) {
              // Find the end of bismillah by looking for الرحيم and removing everything before it plus the word
              const rahimIndex = ayah.arabic.indexOf('الرَّحِيمِ');
              if (rahimIndex !== -1) {
                cleanedArabic = ayah.arabic.slice(rahimIndex + 'الرَّحِيمِ'.length).trim();
              }
            }
            
            return { ...ayah, arabic: cleanedArabic || ayah.arabic };
          }
          return ayah;
        });
        setAyahs(filteredData);
        setHasLoaded(true);
      });
    }
  }, [isOpen, hasLoaded, surahNumber, startAyah, endAyah, fetchAyahs]);

  const isFullSurah = startAyah === 1 && endAyah === startAyah;

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted/50"
      >
        <span>
          {isFullSurah ? 'View Ayat' : `Ayat ${startAyah}-${endAyah}`}
        </span>
        {isOpen ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2 max-h-64 overflow-y-auto rounded-lg bg-card p-3 shadow-inner">
          {/* Translation Language Tabs */}
          <div className="flex gap-1 mb-3 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setTranslationLang('id')}
              className={cn(
                "flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-all",
                translationLang === 'id'
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Indonesia
            </button>
            <button
              onClick={() => setTranslationLang('en')}
              className={cn(
                "flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-all",
                translationLang === 'en'
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              English
            </button>
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
              {ayahs.map((ayah) => (
                <div key={ayah.numberInSurah} className="space-y-2 border-b border-border pb-3 last:border-0">
                  <div className="flex items-start justify-end gap-2">
                    <p className="font-arabic text-right text-xl leading-[2.2] text-foreground flex-1" dir="rtl">
                      {ayah.arabic}
                    </p>
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {ayah.numberInSurah}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {translationLang === 'id' ? ayah.indonesian : ayah.english}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AyahViewer;
