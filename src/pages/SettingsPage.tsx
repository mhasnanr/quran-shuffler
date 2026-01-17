import PrayerConfig from "@/components/PrayerConfig";
import JuzSelector from "@/components/JuzSelector";
import SurahList from "@/components/SurahList";
import ChunkSizeConfig from "@/components/ChunkSizeConfig";
import ChunkModeToggle from "@/components/ChunkModeToggle";
import { useAppState } from "@/hooks/useAppState";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";

const SettingsPage = () => {
  const {
    state,
    chunkSize,
    chunksEnabled,
    setChunksEnabled,
    showTranslation,
    setShowTranslation,
    togglePrayer,
    updatePrayerRakaat,
    updateSelectedJuz,
    toggleChunk,
    toggleMandatory,
    selectAllChunks,
    deselectAllChunks,
    includeAllAyahs,
    revertToChunks,
    updateChunkSize,
    resetUsedChunks,
    getAllPossibleChunks,
  } = useAppState();

  const allPossibleChunks = getAllPossibleChunks();

  return (
    <div className="space-y-6">
      <PrayerConfig
        prayers={state.prayers}
        onToggle={togglePrayer}
        onUpdateRakaat={updatePrayerRakaat}
      />

      <JuzSelector
        selectedJuz={state.selectedJuz}
        onSelectJuz={updateSelectedJuz}
      />

      <ChunkModeToggle
        chunksEnabled={chunksEnabled}
        onToggle={setChunksEnabled}
      />

      {/* Translation Visibility Toggle */}
      <div className="rounded-xl bg-card p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <Label
              htmlFor="show-translation"
              className="text-sm font-medium text-foreground"
            >
              Show Translation
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Display translation text below ayah
            </p>
          </div>
          <Switch
            id="show-translation"
            checked={showTranslation}
            onCheckedChange={setShowTranslation}
          />
        </div>
      </div>

      {chunksEnabled && (
        <ChunkSizeConfig
          chunkSize={chunkSize}
          onChunkSizeChange={updateChunkSize}
        />
      )}

      <SurahList
        selectedJuz={state.selectedJuz}
        selectedChunks={state.selectedChunks}
        mandatoryChunks={state.mandatoryChunks}
        allPossibleChunks={allPossibleChunks}
        chunksEnabled={chunksEnabled}
        onToggleChunk={toggleChunk}
        onToggleMandatory={toggleMandatory}
        onSelectAll={selectAllChunks}
        onDeselectAll={deselectAllChunks}
        onIncludeAllAyahs={includeAllAyahs}
        onRevertToChunks={revertToChunks}
      />

      <div className="rounded-xl bg-card p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              Reset Used Pool
            </p>
            <p className="text-xs text-muted-foreground">
              {state.usedChunks.length} chunks used recently
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetUsedChunks}
            disabled={state.usedChunks.length === 0}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
