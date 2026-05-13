import AsyncStorage from '@react-native-async-storage/async-storage';

const POSITION_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const TLE_URL = 'https://api.wheretheiss.at/v1/satellites/25544/tles';
const POS_CACHE_KEY = 'astravault:iss_position_v1';
const POS_CACHE_TTL_MS = 5_000;

export interface IssPosition {
  name: string;
  latitude: number;
  longitude: number;
  altitudeKm: number;
  velocityKmh: number;
  visibility: 'daylight' | 'eclipsed' | string;
  timestamp: number;
}

interface RawIssResponse {
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
  timestamp: number;
}

interface CacheEnvelope {
  fetchedAt: number;
  data: IssPosition;
}

export const fetchIssPosition = async (): Promise<IssPosition> => {
  const cached = await readCache();
  if (cached) return cached;

  const res = await fetch(POSITION_URL);
  if (!res.ok) {
    throw new Error(`ISS position fetch failed: ${res.status}`);
  }
  const raw = (await res.json()) as RawIssResponse;
  const data: IssPosition = {
    name: raw.name,
    latitude: raw.latitude,
    longitude: raw.longitude,
    altitudeKm: raw.altitude,
    velocityKmh: raw.velocity,
    visibility: raw.visibility,
    timestamp: raw.timestamp * 1000,
  };
  await writeCache(data);
  return data;
};

const readCache = async (): Promise<IssPosition | null> => {
  try {
    const raw = await AsyncStorage.getItem(POS_CACHE_KEY);
    if (!raw) return null;
    const envelope = JSON.parse(raw) as CacheEnvelope;
    if (Date.now() - envelope.fetchedAt > POS_CACHE_TTL_MS) return null;
    return envelope.data;
  } catch {
    return null;
  }
};

const writeCache = async (data: IssPosition): Promise<void> => {
  const envelope: CacheEnvelope = { fetchedAt: Date.now(), data };
  await AsyncStorage.setItem(POS_CACHE_KEY, JSON.stringify(envelope));
};

const EARTH_RADIUS_KM = 6371;

export const distanceKm = (
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number => {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
};

/**
 * Crude "is the ISS overhead-ish" estimate from the surface ground track.
 * The ISS is visible from anywhere within roughly 2,200 km of its sub-satellite point
 * given its ~408 km altitude. Returns `true` when the user's location is inside that disc.
 */
export const isIssOverhead = (
  userLocation: { lat: number; lng: number },
  iss: IssPosition,
): boolean =>
  distanceKm(userLocation, { lat: iss.latitude, lng: iss.longitude }) < 2200;
