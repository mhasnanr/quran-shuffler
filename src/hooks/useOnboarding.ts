import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const ONBOARDING_KEY = "quran-shuffler-onboarding-complete";

export const isOnboardingComplete = (): boolean => {
  return localStorage.getItem(ONBOARDING_KEY) === "true";
};

export const markOnboardingComplete = () => {
  localStorage.setItem(ONBOARDING_KEY, "true");
};

export const resetOnboarding = () => {
  localStorage.removeItem(ONBOARDING_KEY);
  // Also reset individual tour completions
  const keys = Object.keys(localStorage).filter((key) =>
    key.startsWith("quran-shuffler-tour-")
  );
  keys.forEach((key) => localStorage.removeItem(key));
};

export const useOnboarding = () => {
  const navigate = useNavigate();

  const startOnboarding = useCallback(() => {
    resetOnboarding();
    navigate("/settings");
  }, [navigate]);

  const completeOnboarding = useCallback(() => {
    markOnboardingComplete();
  }, []);

  const navigateToNextStep = useCallback((currentStep: "settings" | "schedule" | "review") => {
    switch (currentStep) {
      case "settings":
        navigate("/");
        break;
      case "schedule":
        navigate("/review");
        break;
      case "review":
        markOnboardingComplete();
        break;
    }
  }, [navigate]);

  return {
    isComplete: isOnboardingComplete(),
    startOnboarding,
    completeOnboarding,
    navigateToNextStep,
  };
};
