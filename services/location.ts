import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'astravault:last_known_location_v1';

export interface UserLocation {
  latitude: number;
  longitude: number;
  altitude: number | null;
  capturedAt: number;
}

export type LocationStatus =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'unavailable'
  | 'restored';

export interface UseLocationResult {
  location: UserLocation | null;
  status: LocationStatus;
  request: () => Promise<UserLocation | null>;
  error: string | null;
}

const readCache = async (): Promise<UserLocation | null> => {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserLocation;
  } catch {
    return null;
  }
};

const writeCache = async (loc: UserLocation): Promise<void> => {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(loc));
};

export const requestLocation = async (): Promise<UserLocation | null> => {
  const perm = await Location.requestForegroundPermissionsAsync();
  if (perm.status !== 'granted') return null;
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const loc: UserLocation = {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    altitude: pos.coords.altitude,
    capturedAt: Date.now(),
  };
  await writeCache(loc);
  return loc;
};

export const useLocation = (autoRequest = false): UseLocationResult => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    readCache().then((cached) => {
      if (!cancelled && cached) {
        setLocation(cached);
        setStatus('restored');
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const request = async (): Promise<UserLocation | null> => {
    setStatus('requesting');
    setError(null);
    try {
      const loc = await requestLocation();
      if (loc) {
        setLocation(loc);
        setStatus('granted');
        return loc;
      }
      setStatus('denied');
      return null;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setStatus('unavailable');
      return null;
    }
  };

  useEffect(() => {
    if (autoRequest && status === 'idle') {
      void request();
    }
  }, [autoRequest, status]);

  return { location, status, request, error };
};
