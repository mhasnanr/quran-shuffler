import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Prayer, defaultPrayers } from "@/types/prayer";
import { cn } from "@/lib/utils";

interface TemporaryPrayerEntry {
  id: string;
  prayerId: string;
  prayerName: string;
  rakaat: number;
  minRakaat: number;
  maxRakaat: number;
  mustBeOdd?: boolean;
}

interface TemporaryPrayerDialogProps {
  enabledPrayers: Prayer[];
  onAddTemporaryPrayers: (entries: TemporaryPrayerEntry[]) => void;
}

const TemporaryPrayerDialog = ({
  enabledPrayers,
  onAddTemporaryPrayers,
}: TemporaryPrayerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<TemporaryPrayerEntry[]>([]);

  // Get available prayers:
  // - Main prayers: only those NOT in the template
  // - Sunnah prayers: all that have remaining rakaat (can always add more)
  const availablePrayers = useMemo(() => {
    const enabledMainIds = enabledPrayers
      .filter((p) => p.category === "main")
      .map((p) => p.id);

    return defaultPrayers.filter((p) => {
      // Exclude main prayers that are already enabled in template
      if (p.category === "main" && enabledMainIds.includes(p.id)) {
        return false;
      }

      // For sunnah, check if they still have remaining rakaat potential
      if (p.category === "sunnah") {
        const enabledPrayer = enabledPrayers.find((ep) => ep.id === p.id);
        const currentRakaat = enabledPrayer?.rakaat || 0;
        const maxRakaat = p.maxRakaat || 12;

        // Also check if already added in temporary entries
        const entryRakaat = entries
          .filter((e) => e.prayerId === p.id)
          .reduce((sum, e) => sum + e.rakaat, 0);

        // Allow if there's still room for more rakaat
        return currentRakaat + entryRakaat < maxRakaat;
      }

      return true;
    });
  }, [enabledPrayers, entries]);

  const handleAddEntry = () => {
    if (availablePrayers.length === 0) return;

    const prayer = availablePrayers[0];
    const enabledPrayer = enabledPrayers.find((p) => p.id === prayer.id);
    const currentRakaat = enabledPrayer?.rakaat || 0;
    const entryRakaat = entries
      .filter((e) => e.prayerId === prayer.id)
      .reduce((sum, e) => sum + e.rakaat, 0);

    const minRakaat = prayer.minRakaat || 2;
    const maxRakaat = (prayer.maxRakaat || 12) - currentRakaat - entryRakaat;

    const newEntry: TemporaryPrayerEntry = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prayerId: prayer.id,
      prayerName: prayer.name,
      rakaat: Math.min(minRakaat, maxRakaat),
      minRakaat: prayer.minRakaat || 2,
      maxRakaat,
      mustBeOdd: prayer.mustBeOdd,
    };

    setEntries([...entries, newEntry]);
  };

  const handleRemoveEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const handlePrayerChange = (entryId: string, prayerId: string) => {
    const prayer = defaultPrayers.find((p) => p.id === prayerId);
    if (!prayer) return;

    const enabledPrayer = enabledPrayers.find((p) => p.id === prayerId);
    const currentRakaat = enabledPrayer?.rakaat || 0;
    const otherEntriesRakaat = entries
      .filter((e) => e.prayerId === prayerId && e.id !== entryId)
      .reduce((sum, e) => sum + e.rakaat, 0);

    const minRakaat = prayer.minRakaat || 2;
    const maxRakaat =
      (prayer.maxRakaat || 12) - currentRakaat - otherEntriesRakaat;

    setEntries(
      entries.map((e) =>
        e.id === entryId
          ? {
              ...e,
              prayerId: prayer.id,
              prayerName: prayer.name,
              rakaat: Math.min(minRakaat, maxRakaat),
              minRakaat,
              maxRakaat,
              mustBeOdd: prayer.mustBeOdd,
            }
          : e,
      ),
    );
  };

  const handleRakaatChange = (entryId: string, delta: number) => {
    setEntries(
      entries.map((e) => {
        if (e.id !== entryId) return e;

        const step = e.mustBeOdd ? 2 : 2; // Always increment by 2 for temporary prayers
        let newRakaat = e.rakaat + delta * step;

        // Clamp to min/max
        newRakaat = Math.max(e.minRakaat, newRakaat);
        newRakaat = Math.min(e.maxRakaat, newRakaat);

        // If must be odd, ensure odd number
        if (e.mustBeOdd && newRakaat % 2 === 0) {
          newRakaat += delta > 0 ? 1 : -1;
          newRakaat = Math.max(e.minRakaat, newRakaat);
          newRakaat = Math.min(e.maxRakaat, newRakaat);
        }

        return { ...e, rakaat: newRakaat };
      }),
    );
  };

  const handleSubmit = () => {
    if (entries.length === 0) return;
    onAddTemporaryPrayers(entries);
    setEntries([]);
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setEntries([]);
    }
  };

  const getAvailableForEntry = (entryId: string) => {
    // Get prayers that are available for this specific entry
    const currentEntry = entries.find((e) => e.id === entryId);
    const currentPrayerId = currentEntry?.prayerId;

    return defaultPrayers.filter((p) => {
      // Main prayers: only those NOT in template
      if (p.category === "main") {
        const isEnabledInTemplate = enabledPrayers.some(
          (ep) => ep.id === p.id && ep.category === "main",
        );
        return !isEnabledInTemplate || p.id === currentPrayerId;
      }

      // Sunnah: check remaining rakaat
      if (p.category === "sunnah") {
        const enabledPrayer = enabledPrayers.find((ep) => ep.id === p.id);
        const currentRakaat = enabledPrayer?.rakaat || 0;
        const maxRakaat = p.maxRakaat || 12;

        const otherEntriesRakaat = entries
          .filter((e) => e.prayerId === p.id && e.id !== entryId)
          .reduce((sum, e) => sum + e.rakaat, 0);

        return currentRakaat + otherEntriesRakaat < maxRakaat;
      }

      return true;
    });
  };

  const totalRakaat = entries.reduce((sum, e) => sum + e.rakaat, 0);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Temporary Prayer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Temporary Prayer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Add prayers for today that are not in your regular template. Surahs
            will be shuffled from your pool automatically.
          </p>

          {entries.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg bg-muted/50 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No temporary prayers added yet
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddEntry}
                disabled={availablePrayers.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Prayer
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-2 rounded-lg bg-card p-3 border border-border/50"
                >
                  <Select
                    value={entry.prayerId}
                    onValueChange={(value) =>
                      handlePrayerChange(entry.id, value)
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableForEntry(entry.id).map((prayer) => (
                        <SelectItem key={prayer.id} value={prayer.id}>
                          {prayer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRakaatChange(entry.id, -1)}
                      disabled={entry.rakaat <= entry.minRakaat}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {entry.rakaat}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRakaatChange(entry.id, 1)}
                      disabled={entry.rakaat >= entry.maxRakaat}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveEntry(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddEntry}
                disabled={availablePrayers.length === 0}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another
              </Button>
            </div>
          )}

          {entries.length > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-primary/5 px-4 py-2">
              <span className="text-sm text-muted-foreground">
                Total rakaat to add
              </span>
              <span className="font-semibold text-primary">
                {totalRakaat} rakaat
              </span>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 gradient-islamic text-primary-foreground"
              onClick={handleSubmit}
              disabled={entries.length === 0}
            >
              Add & Shuffle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemporaryPrayerDialog;
