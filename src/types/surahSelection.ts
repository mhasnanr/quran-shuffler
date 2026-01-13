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

// Storage key for chunk size preference
export const CHUNK_SIZE_STORAGE_KEY = 'quran-shuffler-chunk-size';

// Minimum remaining ayahs before merging with previous chunk
const MIN_REMAINDER = 3;

// Generate default chunks for a surah based on verse count
// Smart chunking: if remainder would be less than MIN_REMAINDER, merge with previous chunk
export const generateDefaultChunks = (totalVerses: number, chunkSize: number = DEFAULT_CHUNK_SIZE): AyahRange[] => {
  if (totalVerses <= chunkSize) {
    return [{ start: 1, end: totalVerses }];
  }
  
  const chunks: AyahRange[] = [];
  let start = 1;
  
  while (start <= totalVerses) {
    const remaining = totalVerses - start + 1;
    
    // If remaining ayahs fit in one chunk, take them all
    if (remaining <= chunkSize) {
      chunks.push({ start, end: totalVerses });
      break;
    }
    
    // Check if next chunk would leave a small remainder
    const afterThisChunk = remaining - chunkSize;
    if (afterThisChunk > 0 && afterThisChunk < MIN_REMAINDER) {
      // Split more evenly: divide remaining into two roughly equal parts
      const halfRemaining = Math.ceil(remaining / 2);
      chunks.push({ start, end: start + halfRemaining - 1 });
      start = start + halfRemaining;
    } else {
      // Normal chunk
      const end = start + chunkSize - 1;
      chunks.push({ start, end });
      start = end + 1;
    }
  }
  
  return chunks;
};
