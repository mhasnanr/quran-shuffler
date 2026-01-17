import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { useTour, TourStep } from "@/hooks/useTour";
import { useTourContext } from "@/contexts/TourContext";
import { SETTINGS_TOUR_ID } from "@/lib/tours/settingsTour";
import { isOnboardingComplete, useOnboarding } from "@/hooks/useOnboarding";

const SettingsPage = () => {
  const navigate = useNavigate();
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
  const { navigateToNextStep } = useOnboarding();

  const allPossibleChunks = getAllPossibleChunks();

  // Use refs to access latest state in tour callbacks without causing re-creation
  const stateRef = useRef(state);
  stateRef.current = state;

  // Check if first time only once on mount
  const isFirstTimeRef = useRef(!isOnboardingComplete());

  // Create tour steps only once
  const settingsTourSteps: TourStep[] = useMemo(() => {
    const isFirstTime = isFirstTimeRef.current;

    return [
      {
        id: "settings-intro",
        title: "Selamat Datang! 🕌",
        text: "Mari kita mulai dengan mengatur preferensi bacaan Al-Quran kamu. Ikuti panduan ini untuk setup awal.",
      },
      {
        id: "prayer-config",
        title: "Pengaturan Shalat",
        text: "Bagus! Shalat sudah dipilih. Lanjut ke langkah berikutnya.",
        attachTo: {
          element: "[data-tour='prayer-config']",
          on: "bottom" as const,
        },
        canClickTarget: true,
        ...(isFirstTime && {
          waitForAction: {
            text: "👆 Aktifkan minimal satu shalat untuk melanjutkan. Klik toggle untuk mengaktifkan.",
            checkComplete: () =>
              stateRef.current.prayers.filter((p) => p.enabled).length > 0,
          },
          when: {
            show: () => {
              // Enable first prayer if none enabled
              if (
                stateRef.current.prayers.filter((p) => p.enabled).length === 0
              ) {
                const first = stateRef.current.prayers[0];
                if (first) togglePrayer(first.id);
              }
            },
          },
        }),
      },
      {
        id: "juz-selector",
        title: "Pilih Juz",
        text: "Bagus! Juz sudah dipilih. Lanjut ke langkah berikutnya.",
        attachTo: {
          element: "[data-tour='juz-selector']",
          on: "bottom" as const,
        },
        canClickTarget: true,
        ...(isFirstTime && {
          waitForAction: {
            text: "👆 Pilih minimal satu juz untuk melanjutkan. Klik pada juz yang ingin kamu baca.",
            checkComplete: () => stateRef.current.selectedJuz.length > 0,
          },
          when: {
            show: () => {
              // Select first juz if none selected
              if (stateRef.current.selectedJuz.length === 0) {
                updateSelectedJuz([1]);
              }
            },
          },
        }),
      },
      {
        id: "chunk-mode",
        title: "Mode Chunk",
        text: "Aktifkan mode chunk untuk membagi surat panjang menjadi bagian-bagian kecil yang lebih mudah dihafal.",
        attachTo: {
          element: "[data-tour='chunk-mode']",
          on: "bottom" as const,
        },
        canClickTarget: true,
      },
      {
        id: "translation-toggle",
        title: "Tampilkan Terjemahan",
        text: "Atur apakah terjemahan ditampilkan saat melihat ayat.",
        attachTo: {
          element: "[data-tour='translation-toggle']",
          on: "bottom" as const,
        },
        canClickTarget: true,
      },
      {
        id: "surah-list",
        title: "Daftar Surat",
        text: "Bagus! Surat sudah dipilih. Kamu siap membuat jadwal!",
        attachTo: {
          element: "[data-tour='surah-list']",
          on: "top" as const,
        },
        canClickTarget: true,
        ...(isFirstTime && {
          waitForAction: {
            text: "👆 Pilih minimal satu surat untuk melanjutkan. Klik pada surat yang ingin kamu baca.",
            checkComplete: () => stateRef.current.selectedChunks.length > 0,
          },
          when: {
            show: () => {
              // Select first chunk if none selected
              if (
                stateRef.current.selectedChunks.length === 0 &&
                allPossibleChunks.length > 0
              ) {
                toggleChunk(allPossibleChunks[0].id);
              }
            },
          },
        }),
      },
      {
        id: "reset-pool",
        title: "Reset Used Pool",
        text: "Sistem menyimpan surat yang sudah dibaca agar tidak diulang. Tombol ini untuk reset daftar tersebut, sehingga semua surat bisa muncul lagi di jadwal. Pengaturan selesai! Klik 'Done' untuk mulai.",
        attachTo: {
          element: "[data-tour='reset-pool']",
          on: "top" as const,
        },
        buttons: [
          {
            text: "Done",
            action: "complete",
            classes: "shepherd-button-primary",
          },
        ],
      },
    ];
  }, []); // Empty deps - only create once

  // Navigate to schedule after completing onboarding tour
  const tourOptions = useMemo(
    () => ({
      onComplete: () => {
        if (isFirstTimeRef.current) {
          navigateToNextStep("settings");
        }
      },
    }),
    [navigateToNextStep],
  );

  const { restartTour } = useTour(
    SETTINGS_TOUR_ID,
    settingsTourSteps,
    true,
    tourOptions,
  );
  const { setRestartHandler } = useTourContext();

  useEffect(() => {
    setRestartHandler(restartTour);
    return () => setRestartHandler(null);
  }, [restartTour, setRestartHandler]);

  return (
    <div className="space-y-6">
      <div data-tour="prayer-config">
        <PrayerConfig
          prayers={state.prayers}
          onToggle={togglePrayer}
          onUpdateRakaat={updatePrayerRakaat}
        />
      </div>

      <div data-tour="juz-selector">
        <JuzSelector
          selectedJuz={state.selectedJuz}
          onSelectJuz={updateSelectedJuz}
        />
      </div>

      <div data-tour="chunk-mode">
        <ChunkModeToggle
          chunksEnabled={chunksEnabled}
          onToggle={setChunksEnabled}
        />
      </div>

      {/* Translation Visibility Toggle */}
      <div
        data-tour="translation-toggle"
        className="rounded-xl bg-card p-4 shadow-card"
      >
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

      <div data-tour="surah-list">
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
      </div>

      <div
        data-tour="reset-pool"
        className="rounded-xl bg-card p-4 shadow-card"
      >
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
