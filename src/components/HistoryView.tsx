import { DailyAssignment } from '@/types/prayer';
import { Calendar } from 'lucide-react';

interface HistoryViewProps {
  assignments: DailyAssignment[];
}

const HistoryView = ({ assignments }: HistoryViewProps) => {
  const sortedAssignments = [...assignments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">No history yet</p>
          <p className="text-sm text-muted-foreground">Your daily schedules will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Recent History
      </h2>
      <div className="space-y-3">
        {sortedAssignments.map((assignment) => (
          <div 
            key={assignment.date}
            className="rounded-xl bg-card p-4 shadow-card"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{formatDate(assignment.date)}</h3>
              <span className="text-xs text-muted-foreground">
                {assignment.assignments.reduce((sum, a) => sum + a.rakaatSurahs.length, 0)} rakaat
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {assignment.assignments.flatMap(a => 
                a.rakaatSurahs.map(r => {
                  const showRange = r.startAyah !== r.endAyah || r.startAyah !== 1;
                  return (
                    <span 
                      key={`${a.prayerId}-${r.rakaatNumber}`}
                      className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                    >
                      {r.surahName}{showRange && ` (${r.startAyah}-${r.endAyah})`}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
