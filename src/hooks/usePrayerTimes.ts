import { useState, useEffect } from 'react';

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface PrayerTimesData {
  times: PrayerTimes | null;
  location: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePrayerTimes = (): PrayerTimesData => {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayerTimes = async (latitude: number, longitude: number) => {
    try {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=20`
      );

      if (!response.ok) throw new Error('Failed to fetch prayer times');

      const data = await response.json();
      const timings = data.data.timings;

      setTimes({
        Fajr: timings.Fajr,
        Sunrise: timings.Sunrise,
        Dhuhr: timings.Dhuhr,
        Asr: timings.Asr,
        Maghrib: timings.Maghrib,
        Isha: timings.Isha,
      });

      // Try to get location name
      try {
        const geoResponse = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const geoData = await geoResponse.json();
        setLocation(geoData.city || geoData.locality || 'Your Location');
      } catch {
        setLocation('Your Location');
      }

      setError(null);
    } catch (err) {
      setError('Failed to fetch prayer times');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem('prayer-location', JSON.stringify({ latitude, longitude }));
        fetchPrayerTimes(latitude, longitude);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Please enable location access to get prayer times');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  useEffect(() => {
    // Check for cached location first
    const cached = localStorage.getItem('prayer-location');
    if (cached) {
      const { latitude, longitude } = JSON.parse(cached);
      fetchPrayerTimes(latitude, longitude);
    } else {
      getLocation();
    }
  }, []);

  return {
    times,
    location,
    loading,
    error,
    refetch: getLocation,
  };
};
