import { Prayer } from '@/types/prayer';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface PrayerConfigProps {
  prayers: Prayer[];
  onToggle: (prayerId: string) => void;
  onUpdateRakaat: (prayerId: string, rakaat: number) => void;
}

const PrayerConfig = ({ prayers, onToggle, onUpdateRakaat }: PrayerConfigProps) => {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Prayer Sessions
      </h2>
      <div className="space-y-2">
        {prayers.map((prayer) => (
          <div
            key={prayer.id}
            className={`flex items-center justify-between rounded-xl bg-card p-4 shadow-card transition-all duration-200 ${
              prayer.enabled ? 'ring-1 ring-primary/20' : 'opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Switch
                checked={prayer.enabled}
                onCheckedChange={() => onToggle(prayer.id)}
              />
              <div>
                <p className="font-medium text-foreground">{prayer.name}</p>
                <p className="font-arabic text-sm text-muted-foreground">{prayer.arabicName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onUpdateRakaat(prayer.id, prayer.rakaat - 1)}
                disabled={prayer.rakaat <= 1 || !prayer.enabled}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-semibold text-foreground">
                {prayer.rakaat}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onUpdateRakaat(prayer.id, prayer.rakaat + 1)}
                disabled={!prayer.enabled}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerConfig;
