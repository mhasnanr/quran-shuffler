import { TourStep } from "@/hooks/useTour";

export const guideTourSteps: TourStep[] = [
  {
    id: "guide-intro",
    title: "Panduan Shalat 📖",
    text: "Halaman ini berisi panduan lengkap tentang tata cara shalat dan bacaan-bacaannya.",
  },
  {
    id: "guide-content",
    title: "Materi Panduan",
    text: "Baca dan pelajari panduan ini untuk memahami bacaan shalat dengan baik.",
    attachTo: {
      element: "[data-tour='guide-content']",
      on: "bottom",
    },
  },
];

export const GUIDE_TOUR_ID = "guide-tour";
