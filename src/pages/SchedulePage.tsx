import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DailySchedule from "@/components/DailySchedule";
import { useAppState } from "@/hooks/useAppState";
import { useReviewItems } from "@/hooks/useReviewItems";
import { useTour, TourStep } from "@/hooks/useTour";
import { useTourContext } from "@/contexts/TourContext";
import { SCHEDULE_TOUR_ID } from "@/lib/tours/scheduleTour";
import { isOnboardingComplete } from "@/hooks/useOnboarding";

const SchedulePage = () => {
  const navigate = useNavigate();
  const {
    state,
    showTranslation,
    shuffleForToday,
    getTodayAssignment,
    forceReshuffle,
    addTemporaryPrayers,
  } = useAppState();

  const { reviewItems, addReviewItem } = useReviewItems();
  const [todayAssignment, setTodayAssignment] = useState(getTodayAssignment());

  // Track state with refs for tour callbacks
  const assignmentRef = useRef(todayAssignment);
  assignmentRef.current = todayAssignment;

  const reviewItemsRef = useRef(reviewItems);
  reviewItemsRef.current = reviewItems;

  const isFirstTimeRef = useRef(!isOnboardingComplete());
  const initialReviewCountRef = useRef(reviewItems.length);

  // Create tour steps with interactive requirements
  const scheduleTourSteps: TourStep[] = useMemo(() => {
    const isFirstTime = isFirstTimeRef.current;

    return [
      {
        id: "welcome",
        title: "Halaman Jadwal 📅",
        text: "Di sini kamu bisa melihat bacaan surat untuk setiap shalat hari ini.",
      },
      {
        id: "shuffle-button",
        title: "Generate Jadwal",
        text: "👆 Klik tombol di bawah untuk membuat jadwal bacaan hari ini.",
        attachTo: {
          element: "[data-tour='shuffle-button']",
          on: "top" as const,
        },
        canClickTarget: true,
        ...(isFirstTime && {
          waitForAction: {
            text: "👆 Klik tombol ini untuk membuat jadwal bacaan hari ini.",
            checkComplete: () => !!assignmentRef.current,
          },
        }),
      },
      {
        id: "prayer-card",
        title: "Kartu Shalat 🎉",
        text: "Jadwal berhasil dibuat! Setiap kartu menunjukkan satu shalat dengan surat yang akan dibaca.",
        attachTo: {
          element: "[data-tour='prayer-card']",
          on: "bottom" as const,
        },
        canClickTarget: true,
      },
      {
        id: "expand-round",
        title: "Expand Rakaat",
        text: "👆 Klik untuk expand dan melihat detail surat per rakaat.",
        attachTo: {
          element: "[data-tour='expand-round']",
          on: "bottom" as const,
        },
        canClickTarget: true,
        ...(isFirstTime && {
          waitForAction: {
            text: "👆 Klik untuk expand dan melihat detail rakaat.",
            checkComplete: () => {
              const trigger = document.querySelector(
                "[data-tour='expand-round']",
              );
              const collapsible = trigger?.closest("[data-state]");
              return collapsible?.getAttribute("data-state") === "open";
            },
          },
        }),
      },
      {
        id: "complete-rakaat",
        title: "Selesaikan Rakaat",
        text: "👆 Klik tombol untuk menyelesaikan satu rakaat.",
        attachTo: {
          element: "[data-tour='complete-rakaat']",
          on: "top" as const,
        },
        canClickTarget: true,
        ...(isFirstTime && {
          waitForAction: {
            text: "👆 Klik tombol untuk menyelesaikan satu rakaat.",
            checkComplete: () => {
              // Check if the feedback dialog is open
              const dialog = document.querySelector("[role='alertdialog']");
              return !!dialog;
            },
          },
        }),
      },
      {
        id: "need-review",
        title: "Tambah ke Review",
        text: "👆 Klik 'Need Review' jika kamu butuh mengulang surat ini.",
        attachTo: {
          element: "[data-tour='need-review-button']",
          on: "top" as const,
        },
        canClickTarget: true,
        ...(isFirstTime && {
          waitForAction: {
            text: "👆 Klik 'Need Review' untuk menambahkan surat ke daftar review.",
            checkComplete: () => {
              // Check if a new review item was added
              return (
                reviewItemsRef.current.length > initialReviewCountRef.current
              );
            },
          },
        }),
      },
      {
        id: "schedule-complete",
        title: "Selesai! 🎉",
        text: "Surat berhasil ditambahkan ke Review. Klik 'Done' untuk melihat daftar review kamu.",
      },
    ];
  }, []); // Empty deps - only create once

  // Navigate to review after completing schedule tour
  const tourOptions = useMemo(
    () => ({
      onComplete: () => {
        if (isFirstTimeRef.current) {
          navigate("/review");
        }
      },
    }),
    [navigate],
  );

  const { restartTour } = useTour(
    SCHEDULE_TOUR_ID,
    scheduleTourSteps,
    true,
    tourOptions,
  );
  const { setRestartHandler } = useTourContext();

  useEffect(() => {
    setRestartHandler(restartTour);
    return () => setRestartHandler(null);
  }, [restartTour, setRestartHandler]);

  useEffect(() => {
    setTodayAssignment(getTodayAssignment());
  }, [state.dailyAssignments, getTodayAssignment]);

  const handleShuffle = () => {
    const assignment = shuffleForToday();
    setTodayAssignment(assignment);
  };

  const handleReshuffle = () => {
    const assignment = forceReshuffle();
    setTodayAssignment(assignment);
  };

  const handleAddTemporaryPrayers = (
    entries: Array<{
      id: string;
      prayerId: string;
      prayerName: string;
      rakaat: number;
    }>,
  ) => {
    const assignment = addTemporaryPrayers(entries);
    if (assignment) {
      setTodayAssignment(assignment);
    }
  };

  const enabledPrayers = state.prayers.filter((p) => p.enabled);

  return (
    <DailySchedule
      assignment={todayAssignment}
      onShuffle={handleShuffle}
      onReshuffle={handleReshuffle}
      usedCount={state.usedChunks.length}
      totalCount={state.selectedChunks.length}
      onAddToReview={addReviewItem}
      enabledPrayers={enabledPrayers}
      onAddTemporaryPrayers={handleAddTemporaryPrayers}
      showTranslation={showTranslation}
    />
  );
};

export default SchedulePage;
