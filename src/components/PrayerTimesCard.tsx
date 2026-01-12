import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { MapPin, RefreshCw, Clock, Loader2, Sun, Sunrise, Sunset, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const prayerInfo = [
  { key: 'Fajr', name: 'Subuh', icon: Moon },
  { key: 'Sunrise', name: 'Sunrise', icon: Sunrise },
  { key: 'Dhuhr', name: 'Dzuhur', icon: Sun },
  { key: 'Asr', name: 'Ashar', icon: Sun },
  { key: 'Maghrib', name: 'Maghrib', icon: Sunset },
  { key: 'Isha', name: 'Isya', icon: Moon },
];

const PrayerTimesCard = () => {
  const { times, location, loading, error, refetch } = usePrayerTimes();

  // Determine current/next prayer
  const getCurrentPrayer = () => {
    if (!times) return null;
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const prayerMinutes = prayerInfo.map(p => {
      const time = times[p.key as keyof typeof times];
      const [hours, minutes] = time.split(':').map(Number);
      return { ...p, minutes: hours * 60 + minutes };
    });

    for (let i = prayerMinutes.length - 1; i >= 0; i--) {
      if (currentMinutes >= prayerMinutes[i].minutes) {
        return prayerMinutes[i].key;
      }
    }
    return prayerMinutes[prayerMinutes.length - 1].key; // Before Fajr
  };

  const currentPrayer = getCurrentPrayer();

  if (loading) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-card">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Getting prayer times...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-destructive">
          <MapPin className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
        <Button variant="outline" size="sm" onClick={refetch} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Enable Location
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card p-4 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Prayer Times</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{location}</span>
          </div>
          <button 
            onClick={refetch}
            className="p-1 rounded-md hover:bg-muted transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {prayerInfo.map(({ key, name, icon: Icon }) => {
          const time = times?.[key as keyof typeof times] || '--:--';
          const isCurrent = currentPrayer === key;
          const isSunrise = key === 'Sunrise';

          return (
            <div
              key={key}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg p-2.5 transition-all",
                isCurrent && !isSunrise
                  ? "bg-primary/10 ring-1 ring-primary/30"
                  : "bg-muted/50",
                isSunrise && "opacity-60"
              )}
            >
              <Icon className={cn(
                "h-4 w-4",
                isCurrent && !isSunrise ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isCurrent && !isSunrise ? "text-primary" : "text-foreground"
              )}>
                {name}
              </span>
              <span className={cn(
                "text-sm font-semibold",
                isCurrent && !isSunrise ? "text-primary" : "text-foreground"
              )}>
                {time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrayerTimesCard;
