import { Switch } from '@/components/ui/switch';
import { Layers } from 'lucide-react';

interface ChunkModeToggleProps {
  chunksEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const ChunkModeToggle = ({ chunksEnabled, onToggle }: ChunkModeToggleProps) => {
  return (
    <div className="rounded-xl bg-card p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Split into Chunks</p>
            <p className="text-xs text-muted-foreground">
              {chunksEnabled 
                ? 'Surahs are split into smaller parts' 
                : 'Select whole surahs at once'}
            </p>
          </div>
        </div>
        <Switch
          checked={chunksEnabled}
          onCheckedChange={onToggle}
        />
      </div>
    </div>
  );
};

export default ChunkModeToggle;
