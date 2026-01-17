import { useEffect, useRef, useCallback } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

export interface TourStep {
  id: string;
  title: string;
  text: string;
  attachTo?: {
    element: string;
    on: "top" | "bottom" | "left" | "right" | "auto";
  };
  buttons?: Array<{
    text: string;
    action: "next" | "back" | "complete";
    classes?: string;
  }>;
  canClickTarget?: boolean;
  scrollTo?: boolean;
  // Text to show when waiting for user action
  waitForAction?: {
    text: string;
    checkComplete: () => boolean;
  };
}

export interface UseTourOptions {
  onComplete?: () => void;
}

const TOUR_STORAGE_PREFIX = "quran-shuffler-tour-";

const getTourCompletedKey = (tourId: string) => `${TOUR_STORAGE_PREFIX}${tourId}`;

const isTourCompleted = (tourId: string): boolean => {
  return localStorage.getItem(getTourCompletedKey(tourId)) === "true";
};

const markTourCompleted = (tourId: string) => {
  localStorage.setItem(getTourCompletedKey(tourId), "true");
};

export const resetTourCompletion = (tourId: string) => {
  localStorage.removeItem(getTourCompletedKey(tourId));
};

export const resetAllTours = () => {
  const keys = Object.keys(localStorage).filter((key) =>
    key.startsWith(TOUR_STORAGE_PREFIX)
  );
  keys.forEach((key) => localStorage.removeItem(key));
};

export const useTour = (
  tourId: string, 
  steps: TourStep[], 
  autoStart = true,
  options?: UseTourOptions
) => {
  const tourRef = useRef<InstanceType<typeof Shepherd.Tour> | null>(null);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup all intervals
  const clearAllIntervals = useCallback(() => {
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];
  }, []);

  const createTour = useCallback(() => {
    clearAllIntervals();
    
    if (tourRef.current) {
      tourRef.current.complete();
    }

    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: {
          enabled: true,
        },
        scrollTo: { behavior: "smooth", block: "center" },
        classes: "shepherd-theme-custom",
        modalOverlayOpeningPadding: 8,
        modalOverlayOpeningRadius: 8,
      },
    });

    steps.forEach((step, index) => {
      const isFirst = index === 0;
      const isLast = index === steps.length - 1;
      const hasWaitForAction = !!step.waitForAction;

      // Default buttons (always include next, will be controlled by when handler)
      const defaultButtons = [
        ...(isFirst
          ? []
          : [
              {
                text: "Back",
                classes: "shepherd-button-secondary",
                action: () => tour.back(),
              },
            ]),
        {
          text: isLast ? "Done" : "Next",
          classes: "shepherd-button-primary",
          action: () => (isLast ? tour.complete() : tour.next()),
        },
      ];

      // Waiting buttons (no next button)
      const waitingButtons = isFirst
        ? []
        : [
            {
              text: "Back",
              classes: "shepherd-button-secondary",
              action: () => tour.back(),
            },
          ];

      tour.addStep({
        id: step.id,
        title: step.title,
        text: step.text,
        attachTo: step.attachTo,
        canClickTarget: step.canClickTarget ?? hasWaitForAction,
        scrollTo: step.scrollTo ?? true,
        buttons: hasWaitForAction ? waitingButtons : defaultButtons,
        when: hasWaitForAction
          ? {
              show: () => {
                const currentStep = tour.getCurrentStep();
                if (!currentStep) return;

                const stepEl = currentStep.getElement();
                const textEl = stepEl?.querySelector(".shepherd-text");

                // Check if already complete
                if (step.waitForAction!.checkComplete()) {
                  if (textEl) textEl.textContent = step.text;
                  currentStep.updateStepOptions({ buttons: defaultButtons });
                  return;
                }

                // Show waiting text
                if (textEl) textEl.textContent = step.waitForAction!.text;

                // Check periodically
                const interval = setInterval(() => {
                  if (step.waitForAction!.checkComplete()) {
                    clearInterval(interval);
                    if (textEl) textEl.textContent = step.text;
                    currentStep.updateStepOptions({ buttons: defaultButtons });
                    
                    // Reposition the popup after a small delay
                    setTimeout(() => {
                      const targetEl = step.attachTo?.element 
                        ? document.querySelector(step.attachTo.element)
                        : null;
                      if (targetEl) {
                        // Force Shepherd to recalculate position by updating attachTo
                        currentStep.updateStepOptions({
                          attachTo: step.attachTo
                        });
                      }
                    }, 100);
                  }
                }, 500);

                intervalsRef.current.push(interval);
              },
              hide: () => {
                clearAllIntervals();
              },
            }
          : undefined,
      });
    });

    tour.on("complete", () => {
      clearAllIntervals();
      markTourCompleted(tourId);
      options?.onComplete?.();
    });

    tour.on("cancel", () => {
      clearAllIntervals();
      markTourCompleted(tourId);
    });

    tourRef.current = tour;
    return tour;
  }, [tourId, steps, options, clearAllIntervals]);

  const startTour = useCallback(() => {
    const tour = createTour();
    // Small delay to ensure DOM elements are ready
    setTimeout(() => {
      tour.start();
    }, 300);
  }, [createTour]);

  const restartTour = useCallback(() => {
    resetTourCompletion(tourId);
    startTour();
  }, [tourId, startTour]);

  useEffect(() => {
    if (autoStart && !isTourCompleted(tourId) && steps.length > 0) {
      // Delay to allow page to fully render
      const timer = setTimeout(() => {
        startTour();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoStart, tourId, steps.length, startTour]);

  useEffect(() => {
    return () => {
      if (tourRef.current) {
        tourRef.current.complete();
      }
    };
  }, []);

  return {
    startTour,
    restartTour,
    isCompleted: isTourCompleted(tourId),
  };
};
