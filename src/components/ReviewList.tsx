import { ReviewItem } from '@/types/review';
import { Trash2, CheckCircle2, BookOpen, ChevronDown, ChevronUp, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import FullscreenAyahViewer from './FullscreenAyahViewer';
import { useQuranApi, AyahWithTranslations } from '@/hooks/useQuranApi';
import { Loader2 } from 'lucide-react';

interface ReviewListProps {
  items: ReviewItem[];
  onRemove: (id: string) => void;
  onComplete: (id: string) => void;
}

type TranslationLang = 'id' | 'en';

interface InlineAyahViewerProps {
  surahNumber: number;
  startAyah: number;
  endAyah: number;
}

const InlineAyahViewer = ({ surahNumber, startAyah, endAyah }: InlineAyahViewerProps) => {
  const [ayahs, setAyahs] = useState<AyahWithTranslations[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [translationLang, setTranslationLang] = useState<TranslationLang>('id');
  const { fetchAyahs, loading, error } = useQuranApi();

  useState(() => {
    if (!hasLoaded) {
      fetchAyahs(surahNumber, startAyah, endAyah).then((data) => {
        const filteredData = data.map(ayah => {
          if (ayah.numberInSurah === 1 && surahNumber !== 1 && surahNumber !== 9) {
            const bismillahRegex = /^۞?\s*بِ?سْ?مِ?\s*[ٱا]?للَّ?هِ?\s*[ٱا]?لرَّ?حْ?مَ?[ٰـ]?نِ?\s*[ٱا]?لرَّ?حِ?يمِ?\s*/u;
            let cleanedArabic = ayah.arabic.replace(bismillahRegex, '').trim();
            if (cleanedArabic === ayah.arabic && ayah.arabic.startsWith('بِسْمِ')) {
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
  });

  return (
    <div className="mt-2">
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
        <div className="space-y-4 max-h-48 overflow-y-auto">
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
  );
};

const ReviewList = ({ items, onRemove, onComplete }: ReviewListProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [fullscreenItem, setFullscreenItem] = useState<ReviewItem | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center shadow-card">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <div>
          <p className="font-medium text-foreground">No items to review</p>
          <p className="text-sm text-muted-foreground">
            Great job! You're remembering everything well
          </p>
        </div>
      </div>
    );
  }

  // Group items by surah
  const groupedBySurah = items.reduce((acc, item) => {
    const key = item.surahNumber;
    if (!acc[key]) {
      acc[key] = {
        surahNumber: item.surahNumber,
        surahName: item.surahName,
        arabicName: item.arabicName,
        chunks: [],
      };
    }
    acc[key].chunks.push(item);
    return acc;
  }, {} as Record<number, { surahNumber: number; surahName: string; arabicName: string; chunks: ReviewItem[] }>);

  const sortedSurahs = Object.values(groupedBySurah).sort((a, b) => a.surahNumber - b.surahNumber);

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Review List</h2>
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'} to review
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
            <BookOpen className="h-5 w-5 text-amber-500" />
          </div>
        </div>

        <div className="space-y-3">
          {sortedSurahs.map(surah => (
            <div 
              key={surah.surahNumber}
              className="rounded-2xl bg-card p-4 shadow-card"
            >
              <div className="mb-3 flex items-center gap-3 border-b border-border pb-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-600">
                  {surah.surahNumber}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{surah.surahName}</h3>
                  <p className="font-arabic text-sm text-muted-foreground">{surah.arabicName}</p>
                </div>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
                  {surah.chunks.length} {surah.chunks.length === 1 ? 'chunk' : 'chunks'}
                </span>
              </div>

              <div className="space-y-2">
                {surah.chunks.map(chunk => {
                  const isExpanded = expandedItems.includes(chunk.id);
                  
                  return (
                    <Collapsible 
                      key={chunk.id} 
                      open={isExpanded} 
                      onOpenChange={() => toggleExpanded(chunk.id)}
                    >
                      <div className={cn(
                        "rounded-lg bg-muted/50 overflow-hidden"
                      )}>
                        <div className="flex items-center justify-between px-3 py-2.5">
                          <CollapsibleTrigger className="flex flex-1 items-center gap-2 text-left">
                            <span className="text-sm font-medium text-foreground">
                              Ayat {chunk.startAyah}
                              {chunk.startAyah !== chunk.endAyah && `-${chunk.endAyah}`}
                            </span>
                            {chunk.prayerName && (
                              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                from {chunk.prayerName}
                              </span>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground ml-auto" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
                            )}
                          </CollapsibleTrigger>
                          
                          <div className="flex items-center gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFullscreenItem(chunk)}
                              className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                              title="View fullscreen"
                            >
                              <Maximize2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemove(chunk.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Remove from review"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <CollapsibleContent>
                          <div className="px-3 pb-3">
                            <InlineAyahViewer
                              surahNumber={chunk.surahNumber}
                              startAyah={chunk.startAyah}
                              endAyah={chunk.endAyah}
                            />
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {fullscreenItem && (
        <FullscreenAyahViewer
          open={!!fullscreenItem}
          onOpenChange={(open) => !open && setFullscreenItem(null)}
          surahNumber={fullscreenItem.surahNumber}
          surahName={fullscreenItem.surahName}
          arabicName={fullscreenItem.arabicName}
          startAyah={fullscreenItem.startAyah}
          endAyah={fullscreenItem.endAyah}
        />
      )}
    </>
  );
};

export default ReviewList;
