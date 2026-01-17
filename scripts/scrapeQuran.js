// Script to scrape all Quran data from API and save locally
// Run with: node scripts/scrapeQuran.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = "https://api.alquran.cloud/v1";

// All 114 surahs
const TOTAL_SURAHS = 114;

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.log(`  Retry ${i + 1}/${retries} for ${url}`);
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

async function scrapeSurah(surahNumber) {
  console.log(`Fetching surah ${surahNumber}...`);

  const [arabicData, englishData, indonesianData] = await Promise.all([
    fetchWithRetry(`${API_BASE}/surah/${surahNumber}`),
    fetchWithRetry(`${API_BASE}/surah/${surahNumber}/en.sahih`),
    fetchWithRetry(`${API_BASE}/surah/${surahNumber}/id.indonesian`),
  ]);

  const surahInfo = arabicData.data;

  const ayahs = surahInfo.ayahs.map((arabicAyah, index) => {
    const englishAyah = englishData.data.ayahs[index];
    const indonesianAyah = indonesianData.data.ayahs[index];

    return {
      number: arabicAyah.numberInSurah,
      arabic: arabicAyah.text,
      english: englishAyah?.text || "",
      indonesian: indonesianAyah?.text || "",
    };
  });

  return {
    number: surahInfo.number,
    name: surahInfo.name,
    englishName: surahInfo.englishName,
    englishNameTranslation: surahInfo.englishNameTranslation,
    numberOfAyahs: surahInfo.numberOfAyahs,
    revelationType: surahInfo.revelationType,
    ayahs,
  };
}

async function scrapeAllQuran() {
  console.log("Starting Quran scraping...\n");

  const quranData = {
    metadata: {
      scrapedAt: new Date().toISOString(),
      source: "api.alquran.cloud",
      arabicEdition: "quran-uthmani",
      englishEdition: "en.sahih",
      indonesianEdition: "id.indonesian",
    },
    surahs: [],
  };

  // Process surahs in batches to avoid rate limiting
  const BATCH_SIZE = 5;

  for (let i = 1; i <= TOTAL_SURAHS; i += BATCH_SIZE) {
    const batch = [];
    const end = Math.min(i + BATCH_SIZE - 1, TOTAL_SURAHS);

    for (let j = i; j <= end; j++) {
      batch.push(scrapeSurah(j));
    }

    const results = await Promise.all(batch);
    quranData.surahs.push(...results);

    console.log(`Completed surahs ${i}-${end}\n`);

    // Small delay between batches
    if (end < TOTAL_SURAHS) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  // Save to file
  const outputPath = path.join(
    __dirname,
    "..",
    "src",
    "data",
    "quranOffline.json",
  );
  fs.writeFileSync(outputPath, JSON.stringify(quranData, null, 2), "utf-8");

  console.log(`\n✅ Quran data saved to ${outputPath}`);
  console.log(`Total surahs: ${quranData.surahs.length}`);
  console.log(
    `Total ayahs: ${quranData.surahs.reduce((sum, s) => sum + s.ayahs.length, 0)}`,
  );
}

scrapeAllQuran().catch(console.error);
