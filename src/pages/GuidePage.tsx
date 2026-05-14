import PrayerGuideContent from "@/components/PrayerGuideContent";
import { Seo } from "@/components/Seo";

const GuidePage = () => {
  return (
    <>
      <Seo
        title="Prayer Guide — Quran Shuffler"
        description="Step-by-step Islamic prayer guide: rakaat structure, recommended surahs, and recitation order for each daily prayer."
        path="/guide"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Daily Prayer Guide",
          description:
            "How to perform the five daily prayers with recommended Quran recitation for each rakaat.",
          author: { "@type": "Organization", name: "Quran Shuffler" },
        }}
      />
      <PrayerGuideContent />
    </>
  );
};

export default GuidePage;
