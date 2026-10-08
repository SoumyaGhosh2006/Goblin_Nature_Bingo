/**
 * ============================================================================
 * SILENT GEOLOCATION & REGIONAL CONTEXT HOOK — GOBLIN NATURE BINGO
 * ============================================================================
 * Requests browser GPS coordinates silently upon initial game load.
 * Resolves city, district, and state through lightweight reverse geocoding
 * to furnish the AI quest generator with precise Indian environmental context.
 * Silently falls back to general Indian nature if permission is declined.
 */

import { useState, useEffect } from 'react';

export interface UserLocationState {
  locationHint: string | null;
  latitude: number | null;
  longitude: number | null;
  isLocating: boolean;
}

export function useUserLocation(): UserLocationState {
  const [location, setLocation] = useState<UserLocationState>({
    locationHint: null,
    latitude: null,
    longitude: null,
    isLocating: true
  });

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocation({ locationHint: 'India', latitude: null, longitude: null, isLocating: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let hint = 'India';

        try {
          // Reverse geocode coordinates to obtain city and state name
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 4000);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            {
              headers: { 'User-Agent': 'GoblinNatureBingo/1.0' },
              signal: controller.signal
            }
          );
          clearTimeout(timeout);

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const city = addr.city || addr.town || addr.municipality || addr.county || addr.state_district;
            const state = addr.state;

            if (city && state) {
              hint = `${city}, ${state}`;
            } else if (state) {
              hint = `${state}, India`;
            } else if (city) {
              hint = `${city}, India`;
            }
          }
        } catch {
          // Non-blocking network fallback: keep general India
        }

        setLocation({
          locationHint: hint,
          latitude,
          longitude,
          isLocating: false
        });
      },
      () => {
        // Silently default to India if permission is denied or timed out
        setLocation({
          locationHint: 'India',
          latitude: null,
          longitude: null,
          isLocating: false
        });
      },
      { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 }
    );
  }, []);

  return location;
}
