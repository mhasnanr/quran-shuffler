import ReviewList from "@/components/ReviewList";
import { useReviewItems } from "@/hooks/useReviewItems";
import { useAppState } from "@/hooks/useAppState";
import { Seo } from "@/components/Seo";

const ReviewPage = () => {
  const { reviewItems, removeReviewItem } = useReviewItems();
  const { showTranslation } = useAppState();

  return (
    <>
      <Seo
        title="Review — Quran Shuffler"
        description="Spaced-repetition list of ayat you've marked for review. Focus your murojaah on weak spots."
        path="/review"
      />
      <ReviewList
        items={reviewItems}
        onComplete={removeReviewItem}
        showTranslation={showTranslation}
      />
    </>
  );
};

export default ReviewPage;
