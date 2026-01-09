import { Surah, getSurahsByJuz } from '@/data/quranData';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface SurahListProps {
  selectedJuz: number[];
  selectedSurahs: number[];
  onToggleSurah: (surahNumber: number) => void;
}

const SurahList = ({ selectedJuz, selectedSurahs, onToggleSurah }: SurahListProps) => {
  const availableSurahs = getSurahsByJuz(selectedJuz);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Surahs ({selectedSurahs.length} selected)
        </h2>
      </div>
      <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-xl bg-card p-2 shadow-card">
        {availableSurahs.map((surah) => (
          <button
            key={surah.number}
            onClick={() => onToggleSurah(surah.number)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all duration-200",
              selectedSurahs.includes(surah.number)
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted"
            )}
          >
            <div className="flex items-center gap-3">
              <span className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
                selectedSurahs.includes(surah.number)
                  ? "gradient-islamic text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {surah.number}
              </span>
              <div>
                <p className="text-sm font-medium">{surah.name}</p>
                <p className="font-arabic text-xs text-muted-foreground">{surah.arabicName}</p>
              </div>
            </div>
            {selectedSurahs.includes(surah.number) && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SurahList;
