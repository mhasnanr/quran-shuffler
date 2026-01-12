import { getSurahsByJuz } from '@/data/quranData';
import { SurahChunkSelection } from '@/types/prayer';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SurahListProps {
  selectedJuz: number[];
  selectedChunks: SurahChunkSelection[];
  mandatoryChunks: string[];
  allPossibleChunks: SurahChunkSelection[];
  onToggleChunk: (chunkId: string) => void;
  onToggleMandatory: (chunkId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const SurahList = ({ 
  selectedJuz, 
  selectedChunks, 
  mandatoryChunks,
  allPossibleChunks,
  onToggleChunk,
  onToggleMandatory,
  onSelectAll, 
  onDeselectAll 
}: SurahListProps) => {
  const [expandedSurahs, setExpandedSurahs] = useState<number[]>([]);
  const availableSurahs = getSurahsByJuz(selectedJuz);
  
  // Group chunks by surah
  const getChunksForSurah = (surahNumber: number) => {
    return allPossibleChunks.filter(c => c.surahNumber === surahNumber);
  };

  const isChunkSelected = (chunkId: string) => {
    return selectedChunks.some(c => c.id === chunkId);
  };

  const isChunkMandatory = (chunkId: string) => {
    return mandatoryChunks.includes(chunkId);
  };

  const isSurahFullySelected = (surahNumber: number) => {
    const surahChunks = getChunksForSurah(surahNumber);
    return surahChunks.every(c => isChunkSelected(c.id));
  };

  const isSurahPartiallySelected = (surahNumber: number) => {
    const surahChunks = getChunksForSurah(surahNumber);
    const selectedCount = surahChunks.filter(c => isChunkSelected(c.id)).length;
    return selectedCount > 0 && selectedCount < surahChunks.length;
  };

  const toggleSurahExpand = (surahNumber: number) => {
    setExpandedSurahs(prev => 
      prev.includes(surahNumber) 
        ? prev.filter(n => n !== surahNumber)
        : [...prev, surahNumber]
    );
  };

  const toggleAllSurahChunks = (surahNumber: number) => {
    const surahChunks = getChunksForSurah(surahNumber);
    const allSelected = isSurahFullySelected(surahNumber);
    
    surahChunks.forEach(chunk => {
      const isSelected = isChunkSelected(chunk.id);
      if (allSelected && isSelected) {
        onToggleChunk(chunk.id);
      } else if (!allSelected && !isSelected) {
        onToggleChunk(chunk.id);
      }
    });
  };

  const allSelected = selectedChunks.length === allPossibleChunks.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Surahs ({selectedChunks.length} chunks selected)
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className="h-7 text-xs"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </Button>
      </div>
      
      <div className="max-h-80 space-y-2 overflow-y-auto rounded-xl bg-card p-3 shadow-card">
        {availableSurahs.map((surah) => {
          const surahChunks = getChunksForSurah(surah.number);
          const hasMultipleChunks = surahChunks.length > 1;
          const isExpanded = expandedSurahs.includes(surah.number);
          const fullySelected = isSurahFullySelected(surah.number);
          const partiallySelected = isSurahPartiallySelected(surah.number);

          return (
            <div key={surah.number} className="rounded-lg overflow-hidden">
              {/* Surah Header */}
              <div
                className={cn(
                  "flex w-full items-center justify-between px-4 py-3 text-left transition-all duration-200 rounded-lg",
                  fullySelected
                    ? "bg-primary/10 text-primary"
                    : partiallySelected
                    ? "bg-primary/5 text-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <button
                  onClick={() => hasMultipleChunks ? toggleSurahExpand(surah.number) : onToggleChunk(surahChunks[0].id)}
                  className="flex flex-1 items-center gap-4"
                >
                  <span className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                    fullySelected
                      ? "gradient-islamic text-primary-foreground"
                      : partiallySelected
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {surah.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{surah.name}</p>
                      {hasMultipleChunks && (
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {surah.verses} ayat
                        </span>
                      )}
                    </div>
                  </div>
                </button>
                
                <div className="flex items-center gap-1">
                  {/* Star button for single-chunk surahs */}
                  {!hasMultipleChunks && isChunkSelected(surahChunks[0].id) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleMandatory(surahChunks[0].id);
                      }}
                    >
                      <Star className={cn(
                        "h-4 w-4",
                        isChunkMandatory(surahChunks[0].id) 
                          ? "fill-amber-400 text-amber-400" 
                          : "text-muted-foreground"
                      )} />
                    </Button>
                  )}
                  
                  {hasMultipleChunks && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAllSurahChunks(surah.number);
                      }}
                    >
                      {fullySelected ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <div className={cn(
                          "h-3.5 w-3.5 rounded-sm border",
                          partiallySelected ? "bg-primary/50 border-primary" : "border-muted-foreground"
                        )} />
                      )}
                    </Button>
                  )}
                  
                  {hasMultipleChunks ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toggleSurahExpand(surah.number)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  ) : (
                    fullySelected && <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>

              {/* Chunks (for multi-chunk surahs) */}
              {hasMultipleChunks && isExpanded && (
                <div className="pl-12 pr-4 py-2 space-y-1.5 bg-muted/30">
                  {surahChunks.map((chunk) => {
                    const selected = isChunkSelected(chunk.id);
                    const mandatory = isChunkMandatory(chunk.id);
                    return (
                      <div
                        key={chunk.id}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition-all",
                          selected
                            ? "bg-primary/10 text-primary"
                            : "bg-card hover:bg-muted text-foreground"
                        )}
                      >
                        <button
                          onClick={() => onToggleChunk(chunk.id)}
                          className="flex-1 text-left"
                        >
                          <span>Ayah {chunk.startAyah} - {chunk.endAyah}</span>
                        </button>
                        <div className="flex items-center gap-1">
                          {selected && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleMandatory(chunk.id);
                              }}
                            >
                              <Star className={cn(
                                "h-3.5 w-3.5",
                                mandatory 
                                  ? "fill-amber-400 text-amber-400" 
                                  : "text-muted-foreground"
                              )} />
                            </Button>
                          )}
                          {selected && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SurahList;
