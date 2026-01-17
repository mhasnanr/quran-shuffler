import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface TourContextType {
  restartCurrentTour: () => void;
  setRestartHandler: (handler: (() => void) | null) => void;
}

const TourContext = createContext<TourContextType | null>(null);

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [restartHandler, setRestartHandler] = useState<(() => void) | null>(null);

  const restartCurrentTour = useCallback(() => {
    if (restartHandler) {
      restartHandler();
    }
  }, [restartHandler]);

  const setHandler = useCallback((handler: (() => void) | null) => {
    setRestartHandler(() => handler);
  }, []);

  return (
    <TourContext.Provider value={{ restartCurrentTour, setRestartHandler: setHandler }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTourContext = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTourContext must be used within a TourProvider");
  }
  return context;
};
