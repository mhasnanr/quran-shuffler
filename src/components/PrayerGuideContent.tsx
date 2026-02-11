import { useState } from 'react';
import { prayerReadings, categoryLabels, PrayerReading } from '@/data/prayerReadings';
import { cn } from '@/lib/utils';
import PrayerTimesCard from './PrayerTimesCard';

type TranslationLang = 'id' | 'en';

const PrayerReadingCard = ({
  readings,
  translationLang
}: {
  readings: PrayerReading[];
  translationLang: TranslationLang;
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const hasVariants = readings.length > 1;
  const currentReading = readings[activeTab];

  return (
    <div className="rounded-xl bg-card p-4 shadow-card space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-primary">
          {currentReading.name}
        </h3>
      </div>

      {/* Tabs for variants */}
      {hasVariants && (
        <div className="flex justify-end">
          <div className="inline-flex gap-1 p-1 bg-muted/50 rounded-lg">
            {readings.map((reading, index) => {
              const variantLabel = reading.variant
                ? `${translationLang === 'id' ? 'Versi' : 'Version'} ${reading.variant}`
                : `${translationLang === 'id' ? 'Versi' : 'Version'} ${index + 1}`;

              return (
                <button
                  key={reading.id}
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "py-1.5 px-3 text-xs font-medium rounded-md transition-all whitespace-nowrap",
                    activeTab === index
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {variantLabel}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p
        className="font-arabic text-lg leading-loose text-foreground text-right"
        dir="rtl"
      >
        {currentReading.arabic}
      </p>

      <div className="pt-2 border-t border-border">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {translationLang === 'id' ? currentReading.indonesian : currentReading.english}
        </p>
      </div>
    </div>
  );
};

const PrayerGuideContent = () => {
  const [translationLang, setTranslationLang] = useState<TranslationLang>('id');

  // Group readings by category and then by name
  const groupedReadings = prayerReadings.reduce((acc, reading) => {
    if (!acc[reading.category]) {
      acc[reading.category] = {};
    }
    if (!acc[reading.category][reading.name]) {
      acc[reading.category][reading.name] = [];
    }
    acc[reading.category][reading.name].push(reading);
    return acc;
  }, {} as Record<string, Record<string, PrayerReading[]>>);

  const categoryOrder = ['opening', 'standing', 'bowing', 'prostration', 'sitting', 'closing'];

  return (
    <div className="space-y-6">
      {/* Prayer Times based on Location */}
      <PrayerTimesCard />
      {/* Translation Language Toggle */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-3 -mx-4 px-4 pt-1">
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setTranslationLang('id')}
            className={cn(
              "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all",
              translationLang === 'id'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Indonesia
          </button>
          <button
            onClick={() => setTranslationLang('en')}
            className={cn(
              "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all",
              translationLang === 'en'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            English
          </button>
        </div>
      </div>

      {/* Content */}
      {categoryOrder.map((category) => {
        const readingsByName = groupedReadings[category];
        if (!readingsByName) return null;

        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <h2 className="text-sm font-semibold text-foreground">
                {translationLang === 'id'
                  ? categoryLabels[category].id
                  : categoryLabels[category].en}
              </h2>
            </div>

            <div className="space-y-3">
              {Object.values(readingsByName).map((readings) => (
                <PrayerReadingCard
                  key={readings[0].id}
                  readings={readings}
                  translationLang={translationLang}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PrayerGuideContent;
