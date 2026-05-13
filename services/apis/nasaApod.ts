import AsyncStorage from '@react-native-async-storage/async-storage';

const APOD_URL = 'https://api.nasa.gov/planetary/apod';
const DEFAULT_API_KEY = 'DEMO_KEY';
const CACHE_PREFIX = 'astravault:apod_cache_v1';
const CACHE_TTL_MS = 60 * 60 * 1000;

export interface ApodEntry {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  copyright?: string;
  service_version?: string;
}

interface CacheEnvelope {
  fetchedAt: number;
  data: ApodEntry;
}

export const fetchApod = async (params?: {
  date?: string;
  apiKey?: string;
}): Promise<ApodEntry> => {
  const cacheKey = `${CACHE_PREFIX}:${params?.date ?? 'today'}`;
  const cached = await readCache(cacheKey);
  if (cached) return cached;

  const url = new URL(APOD_URL);
  url.searchParams.set('api_key', params?.apiKey ?? DEFAULT_API_KEY);
  if (params?.date) url.searchParams.set('date', params.date);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`APOD request failed: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as ApodEntry;
  await writeCache(cacheKey, data);
  return data;
};

const readCache = async (key: string): Promise<ApodEntry | null> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const envelope = JSON.parse(raw) as CacheEnvelope;
    if (Date.now() - envelope.fetchedAt > CACHE_TTL_MS) return null;
    return envelope.data;
  } catch {
    return null;
  }
};

const writeCache = async (key: string, data: ApodEntry): Promise<void> => {
  const envelope: CacheEnvelope = { fetchedAt: Date.now(), data };
  await AsyncStorage.setItem(key, JSON.stringify(envelope));
};
