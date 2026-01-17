import { TourStep } from "@/hooks/useTour";

export const settingsTourSteps: TourStep[] = [
  {
    id: "settings-intro",
    title: "Selamat Datang! 🕌",
    text: "Mari kita mulai dengan mengatur preferensi bacaan Al-Quran kamu. Ikuti panduan ini untuk setup awal.",
  },
  {
    id: "prayer-config",
    title: "Pengaturan Shalat",
    text: "Aktifkan/nonaktifkan shalat yang ingin dimasukkan ke jadwal, dan atur jumlah rakaatnya.",
    attachTo: {
      element: "[data-tour='prayer-config']",
      on: "bottom",
    },
  },
  {
    id: "juz-selector",
    title: "Pilih Juz",
    text: "Pilih juz Al-Quran yang ingin kamu baca. Kamu bisa memilih lebih dari satu juz.",
    attachTo: {
      element: "[data-tour='juz-selector']",
      on: "bottom",
    },
  },
  {
    id: "chunk-mode",
    title: "Mode Chunk",
    text: "Aktifkan mode chunk untuk membagi surat panjang menjadi bagian-bagian kecil yang lebih mudah dihafal.",
    attachTo: {
      element: "[data-tour='chunk-mode']",
      on: "bottom",
    },
  },
  {
    id: "translation-toggle",
    title: "Tampilkan Terjemahan",
    text: "Atur apakah terjemahan ditampilkan saat melihat ayat.",
    attachTo: {
      element: "[data-tour='translation-toggle']",
      on: "bottom",
    },
  },
  {
    id: "surah-list",
    title: "Daftar Surat",
    text: "Pilih surat-surat yang ingin dimasukkan ke dalam rotasi bacaan.",
    attachTo: {
      element: "[data-tour='surah-list']",
      on: "top",
    },
  },
  {
    id: "reset-pool",
    title: "Reset Pool",
    text: "Jika semua surat sudah pernah dibaca, klik reset untuk mengulang dari awal. Selanjutnya, kita ke halaman Jadwal!",
    attachTo: {
      element: "[data-tour='reset-pool']",
      on: "top",
    },
  },
];

export const SETTINGS_TOUR_ID = "settings-tour";
