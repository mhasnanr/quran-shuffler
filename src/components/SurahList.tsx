import { getSurahsByJuz, surahs } from "@/data/quranData";
import { SurahChunkSelection } from "@/types/prayer";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Star,
  Maximize2,
  Minimize2,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SurahListProps {
  selectedJuz: number[];
  selectedChunks: SurahChunkSelection[];
  mandatoryChunks: string[];
  allPossibleChunks: SurahChunkSelection[];
  chunksEnabled: boolean;
  onToggleChunk: (chunkId: string) => void;
  onToggleMandatory: (chunkId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onIncludeAllAyahs: (surahNumber: number) => void;
  onRevertToChunks: (surahNumber: number) => void;
}

const SurahList = ({
  selectedJuz,
  selectedChunks,
  mandatoryChunks,
  allPossibleChunks,
  chunksEnabled,
  onToggleChunk,
  onToggleMandatory,
  onSelectAll,
  onDeselectAll,
  onIncludeAllAyahs,
  onRevertToChunks,
}: SurahListProps) => {
  const [expandedJuz, setExpandedJuz] = useState<number[]>(
    selectedJuz.length === 1 ? selectedJuz : [],
  );
  const [expandedSurahs, setExpandedSurahs] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter surahs based on search query
  const filterSurah = (surah: {
    name: string;
    arabicName: string;
    number: number;
  }) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      surah.name.toLowerCase().includes(query) ||
      surah.arabicName.includes(searchQuery) ||
      surah.number.toString() === query
    );
  };

  // Group chunks by surah
  const getChunksForSurah = (surahNumber: number) => {
    return allPossibleChunks.filter((c) => c.surahNumber === surahNumber);
  };

  const isChunkSelected = (chunkId: string) => {
    return selectedChunks.some((c) => c.id === chunkId);
  };

  const isChunkMandatory = (chunkId: string) => {
    return mandatoryChunks.includes(chunkId);
  };

  // Check if surah is included as full (single chunk with all ayat)
  const isSurahIncludedAsFull = (surahNumber: number) => {
    const surah = surahs.find((s) => s.number === surahNumber);
    if (!surah) return false;
    const fullChunkId = `${surahNumber}-1-${surah.verses}`;
    return selectedChunks.some((c) => c.id === fullChunkId);
  };

  const isSurahFullySelected = (surahNumber: number) => {
    const surahChunks = getChunksForSurah(surahNumber);
    return (
      surahChunks.every((c) => isChunkSelected(c.id)) ||
      isSurahIncludedAsFull(surahNumber)
    );
  };

  const isSurahPartiallySelected = (surahNumber: number) => {
    if (isSurahIncludedAsFull(surahNumber)) return false;
    const surahChunks = getChunksForSurah(surahNumber);
    const selectedCount = surahChunks.filter((c) =>
      isChunkSelected(c.id),
    ).length;
    return selectedCount > 0 && selectedCount < surahChunks.length;
  };

  const toggleJuzExpand = (juz: number) => {
    setExpandedJuz((prev) =>
      prev.includes(juz) ? prev.filter((n) => n !== juz) : [...prev, juz],
    );
  };

  const toggleSurahExpand = (surahNumber: number) => {
    setExpandedSurahs((prev) =>
      prev.includes(surahNumber)
        ? prev.filter((n) => n !== surahNumber)
        : [...prev, surahNumber],
    );
  };

  const toggleAllSurahChunks = (surahNumber: number) => {
    const surahChunks = getChunksForSurah(surahNumber);
    const allSelected = isSurahFullySelected(surahNumber);
    const isFullSurah = isSurahIncludedAsFull(surahNumber);

    // If surah is included as full, revert it first (this deselects it)
    if (isFullSurah) {
      onRevertToChunks(surahNumber);
      return;
    }

    surahChunks.forEach((chunk) => {
      const isSelected = isChunkSelected(chunk.id);
      if (allSelected && isSelected) {
        onToggleChunk(chunk.id);
      } else if (!allSelected && !isSelected) {
        onToggleChunk(chunk.id);
      }
    });
  };

  // When chunks are disabled, clicking surah should select it as full
  const handleSurahClick = (
    surahNumber: number,
    hasMultipleChunks: boolean,
  ) => {
    if (!chunksEnabled) {
      // When chunks disabled, toggle full surah
      if (isSurahIncludedAsFull(surahNumber)) {
        // Simply remove the full surah chunk by toggling it off
        const surah = surahs.find((s) => s.number === surahNumber);
        if (surah) {
          const fullChunkId = `${surahNumber}-1-${surah.verses}`;
          onToggleChunk(fullChunkId);
        }
      } else if (isSurahFullySelected(surahNumber)) {
        // Surah is selected via individual chunks, deselect all of them
        const surahChunks = getChunksForSurah(surahNumber);
        surahChunks.forEach((chunk) => {
          if (isChunkSelected(chunk.id)) {
            onToggleChunk(chunk.id);
          }
        });
      } else {
        onIncludeAllAyahs(surahNumber);
      }
    } else if (hasMultipleChunks) {
      toggleSurahExpand(surahNumber);
    } else {
      const surahChunks = getChunksForSurah(surahNumber);
      if (surahChunks.length > 0) {
        onToggleChunk(surahChunks[0].id);
      }
    }
  };

  const allSelected = selectedChunks.length === allPossibleChunks.length;

  // Get surahs for each selected juz
  const getSurahsForJuz = (juz: number) => {
    return surahs.filter(
      (surah) => surah.juz.includes(juz) && selectedJuz.includes(juz),
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Surahs ({selectedChunks.length} {chunksEnabled ? "chunks" : "surahs"})
        </h2>
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={allSelected}
            onCheckedChange={() =>
              allSelected ? onDeselectAll() : onSelectAll()
            }
          />
          <label
            htmlFor="select-all"
            className="text-xs text-muted-foreground cursor-pointer"
          >
            All
          </label>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search surah..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-8 h-9 text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="max-h-96 space-y-2 overflow-y-auto rounded-xl bg-card p-3 shadow-card">
        {selectedJuz.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            Select a Juz first
          </p>
        ) : searchQuery.trim() ? (
          // When searching, show flat list of matching surahs
          (() => {
            const allJuzSurahs = selectedJuz.flatMap((juz) =>
              surahs.filter((surah) => surah.juz.includes(juz)),
            );
            // Remove duplicates
            const uniqueSurahs = allJuzSurahs.filter(
              (surah, index, self) =>
                index === self.findIndex((s) => s.number === surah.number),
            );
            const filteredSurahs = uniqueSurahs.filter(filterSurah);

            if (filteredSurahs.length === 0) {
              return (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No surahs found
                </p>
              );
            }

            return filteredSurahs.map((surah) => {
              const surahChunks = getChunksForSurah(surah.number);
              const hasMultipleChunks = surahChunks.length > 1 && chunksEnabled;
              const isExpanded = expandedSurahs.includes(surah.number);
              const fullySelected = isSurahFullySelected(surah.number);
              const partiallySelected = isSurahPartiallySelected(surah.number);
              const isFullSurah = isSurahIncludedAsFull(surah.number);

              return (
                <div key={surah.number} className="rounded-lg overflow-hidden">
                  {/* Surah Header */}
                  <div
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-3 text-left transition-all duration-200 rounded-lg",
                      fullySelected || isFullSurah
                        ? "bg-primary/10 text-primary"
                        : partiallySelected
                          ? "bg-primary/5 text-foreground"
                          : "text-foreground hover:bg-muted",
                    )}
                  >
                    <button
                      onClick={() =>
                        handleSurahClick(surah.number, hasMultipleChunks)
                      }
                      className="flex flex-1 items-center gap-4"
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                          fullySelected || isFullSurah
                            ? "gradient-islamic text-primary-foreground"
                            : partiallySelected
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground",
                        )}
                      >
                        {surah.number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {surah.name}
                          </p>
                          {isFullSurah && (
                            <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-medium">
                              All {surah.verses} ayat
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                    <div className="flex items-center gap-1">
                      {(fullySelected || isFullSurah) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                </div>
              );
            });
          })()
        ) : (
          selectedJuz
            .sort((a, b) => a - b)
            .map((juz) => {
              const juzSurahs = getSurahsForJuz(juz);
              const isJuzExpanded = expandedJuz.includes(juz);

              return (
                <Collapsible
                  key={juz}
                  open={isJuzExpanded}
                  onOpenChange={() => toggleJuzExpand(juz)}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-primary/5 px-4 py-3 text-left hover:bg-primary/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full gradient-islamic text-primary-foreground text-xs font-bold">
                        {juz}
                      </span>
                      <span className="font-medium text-foreground">
                        Juz {juz}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({juzSurahs.length} surahs)
                      </span>
                    </div>
                    {isJuzExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>

                  <CollapsibleContent className="pl-4 pt-2 space-y-1">
                    {juzSurahs.map((surah) => {
                      const surahChunks = getChunksForSurah(surah.number);
                      const hasMultipleChunks =
                        surahChunks.length > 1 && chunksEnabled;
                      const isExpanded = expandedSurahs.includes(surah.number);
                      const fullySelected = isSurahFullySelected(surah.number);
                      const partiallySelected = isSurahPartiallySelected(
                        surah.number,
                      );
                      const isFullSurah = isSurahIncludedAsFull(surah.number);

                      return (
                        <div
                          key={surah.number}
                          className="rounded-lg overflow-hidden"
                        >
                          {/* Surah Header */}
                          <div
                            className={cn(
                              "flex w-full items-center justify-between px-4 py-3 text-left transition-all duration-200 rounded-lg",
                              fullySelected || isFullSurah
                                ? "bg-primary/10 text-primary"
                                : partiallySelected
                                  ? "bg-primary/5 text-foreground"
                                  : "text-foreground hover:bg-muted",
                            )}
                          >
                            <button
                              onClick={() =>
                                handleSurahClick(
                                  surah.number,
                                  hasMultipleChunks,
                                )
                              }
                              className="flex flex-1 items-center gap-4"
                            >
                              <span
                                className={cn(
                                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                                  fullySelected || isFullSurah
                                    ? "gradient-islamic text-primary-foreground"
                                    : partiallySelected
                                      ? "bg-primary/20 text-primary"
                                      : "bg-muted text-muted-foreground",
                                )}
                              >
                                {surah.number}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium truncate">
                                    {surah.name}
                                  </p>
                                  {chunksEnabled &&
                                    hasMultipleChunks &&
                                    !isFullSurah && (
                                      <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                        {surah.verses} ayat
                                      </span>
                                    )}
                                  {isFullSurah && (
                                    <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-medium">
                                      All {surah.verses} ayat
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>

                            <div className="flex items-center gap-1">
                              {/* Star button for single-chunk surahs or when chunks disabled */}
                              {((!chunksEnabled &&
                                (fullySelected || isFullSurah)) ||
                                (!hasMultipleChunks &&
                                  isChunkSelected(surahChunks[0]?.id))) &&
                                surahChunks[0] && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onToggleMandatory(surahChunks[0].id);
                                    }}
                                  >
                                    <Star
                                      className={cn(
                                        "h-4 w-4",
                                        isChunkMandatory(surahChunks[0].id)
                                          ? "fill-amber-400 text-amber-400"
                                          : "text-muted-foreground",
                                      )}
                                    />
                                  </Button>
                                )}

                              {chunksEnabled && hasMultipleChunks && (
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
                                    <div
                                      className={cn(
                                        "h-3.5 w-3.5 rounded-sm border",
                                        partiallySelected
                                          ? "bg-primary/50 border-primary"
                                          : "border-muted-foreground",
                                      )}
                                    />
                                  )}
                                </Button>
                              )}

                              {chunksEnabled && hasMultipleChunks ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() =>
                                    toggleSurahExpand(surah.number)
                                  }
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              ) : (
                                (fullySelected || isFullSurah) && (
                                  <Check className="h-4 w-4 text-primary" />
                                )
                              )}
                            </div>
                          </div>

                          {/* Chunks (for multi-chunk surahs when chunks enabled) */}
                          {chunksEnabled && hasMultipleChunks && isExpanded && (
                            <div className="pl-12 pr-4 py-2 space-y-1.5 bg-muted/30">
                              {/* Include All / Revert Button */}
                              {isFullSurah ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full mb-2 text-xs border-primary text-primary"
                                  onClick={() => onRevertToChunks(surah.number)}
                                >
                                  <Minimize2 className="h-3 w-3 mr-1.5" />
                                  Split Back to Chunks
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full mb-2 text-xs"
                                  onClick={() =>
                                    onIncludeAllAyahs(surah.number)
                                  }
                                >
                                  <Maximize2 className="h-3 w-3 mr-1.5" />
                                  Include All {surah.verses} Ayat as One
                                </Button>
                              )}
                              {/* Show ayat list when included as full OR show chunk list */}
                              {isFullSurah ? (
                                <div className="text-xs text-primary bg-primary/5 rounded-md px-3 py-2">
                                  All {surah.verses} ayat included as a single
                                  recitation
                                </div>
                              ) : (
                                surahChunks.map((chunk) => {
                                  const selected = isChunkSelected(chunk.id);
                                  const mandatory = isChunkMandatory(chunk.id);
                                  return (
                                    <div
                                      key={chunk.id}
                                      className={cn(
                                        "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition-all",
                                        selected
                                          ? "bg-primary/10 text-primary"
                                          : "bg-card hover:bg-muted text-foreground",
                                      )}
                                    >
                                      <button
                                        onClick={() => onToggleChunk(chunk.id)}
                                        className="flex-1 text-left"
                                      >
                                        <span>
                                          Ayat {chunk.startAyah} -{" "}
                                          {chunk.endAyah}
                                        </span>
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
                                            <Star
                                              className={cn(
                                                "h-3.5 w-3.5",
                                                mandatory
                                                  ? "fill-amber-400 text-amber-400"
                                                  : "text-muted-foreground",
                                              )}
                                            />
                                          </Button>
                                        )}
                                        {selected && (
                                          <Check className="h-4 w-4 text-primary" />
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            })
        )}
      </div>
    </div>
  );
};

export default SurahList;
