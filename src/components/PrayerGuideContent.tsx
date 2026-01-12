import { useState } from 'react';
import { prayerReadings, categoryLabels, PrayerReading } from '@/data/prayerReadings';
import { cn } from '@/lib/utils';

type TranslationLang = 'id' | 'en';

const PrayerGuideContent = () => {
  const [translationLang, setTranslationLang] = useState<TranslationLang>('id');

  const groupedReadings = prayerReadings.reduce((acc, reading) => {
    if (!acc[reading.category]) {
      acc[reading.category] = [];
    }
    acc[reading.category].push(reading);
    return acc;
  }, {} as Record<string, PrayerReading[]>);

  const categoryOrder = ['opening', 'standing', 'bowing', 'prostration', 'sitting', 'closing'];

  return (
    <div className="space-y-6">
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
        const readings = groupedReadings[category];
        if (!readings) return null;

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
              {readings.map((reading) => (
                <div 
                  key={reading.id}
                  className="rounded-xl bg-card p-4 shadow-card space-y-3"
                >
                  <h3 className="text-sm font-medium text-primary">
                    {reading.name}
                  </h3>
                  
                  <p 
                    className="font-arabic text-lg leading-loose text-foreground text-right"
                    dir="rtl"
                  >
                    {reading.arabic}
                  </p>

                  <div className="pt-2 border-t border-border">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {translationLang === 'id' ? reading.indonesian : reading.english}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PrayerGuideContent;
