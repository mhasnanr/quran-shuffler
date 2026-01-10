export interface SurahChunk {
  id: string; // e.g., "2-1-50" for Al-Baqarah ayah 1-50
  surahNumber: number;
  surahName: string;
  arabicName: string;
  startAyah: number;
  endAyah: number;
  totalVerses: number;
}

export interface SurahConfig {
  surahNumber: number;
  enabled: boolean;
  chunks: AyahRange[];
}

export interface AyahRange {
  start: number;
  end: number;
}

// Generate chunk ID
export const getChunkId = (surahNumber: number, startAyah: number, endAyah: number): string => {
  return `${surahNumber}-${startAyah}-${endAyah}`;
};

// Default chunk size for long surahs
export const DEFAULT_CHUNK_SIZE = 20;

// Generate default chunks for a surah based on verse count
export const generateDefaultChunks = (totalVerses: number, chunkSize: number = DEFAULT_CHUNK_SIZE): AyahRange[] => {
  if (totalVerses <= chunkSize) {
    return [{ start: 1, end: totalVerses }];
  }
  
  const chunks: AyahRange[] = [];
  let start = 1;
  
  while (start <= totalVerses) {
    const end = Math.min(start + chunkSize - 1, totalVerses);
    chunks.push({ start, end });
    start = end + 1;
  }
  
  return chunks;
};
