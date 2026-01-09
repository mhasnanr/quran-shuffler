import { DailyAssignment } from '@/types/prayer';
import { Button } from '@/components/ui/button';
import { Shuffle, RotateCcw } from 'lucide-react';

interface DailyScheduleProps {
  assignment: DailyAssignment | null;
  onShuffle: () => void;
  onReshuffle: () => void;
  usedCount: number;
  totalCount: number;
}

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Today's Schedule</h2>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Pool Status</p>
          <p className="text-sm font-medium text-foreground">
            {totalCount - usedCount} / {totalCount} available
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
          {assignment.assignments.map((prayerAssignment, idx) => (
            <div 
              key={prayerAssignment.prayerId}
              className="animate-slide-up rounded-2xl bg-card p-4 shadow-card"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
                <h3 className="font-semibold text-foreground">{prayerAssignment.prayerName}</h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {prayerAssignment.rakaatSurahs.length} rakaat
                </span>
              </div>
              <div className="space-y-2">
                {prayerAssignment.rakaatSurahs.map((rakaat) => (
                  <div 
                    key={`${prayerAssignment.prayerId}-${rakaat.rakaatNumber}`}
                    className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                      {rakaat.rakaatNumber}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{rakaat.surahName}</p>
                      <p className="font-arabic text-xs text-muted-foreground">{rakaat.arabicName}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">#{rakaat.surahNumber}</span>
                  </div>
                ))}
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
