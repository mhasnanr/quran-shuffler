import { getJuzList } from '@/data/quranData';
import { cn } from '@/lib/utils';

interface JuzSelectorProps {
  selectedJuz: number[];
  onSelectJuz: (juzNumbers: number[]) => void;
}

const JuzSelector = ({ selectedJuz, onSelectJuz }: JuzSelectorProps) => {
  const juzList = getJuzList();

  const toggleJuz = (juz: number) => {
    if (selectedJuz.includes(juz)) {
      if (selectedJuz.length > 1) {
        onSelectJuz(selectedJuz.filter(j => j !== juz));
      }
    } else {
      onSelectJuz([...selectedJuz, juz]);
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Select Juz
      </h2>
      <div className="grid grid-cols-6 gap-2">
        {juzList.map((juz) => (
          <button
            key={juz}
            onClick={() => toggleJuz(juz)}
            className={cn(
              "aspect-square rounded-lg text-sm font-medium transition-all duration-200",
              selectedJuz.includes(juz)
                ? "gradient-islamic text-primary-foreground shadow-islamic"
                : "bg-card text-muted-foreground hover:bg-secondary shadow-card"
            )}
          >
            {juz}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JuzSelector;
