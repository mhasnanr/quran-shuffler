import { useEffect, useMemo } from "react";
import ReviewList from "@/components/ReviewList";
import { useReviewItems } from "@/hooks/useReviewItems";
import { useTour } from "@/hooks/useTour";
import { useTourContext } from "@/contexts/TourContext";
import { reviewTourSteps, REVIEW_TOUR_ID } from "@/lib/tours/reviewTour";
import { markOnboardingComplete } from "@/hooks/useOnboarding";

const ReviewPage = () => {
  const { reviewItems, removeReviewItem } = useReviewItems();

  // Filter tour steps based on whether there are review items
  const filteredTourSteps = useMemo(() => {
    if (reviewItems.length === 0) {
      // Only show intro if no review items
      return reviewTourSteps.filter((step) => step.id === "review-intro");
    }
    return reviewTourSteps;
  }, [reviewItems.length]);

  // Mark onboarding complete after review tour
  const tourOptions = useMemo(
    () => ({
      onComplete: () => {
        markOnboardingComplete();
      },
    }),
    [],
  );

  const { restartTour } = useTour(
    REVIEW_TOUR_ID,
    filteredTourSteps,
    true,
    tourOptions,
  );
  const { setRestartHandler } = useTourContext();

  useEffect(() => {
    setRestartHandler(restartTour);
    return () => setRestartHandler(null);
  }, [restartTour, setRestartHandler]);

  return (
    <ReviewList
      items={reviewItems}
      onRemove={removeReviewItem}
      onComplete={removeReviewItem}
    />
  );
};

export default ReviewPage;
