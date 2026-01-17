# Quran Shuffler

Quran Shuffler is a daily Quran recitation planner and tracker. It helps you plan, shuffle, and track your Quran reading across your daily prayers, making it easier to complete the Quran and stay consistent. The app is accessible, mobile-friendly, and privacy-focused.

## Features

- **Daily Recitation Planner:** Automatically assigns Quran passages (chunks) to your daily prayers.
- **Prayer Configuration:** Customize which prayers are included and how many rakaat (units) to recite for each.
- **Juz & Surah Selection:** Select which Juz or Surahs to focus on.
- **Chunk Mode:** Split recitation into manageable chunks (configurable size).
- **Review System:** Mark ayat for review and track your progress.
- **Temporary Prayers:** Add extra prayers for special occasions or catch-up.
- **Offline Support:** Works offline with a local copy of the Quran.
- **PWA:** Installable as a Progressive Web App.
- **Multi-language Translations:** Supports Indonesian and English translations.
- **Prayer Guide:** Includes a guide for prayer recitations and movements.
- **Prayer Times:** Fetches local prayer times automatically.

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) for offline/PWA support

## Getting Started

1. **Clone the repository:**

   ```sh
   git clone https://github.com/mhasnanr/quran-shuffler
   cd quran-shuffler
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Start the development server:**

   ```sh
   npm run dev
   ```

4. **Build for production:**

   ```sh
   npm run build
   ```

5. **Preview the production build:**
   ```sh
   npm run preview
   ```

## Project Structure

- `src/` — Main application source code
  - `components/` — React UI components
  - `data/` — Static data (Quran, prayer readings, etc.)
  - `hooks/` — Custom React hooks
  - `pages/` — Top-level pages/routes
  - `types/` — TypeScript types and interfaces
  - `lib/` — Utility functions

## License

This project is open source and available under the MIT License.
