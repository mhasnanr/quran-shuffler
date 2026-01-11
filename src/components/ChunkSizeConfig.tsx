import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ChunkSizeConfigProps {
  chunkSize: number;
  onChunkSizeChange: (size: number) => void;
}

const ChunkSizeConfig = ({ chunkSize, onChunkSizeChange }: ChunkSizeConfigProps) => {
  return (
    <div className="rounded-xl bg-card p-4 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Chunk Size</h3>
          <p className="text-xs text-muted-foreground">
            Divide long surahs into chunks of this many ayahs
          </p>
        </div>
        <span className="text-lg font-semibold text-primary">{chunkSize}</span>
      </div>
      
      <div className="space-y-2">
        <Slider
          value={[chunkSize]}
          onValueChange={(value) => onChunkSizeChange(value[0])}
          min={5}
          max={50}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>5 ayat</span>
          <span>25 ayat</span>
          <span>50 ayat</span>
        </div>
      </div>
    </div>
  );
};

export default ChunkSizeConfig;
