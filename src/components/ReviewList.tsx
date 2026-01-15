import { ReviewItem } from '@/types/review';
import { Trash2, CheckCircle2, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AyahViewer from './AyahViewer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

interface ReviewListProps {
  items: ReviewItem[];
  onRemove: (id: string) => void;
  onComplete: (id: string) => void;
}

const ReviewList = ({ items, onRemove, onComplete }: ReviewListProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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
                const showRange = chunk.startAyah !== chunk.endAyah || chunk.startAyah !== 1;
                
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
                            onClick={() => onComplete(chunk.id)}
                            className="h-8 w-8 p-0 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                            title="Mark as reviewed"
                          >
                            <CheckCircle2 className="h-4 w-4" />
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
                          <AyahViewer
                            surahNumber={chunk.surahNumber}
                            surahName={chunk.surahName}
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
  );
};

export default ReviewList;
