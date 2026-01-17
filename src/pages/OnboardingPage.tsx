import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { resetOnboarding } from "@/hooks/useOnboarding";
import { useTour, TourStep } from "@/hooks/useTour";
import { SETTINGS_TOUR_ID } from "@/lib/tours/settingsTour";

const onboardingSteps: TourStep[] = [
  {
    id: "onboarding-intro",
    title: "Welcome to Quran Shuffler!",
    text: "Klik Start untuk mulai onboarding dan mengatur preferensi bacaan.",
    buttons: [
      {
        text: "Start",
        action: "next",
        classes: "shepherd-button-primary",
      },
    ],
  },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { startTour } = useTour(SETTINGS_TOUR_ID, onboardingSteps, false, {
    onComplete: () => {
      // Setelah klik Start, redirect ke /settings
      navigate("/settings");
    },
  });

  useEffect(() => {
    // Reset onboarding state setiap kali buka halaman ini
    resetOnboarding();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Quran Shuffler</h1>
      <p className="mb-6 text-center">
        Selamat datang! Klik tombol di bawah untuk memulai onboarding.
      </p>
      <Button onClick={startTour} className="px-8 py-2 text-lg">
        Start Onboarding
      </Button>
    </div>
  );
};

export default OnboardingPage;
