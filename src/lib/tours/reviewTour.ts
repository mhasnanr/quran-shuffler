import { TourStep } from "@/hooks/useTour";

export const reviewTourSteps: TourStep[] = [
  {
    id: "review-intro",
    title: "Halaman Review 🔄",
    text: "Di sini kamu bisa melihat surat-surat yang sudah kamu tandai untuk direview ulang. Selamat menghafal!",
  },
  {
    id: "review-list",
    title: "Item Review",
    text: "Setiap item menampilkan surat yang perlu kamu review. Klik untuk melihat ayatnya.",
    attachTo: {
      element: "[data-tour='review-list']",
      on: "bottom",
    },
  },
  {
    id: "review-actions",
    title: "Aksi Review",
    text: "Setelah selesai mereview, kamu bisa menandai selesai atau menghapus dari daftar.",
    attachTo: {
      element: "[data-tour='review-actions']",
      on: "top",
    },
  },
];

export const REVIEW_TOUR_ID = "review-tour";
