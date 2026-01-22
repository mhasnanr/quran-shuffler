import ReviewList from "@/components/ReviewList";
import { useReviewItems } from "@/hooks/useReviewItems";
import { useAppState } from "@/hooks/useAppState";

const ReviewPage = () => {
  const { reviewItems, removeReviewItem } = useReviewItems();
  const { showTranslation } = useAppState();

  return (
    <ReviewList
      items={reviewItems}
      onComplete={removeReviewItem}
      showTranslation={showTranslation}
    />
  );
};

export default ReviewPage;
