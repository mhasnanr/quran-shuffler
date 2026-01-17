import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TourProvider } from "./contexts/TourContext";
import Layout from "./components/Layout";
import OnboardingRedirect from "./components/OnboardingRedirect";
import SchedulePage from "./pages/SchedulePage";
import GuidePage from "./pages/GuidePage";
import ReviewPage from "./pages/ReviewPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TourProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <OnboardingRedirect>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<SchedulePage />} />
                <Route path="/guide" element={<GuidePage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </OnboardingRedirect>
        </BrowserRouter>
      </TourProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
