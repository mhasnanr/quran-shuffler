import { surahs, getJuzList } from "@/data/quranData";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MurojaahSurahSelectorProps {
  selectedSurahs: number[];
  onToggleSurah: (surahNumber: number) => void;
  onSelectAllJuz: (juzNumber: number) => void;
  onDeselectAllJuz: (juzNumber: number) => void;
}

const MurojaahSurahSelector = ({
  selectedSurahs,
  onToggleSurah,
  onSelectAllJuz,
  onDeselectAllJuz,
}: MurojaahSurahSelectorProps) => {
  const [expandedJuz, setExpandedJuz] = useState<number[]>([30]);
  const [searchQuery, setSearchQuery] = useState("");

  const juzList = getJuzList();

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

  const toggleJuz = (juzNumber: number) => {
    setExpandedJuz((prev) =>
      prev.includes(juzNumber)
        ? prev.filter((j) => j !== juzNumber)
        : [...prev, juzNumber],
    );
  };

  const isSurahSelected = (surahNumber: number) => {
    return selectedSurahs.includes(surahNumber);
  };

  const getSurahsForJuz = (juzNumber: number) => {
    return surahs.filter((s) => s.juz.includes(juzNumber));
  };

  const isJuzFullySelected = (juzNumber: number) => {
    const juzSurahs = getSurahsForJuz(juzNumber);
    return juzSurahs.every((s) => isSurahSelected(s.number));
  };

  const isJuzPartiallySelected = (juzNumber: number) => {
    const juzSurahs = getSurahsForJuz(juzNumber);
    const selectedCount = juzSurahs.filter((s) => isSurahSelected(s.number)).length;
    return selectedCount > 0 && selectedCount < juzSurahs.length;
  };

  // Filter juz that have matching surahs
  const filteredJuzList = searchQuery.trim()
    ? juzList.filter((juz) => getSurahsForJuz(juz).some(filterSurah))
    : juzList;

  return (
    <div className="rounded-xl bg-card p-4 shadow-card">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Select Surahs
          </h3>
          <p className="text-xs text-muted-foreground">
            {selectedSurahs.length} selected
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, Arabic, or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
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
      </div>

      {/* Juz List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredJuzList.map((juzNumber) => {
          const juzSurahs = getSurahsForJuz(juzNumber).filter(filterSurah);
          if (juzSurahs.length === 0) return null;

          const isExpanded = expandedJuz.includes(juzNumber);
          const isFullySelected = isJuzFullySelected(juzNumber);
          const isPartiallySelected = isJuzPartiallySelected(juzNumber);

          return (
            <Collapsible
              key={juzNumber}
              open={isExpanded}
              onOpenChange={() => toggleJuz(juzNumber)}
            >
              <div className="rounded-lg border border-border bg-background/50">
                <div className="flex items-center justify-between p-3">
                  <CollapsibleTrigger className="flex flex-1 items-center gap-2">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">Juz {juzNumber}</span>
                    <span className="text-xs text-muted-foreground">
                      ({juzSurahs.length} surahs)
                    </span>
                  </CollapsibleTrigger>

                  <div className="flex items-center gap-2">
                    {isFullySelected ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeselectAllJuz(juzNumber);
                        }}
                        className="h-7 px-2 text-xs"
                      >
                        Deselect All
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAllJuz(juzNumber);
                        }}
                        className="h-7 px-2 text-xs"
                      >
                        Select All
                      </Button>
                    )}
                  </div>
                </div>

                <CollapsibleContent>
                  <div className="border-t border-border px-3 pb-2">
                    {juzSurahs.map((surah) => {
                      const isSelected = isSurahSelected(surah.number);

                      return (
                        <div
                          key={surah.number}
                          onClick={() => onToggleSurah(surah.number)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg p-2 cursor-pointer transition-colors hover:bg-muted/50",
                            isSelected && "bg-primary/5",
                          )}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => onToggleSurah(surah.number)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs text-muted-foreground">
                                {surah.number}.
                              </span>
                              <span className="text-sm font-medium truncate">
                                {surah.name}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 font-arabic">
                              {surah.arabicName}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {surah.verses} ayah
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};

export default MurojaahSurahSelector;
