import { Prayer, PrayerCategory, categoryLabels } from '@/types/prayer';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrayerConfigProps {
  prayers: Prayer[];
  onToggle: (prayerId: string) => void;
  onUpdateRakaat: (prayerId: string, rakaat: number) => void;
}

const PrayerConfig = ({ prayers, onToggle, onUpdateRakaat }: PrayerConfigProps) => {
  const categories: PrayerCategory[] = ['main', 'rawatib', 'witir', 'optional'];

  const getPrayersByCategory = (category: PrayerCategory) => {
    return prayers.filter(p => p.category === category);
  };

  const handleRakaatChange = (prayer: Prayer, delta: number) => {
    let newRakaat = prayer.rakaat + delta;
    
    // Clamp to min/max
    if (prayer.minRakaat) newRakaat = Math.max(prayer.minRakaat, newRakaat);
    if (prayer.maxRakaat) newRakaat = Math.min(prayer.maxRakaat, newRakaat);
    
    // If must be odd, skip even numbers
    if (prayer.mustBeOdd && newRakaat % 2 === 0) {
      newRakaat += delta > 0 ? 1 : -1;
      if (prayer.minRakaat) newRakaat = Math.max(prayer.minRakaat, newRakaat);
      if (prayer.maxRakaat) newRakaat = Math.min(prayer.maxRakaat, newRakaat);
    }
    
    onUpdateRakaat(prayer.id, newRakaat);
  };

  const canDecrease = (prayer: Prayer) => {
    if (!prayer.enabled) return false;
    const min = prayer.minRakaat || 1;
    if (prayer.mustBeOdd) {
      return prayer.rakaat > min && (prayer.rakaat - 2) >= min;
    }
    return prayer.rakaat > min;
  };

  const canIncrease = (prayer: Prayer) => {
    if (!prayer.enabled) return false;
    const max = prayer.maxRakaat || 99;
    if (prayer.mustBeOdd) {
      return (prayer.rakaat + 2) <= max;
    }
    return prayer.rakaat < max;
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const categoryPrayers = getPrayersByCategory(category);
        if (categoryPrayers.length === 0) return null;
        
        const label = categoryLabels[category];
        
        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">{label.name}</h2>
              <span className="font-arabic text-sm text-muted-foreground">{label.arabicName}</span>
              <span className="text-xs text-muted-foreground">• {label.description}</span>
            </div>
            
            <div className="space-y-2">
              {categoryPrayers.map((prayer) => (
                <div
                  key={prayer.id}
                  className={cn(
                    "flex items-center justify-between rounded-xl bg-card p-3.5 shadow-card transition-all duration-200",
                    prayer.enabled ? "ring-1 ring-primary/10" : "opacity-50",
                    prayer.fixed && "bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {prayer.fixed ? (
                      <div className="flex h-5 w-9 items-center justify-center">
                        <Lock className="h-3.5 w-3.5 text-primary" />
                      </div>
                    ) : (
                      <Switch
                        checked={prayer.enabled}
                        onCheckedChange={() => onToggle(prayer.id)}
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{prayer.name}</p>
                      <p className="font-arabic text-xs text-muted-foreground">{prayer.arabicName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {prayer.minRakaat !== prayer.maxRakaat ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => handleRakaatChange(prayer, prayer.mustBeOdd ? -2 : -1)}
                          disabled={!canDecrease(prayer)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-semibold text-foreground">
                          {prayer.rakaat}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => handleRakaatChange(prayer, prayer.mustBeOdd ? 2 : 1)}
                          disabled={!canIncrease(prayer)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {prayer.rakaat} rakaat
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PrayerConfig;
