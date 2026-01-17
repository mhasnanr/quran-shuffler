import ReviewList from "@/components/ReviewList";
import { useReviewItems } from "@/hooks/useReviewItems";

const ReviewPage = () => {
  const { reviewItems, removeReviewItem } = useReviewItems();

  return (
    <ReviewList
      items={reviewItems}
      onRemove={removeReviewItem}
      onComplete={removeReviewItem}
    />
  );
};

export default ReviewPage;
