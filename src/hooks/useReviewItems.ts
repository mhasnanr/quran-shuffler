import { useState, useEffect, useCallback } from 'react';
import { ReviewItem, REVIEW_STORAGE_KEY } from '@/types/review';

export const useReviewItems = () => {
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>(() => {
    const stored = localStorage.getItem(REVIEW_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviewItems));
  }, [reviewItems]);

  const addReviewItem = useCallback((item: Omit<ReviewItem, 'id' | 'addedAt'>) => {
    const newItem: ReviewItem = {
      ...item,
      id: `${item.surahNumber}-${item.startAyah}-${item.endAyah}-${Date.now()}`,
      addedAt: new Date().toISOString(),
      forgottenAyahs: item.forgottenAyahs || [],
    };

    // Check if already exists (same surah and range)
    setReviewItems(prev => {
      const exists = prev.some(
        r => r.surahNumber === item.surahNumber &&
             r.startAyah === item.startAyah &&
             r.endAyah === item.endAyah
      );
      if (exists) return prev;
      return [...prev, newItem];
    });
  }, []);

  const removeReviewItem = useCallback((id: string) => {
    setReviewItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearAllReviewItems = useCallback(() => {
    setReviewItems([]);
  }, []);

  return {
    reviewItems,
    addReviewItem,
    removeReviewItem,
    clearAllReviewItems,
  };
};
