import { DailyAssignment } from '@/types/prayer';
import { Button } from '@/components/ui/button';
import { Shuffle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import AyahViewer from './AyahViewer';

interface DailyScheduleProps {
  assignment: DailyAssignment | null;
  onShuffle: () => void;
  onReshuffle: () => void;
  usedCount: number;
  totalCount: number;
}

const getCategoryColor = (prayerId: string) => {
  if (['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].includes(prayerId)) {
    return 'bg-primary/10 text-primary border-primary/20';
  }
  if (prayerId.startsWith('rawatib')) {
    return 'bg-emerald-light/10 text-emerald-light border-emerald-light/20';
  }
  // All other sunnah prayers
  return 'bg-accent/20 text-accent-foreground border-accent/30';
};

const DailySchedule = ({ 
  assignment, 
  onShuffle, 
  onReshuffle,
  usedCount,
  totalCount 
}: DailyScheduleProps) => {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const totalRakaat = assignment?.assignments.reduce(
    (sum, a) => sum + a.rakaatSurahs.length, 0
  ) || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Today's Schedule</h2>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Surah Pool</p>
          <p className="text-sm font-medium text-foreground">
            {totalCount - usedCount} / {totalCount}
          </p>
        </div>
      </div>

      {!assignment ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center shadow-card">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shuffle className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Ready to shuffle</p>
            <p className="text-sm text-muted-foreground">Generate today's Quran recitation plan</p>
          </div>
          <Button 
            onClick={onShuffle}
            className="gradient-islamic w-full text-primary-foreground shadow-islamic hover:opacity-90"
          >
            <Shuffle className="mr-2 h-4 w-4" />
            Shuffle for Today
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-primary/5 px-4 py-2">
            <span className="text-sm text-muted-foreground">Total rakaat today</span>
            <span className="font-semibold text-primary">{totalRakaat} rakaat</span>
          </div>

          {assignment.assignments.map((prayerAssignment, idx) => (
            <div 
              key={prayerAssignment.prayerId}
              className="animate-slide-up rounded-2xl bg-card p-4 shadow-card"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
                <h3 className="font-semibold text-foreground">{prayerAssignment.prayerName}</h3>
                <span className={cn(
                  "rounded-full border px-2 py-0.5 text-xs font-medium",
                  getCategoryColor(prayerAssignment.prayerId)
                )}>
                  {prayerAssignment.rakaatSurahs.length} rakaat
                </span>
              </div>
              <div className="space-y-2">
                {prayerAssignment.rakaatSurahs.map((rakaat) => {
                  const isFullSurah = rakaat.startAyah === 1 && rakaat.endAyah === rakaat.startAyah;
                  const showAyahRange = rakaat.startAyah !== rakaat.endAyah || rakaat.startAyah !== 1;
                  
                  return (
                    <div 
                      key={`${prayerAssignment.prayerId}-${rakaat.rakaatNumber}`}
                      className="rounded-lg bg-muted/50 px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                          {rakaat.rakaatNumber}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground truncate">{rakaat.surahName}</p>
                            {showAyahRange && (
                              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {rakaat.startAyah}-{rakaat.endAyah}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="font-arabic text-sm text-muted-foreground">{rakaat.arabicName}</p>
                      </div>
                      
                      <AyahViewer
                        surahNumber={rakaat.surahNumber}
                        surahName={rakaat.surahName}
                        startAyah={rakaat.startAyah}
                        endAyah={rakaat.endAyah}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            onClick={onReshuffle}
            className="w-full"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Re-shuffle Today
          </Button>
        </div>
      )}
    </div>
  );
};

export default DailySchedule;
