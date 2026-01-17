import { useEffect } from "react";
import PrayerGuideContent from "@/components/PrayerGuideContent";
import { useTour } from "@/hooks/useTour";
import { useTourContext } from "@/contexts/TourContext";
import { guideTourSteps, GUIDE_TOUR_ID } from "@/lib/tours/guideTour";

const GuidePage = () => {
  const { restartTour } = useTour(GUIDE_TOUR_ID, guideTourSteps);
  const { setRestartHandler } = useTourContext();

  useEffect(() => {
    setRestartHandler(restartTour);
    return () => setRestartHandler(null);
  }, [restartTour, setRestartHandler]);

  return (
    <div data-tour="guide-content">
      <PrayerGuideContent />
    </div>
  );
};

export default GuidePage;
