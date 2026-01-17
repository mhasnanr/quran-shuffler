import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isOnboardingComplete } from "@/hooks/useOnboarding";

interface OnboardingRedirectProps {
  children: React.ReactNode;
}

/**
 * Redirects new users to the settings page for onboarding.
 * Only redirects once on initial app load, not on subsequent navigations.
 */
const OnboardingRedirect = ({ children }: OnboardingRedirectProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const needsOnboarding = !isOnboardingComplete();
    const onSettingsPage = location.pathname === "/settings";

    if (needsOnboarding && !onSettingsPage) {
      navigate("/settings", { replace: true });
    }
    // Always set ready if already on /settings or onboarding complete
    // This ensures after navigation, children will render
    if (!needsOnboarding || onSettingsPage) {
      setReady(true);
    } else {
      setReady(false);
    }
  }, [location.pathname, navigate]);

  // Don't render children until ready (redirect complete or onboarding done)
  if (!ready) {
    return null;
  }

  return <>{children}</>;
};

export default OnboardingRedirect;
